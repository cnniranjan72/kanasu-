import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ============================================
   Interfaces matching FastAPI backend
============================================ */

export interface PredictRequest {
  age: number;
  gender: string;
  education: string;
  stream_code: string;
  interests: string[];
  skills: string[];
}

export interface BackendPredictionItem {
  label: string;
  probability: number;
  cluster: string | null;
}

/* ============================================
   Frontend-friendly UI type
============================================ */
export interface CareerRecommendation {
  title_code: string;
  title_label: string;
  cluster_label: string;
  cluster_code: string;
  probability: number;
}

/* ============================================
   API Responses
============================================ */
export interface PredictResponse {
  top_3: BackendPredictionItem[];
}

/* ============================================
   API CALLS
============================================ */

export const predictCareers = async (
  data: PredictRequest
): Promise<PredictResponse> => {
  const response = await api.post<PredictResponse>("/predict", data);
  return response.data;
};

export default api;
