from __future__ import annotations
import argparse
import logging
import json
from pathlib import Path
from typing import Tuple

import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import classification_report, accuracy_score
from sklearn.preprocessing import LabelEncoder
import joblib

# optional: handle class imbalance
from imblearn.over_sampling import RandomOverSampler

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger("train_model")


def load_data(path: Path) -> pd.DataFrame:
    """Load CSV file. Expects a column named 'career' (target) and text fields (text, interests, etc.)."""
    logger.info("Loading data from %s", path)
    df = pd.read_csv(path)
    if df.empty:
        raise RuntimeError("Loaded dataframe is empty.")
    return df


def build_text_field(df: pd.DataFrame, text_col: str = "text", interests_col: str = "interests") -> pd.Series:
    """
    Create a single text field the model will use.
    - If 'text' column exists, use it.
    - If 'interests' is a list-like stored as string or actual list, join it.
    - Output is a single string per row.
    """
    texts = []
    for _, row in df.iterrows():
        parts = []
        # core free-text
        if text_col in row and pd.notna(row[text_col]) and str(row[text_col]).strip():
            parts.append(str(row[text_col]).strip())
        # interests might be a JSON-ish list string or a comma-separated string
        if interests_col in row and pd.notna(row[interests_col]):
            v = row[interests_col]
            if isinstance(v, (list, tuple)):
                parts.append(" ".join([str(x) for x in v if str(x).strip()]))
            else:
                s = str(v)
                # try simple JSON decode if looks like list
                if (s.startswith("[") and s.endswith("]")) or (s.startswith("(") and s.endswith(")")):
                    try:
                        parsed = json.loads(s)
                        if isinstance(parsed, (list, tuple)):
                            parts.append(" ".join([str(x) for x in parsed if str(x).strip()]))
                        else:
                            parts.append(s)
                    except Exception:
                        # fallback: replace commas with spaces
                        parts.append(s.replace(",", " "))
                else:
                    # comma-separated or space-separated plain string
                    parts.append(s.replace(",", " "))
        # join everything
        texts.append(" ".join(parts).strip())
    return pd.Series(texts)


def make_pipeline(random_state: int = 42) -> Pipeline:
    """
    Create a sklearn Pipeline:
      - TfidfVectorizer (sublinear_tf, max_features tuned for speed)
      - LogisticRegression (multinomial-like with solver 'saga' for many classes)
    """
    tfidf = TfidfVectorizer(
        lowercase=True,
        stop_words="english",
        ngram_range=(1, 2),
        max_features=50_000,  # adjust based on memory/dataset size
    )

    clf = LogisticRegression(
        solver="saga",
        penalty="l2",
        max_iter=2000,
        C=1.0,
        random_state=random_state,
        n_jobs=-1,
    )

    pipe = Pipeline([("tfidf", tfidf), ("clf", clf)])
    return pipe


def train(
    df: pd.DataFrame,
    text_col: str = "text",
    interests_col: str = "interests",
    target_col: str = "career",
    test_size: float = 0.15,
    random_state: int = 42,
    oversample: bool = True,
) -> Tuple[Pipeline, LabelEncoder, pd.DataFrame, pd.DataFrame]:
    """
    Train pipeline and return (pipeline, label_encoder, X_test_df, y_test_df)
    """
    logger.info("Preparing text field...")
    X_text = build_text_field(df, text_col=text_col, interests_col=interests_col)
    y = df[target_col].astype(str)

    # encode labels
    le = LabelEncoder()
    y_enc = le.fit_transform(y)
    logger.info("Found %d unique target labels.", len(le.classes_))

    # split
    X_train_text, X_test_text, y_train_enc, y_test_enc = train_test_split(
        X_text, y_enc, test_size=test_size, random_state=random_state, stratify=y_enc if len(np.unique(y_enc)) > 1 else None
    )

    # Optional oversampling to handle imbalance
    if oversample:
        logger.info("Applying RandomOverSampler to balance classes (if imbalance present).")
        ros = RandomOverSampler(random_state=random_state)
        X_train_text = X_train_text.to_frame(name="text")
        X_train_text_res, y_train_enc = ros.fit_resample(X_train_text, y_train_enc)
        X_train_text = X_train_text_res["text"]
    else:
        X_train_text = X_train_text.reset_index(drop=True)

    # Build pipeline and train
    pipe = make_pipeline(random_state=random_state)
    logger.info("Training pipeline...")
    pipe.fit(X_train_text, y_train_enc)

    # Basic evaluation
    y_pred = pipe.predict(X_test_text)
    acc = accuracy_score(y_test_enc, y_pred)
    logger.info("Validation accuracy: %.4f", acc)
    logger.info("Classification report:\n%s", classification_report(y_test_enc, y_pred, zero_division=0))

    # cross-val (fast; optional)
    try:
        logger.info("Running 3-fold cross-validation (accuracy) on training split - may take time...")
        scores = cross_val_score(pipe, X_train_text, y_train_enc, cv=3, scoring="accuracy", n_jobs=1)
        logger.info("CV accuracy scores: %s ; mean=%.4f", scores.tolist(), scores.mean())
    except Exception as e:
        logger.warning("CV failed (skipping) - %s", e)

    # prepare test dataframe for downstream uses
    X_test_df = X_test_text.reset_index(drop=True).to_frame(name="text")
    y_test_df = pd.Series(y_test_enc, name="y").reset_index(drop=True)

    return pipe, le, X_test_df, y_test_df


