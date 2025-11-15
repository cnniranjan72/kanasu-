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
    logger.info("Loading data from %s", path)
    df = pd.read_csv(path)
    if df.empty:
        raise RuntimeError("Loaded dataframe is empty.")
    return df


def build_text_field(
    df: pd.DataFrame,
    text_col: str = "text",
    interests_col: str = "interests",
    extra_cols: list = ["education", "stream_code", "gender", "age"]
) -> pd.Series:
    """
    Combine text + interests + extra fields (education, stream_code, gender, age)
    into a single string per row.
    """
    texts = []

    for _, row in df.iterrows():
        parts = []

        # TEXT FIELD
        if text_col in df.columns and pd.notna(row.get(text_col, "")):
            parts.append(str(row[text_col]).strip())

        # INTERESTS FIELD
        if interests_col in df.columns and pd.notna(row.get(interests_col, "")):
            v = row[interests_col]
            if isinstance(v, (list, tuple)):
                parts.append(" ".join([str(x) for x in v]))
            else:
                s = str(v)
                # Try JSON decode
                if (s.startswith("[") and s.endswith("]")) or (s.startswith("(") and s.endswith(")")):
                    try:
                        parsed = json.loads(s)
                        if isinstance(parsed, (list, tuple)):
                            parts.append(" ".join([str(x) for x in parsed]))
                        else:
                            parts.append(s)
                    except:
                        parts.append(s.replace(",", " "))
                else:
                    parts.append(s.replace(",", " "))

        # EXTRA FIELDS → append as text
        for col in extra_cols:
            if col in df.columns and pd.notna(row.get(col, "")):
                parts.append(str(row[col]).replace("_", " "))

        texts.append(" ".join(parts).strip())

    return pd.Series(texts)


def make_pipeline(random_state: int = 42) -> Pipeline:
    tfidf = TfidfVectorizer(
        lowercase=True,
        stop_words="english",
        ngram_range=(1, 2),
        max_features=50_000,
    )

    clf = LogisticRegression(
        solver="saga",
        penalty="l2",
        max_iter=2000,
        C=1.0,
        random_state=random_state,
        n_jobs=-1,
    )

    return Pipeline([("tfidf", tfidf), ("clf", clf)])


def train(
    df: pd.DataFrame,
    text_col: str = "text",
    interests_col: str = "interests",
    target_col: str = "career",
    test_size: float = 0.15,
    random_state: int = 42,
    oversample: bool = True,
) -> Tuple[Pipeline, LabelEncoder, pd.DataFrame, pd.DataFrame]:

    logger.info("Preparing text field with all input features...")
    X_text = build_text_field(df, text_col=text_col, interests_col=interests_col)
    y = df[target_col].astype(str)

    le = LabelEncoder()
    y_enc = le.fit_transform(y)
    logger.info("Found %d target labels.", len(le.classes_))

    X_train_text, X_test_text, y_train_enc, y_test_enc = train_test_split(
        X_text, y_enc, test_size=test_size, random_state=random_state,
        stratify=y_enc if len(np.unique(y_enc)) > 1 else None
    )

    # HANDLE CLASS IMBALANCE
    if oversample:
        logger.info("Balancing dataset using RandomOverSampler...")
        ros = RandomOverSampler(random_state=random_state)
        X_train_text = X_train_text.to_frame(name="text")
        X_res, y_train_enc = ros.fit_resample(X_train_text, y_train_enc)
        X_train_text = X_res["text"]
    else:
        X_train_text = X_train_text.reset_index(drop=True)

    # TRAIN PIPELINE
    pipe = make_pipeline(random_state=random_state)
    logger.info("Training model...")
    pipe.fit(X_train_text, y_train_enc)

    # EVALUATION
    y_pred = pipe.predict(X_test_text)
    acc = accuracy_score(y_test_enc, y_pred)
    logger.info("Validation accuracy: %.4f", acc)
    logger.info("Classification report:\n%s",
                classification_report(y_test_enc, y_pred, zero_division=0))

    # OPTIONAL CROSS-VAL
    try:
        scores = cross_val_score(pipe, X_train_text, y_train_enc, cv=3,
                                 scoring="accuracy", n_jobs=1)
        logger.info("CV accuracy: %s mean=%.4f", scores.tolist(), scores.mean())
    except Exception as e:
        logger.warning("CV skipped: %s", e)

    X_test_df = X_test_text.reset_index(drop=True).to_frame(name="text")
    y_test_df = pd.Series(y_test_enc, name="y").reset_index(drop=True)

    return pipe, le, X_test_df, y_test_df


def save_artifacts(pipe: Pipeline, le: LabelEncoder, out_dir: Path):
    out_dir.mkdir(parents=True, exist_ok=True)

    joblib.dump(pipe, out_dir / "model.pkl")

    try:
        tfidf = pipe.named_steps.get("tfidf")
        if tfidf:
            joblib.dump(tfidf, out_dir / "preprocessor.pkl")
    except Exception as e:
        logger.warning("Failed to save preprocessor: %s", e)

    np.save(out_dir / "title_classes.npy", le.classes_)
    logger.info("Saved model + vectorizer + classes.")


def predict_samples(pipe: Pipeline, le: LabelEncoder, texts: list[str], top_k: int = 3):
    """
    Return Top-K predictions for sanity check.
    """
    probs = pipe.predict_proba(texts)
    out = []

    for i, txt in enumerate(texts):
        top_idx = np.argsort(probs[i])[::-1][:top_k]
        labels = le.inverse_transform(top_idx)
        scores = probs[i][top_idx]

        out.append({
            "text": txt,
            "top_predictions": [
                {"label": labels[j], "confidence": float(scores[j])}
                for j in range(len(labels))
            ]
        })

    return out


def parse_args():
    parser = argparse.ArgumentParser(description="Train Kanasu Career Prediction Model")
    parser.add_argument("--data", required=True, help="Path to CSV dataset.")
    parser.add_argument("--out_dir", default="app/models", help="Directory for saving artifacts.")
    parser.add_argument("--text_col", default="text")
    parser.add_argument("--interests_col", default="interests")
    parser.add_argument("--target_col", default="career")
    parser.add_argument("--test_size", type=float, default=0.15)
    parser.add_argument("--random_state", type=int, default=42)
    parser.add_argument("--no_oversample", action="store_true")
    return parser.parse_args()


def main():
    args = parse_args()

    df = load_data(Path(args.data))

    pipe, le, X_test_df, y_test_df = train(
        df,
        text_col=args.text_col,
        interests_col=args.interests_col,
        target_col=args.target_col,
        test_size=args.test_size,
        random_state=args.random_state,
        oversample=not args.no_oversample,
    )

    save_artifacts(pipe, le, Path(args.out_dir))

    # SAMPLE PREDICTIONS
    sample = X_test_df["text"].astype(str).head(5).tolist()
    preds = predict_samples(pipe, le, sample, top_k=3)
    logger.info("Sample predictions: %s", preds)


if __name__ == "__main__":
    main()