def save_artifacts(pipe: Pipeline, le: LabelEncoder, out_dir: Path):
    out_dir.mkdir(parents=True, exist_ok=True)
    model_path = out_dir / "model.pkl"
    preproc_path = out_dir / "preprocessor.pkl"
    classes_path = out_dir / "title_classes.npy"

    logger.info("Saving pipeline to %s", model_path)
    joblib.dump(pipe, model_path)

    # save the tfidf vectorizer separately (named step 'tfidf')
    try:
        tfidf = pipe.named_steps.get("tfidf")
        if tfidf is not None:
            logger.info("Saving preprocessor (tfidf) to %s", preproc_path)
            joblib.dump(tfidf, preproc_path)
    except Exception as e:
        logger.warning("Could not save preprocessor separately: %s", e)

    # save classes
    np.save(classes_path, le.classes_)
    logger.info("Saved classes to %s (%d labels)", classes_path, len(le.classes_))


def predict_samples(pipe: Pipeline, le: LabelEncoder, texts: list[str]):
    """Helper to quickly predict using the trained pipeline."""
    preds = pipe.predict(texts)
    labels = le.inverse_transform(preds)
    probs = None
    if hasattr(pipe.named_steps["clf"], "predict_proba"):
        probs = pipe.predict_proba(texts)
    out = []
    for i, txt in enumerate(texts):
        item = {"text": txt, "label": labels[i]}
        if probs is not None:
            item["prob"] = probs[i].max().item()
        out.append(item)
    return out


def parse_args():
    p = argparse.ArgumentParser(description="Train Kanasu career prediction pipeline (cleaned version).")
    p.add_argument("--data", type=str, required=True, help="Path to CSV dataset (must contain 'career' column).")
    p.add_argument("--out_dir", type=str, default="app/models", help="Directory to save model artifacts.")
    p.add_argument("--text_col", type=str, default="text", help="Column name for free text inputs.")
    p.add_argument("--interests_col", type=str, default="interests", help="Column name for interests (list or string).")
    p.add_argument("--target_col", type=str, default="career", help="Target column name.")
    p.add_argument("--test_size", type=float, default=0.15, help="Test set fraction.")
    p.add_argument("--random_state", type=int, default=42, help="Random state for reproducibility.")
    p.add_argument("--no_oversample", dest="no_oversample", action="store_true", help="Do not oversample training set.")
    return p.parse_args()


def main():
    args = parse_args()
    data_path = Path(args.data)
    out_dir = Path(args.out_dir)

    if not data_path.exists():
        logger.error("Data file not found: %s", data_path)
        return

    df = load_data(data_path)
    pipe, le, X_test_df, y_test_df = train(
        df,
        text_col=args.text_col,
        interests_col=args.interests_col,
        target_col=args.target_col,
        test_size=args.test_size,
        random_state=args.random_state,
        oversample=(not args.no_oversample),
    )

    save_artifacts(pipe, le, out_dir)

    # sample predictions for quick sanity check
    sample_texts = X_test_df["text"].astype(str).head(5).tolist()
    sample_preds = predict_samples(pipe, le, sample_texts)
    logger.info("Sample predictions (first 5): %s", sample_preds)


if __name__ == "__main__":
    main()
