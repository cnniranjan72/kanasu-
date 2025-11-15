import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export interface RoadmapResponse {
  career: string;
  roadmap: string[];
}

export interface RoadmapRequest {
  career: string;
  education?: string;
  interests?: string[];
  skills?: string[];
}

export const generateRoadmap = async (
  payload: RoadmapRequest
): Promise<RoadmapResponse> => {
  const res = await api.post<RoadmapResponse>("/roadmap", payload);
  return res.data;
};
/* ============================================
   UI Career Recommendation Type (Frontend Only)
============================================ */

export interface CareerRecommendation {
  title_code: string;     // e.g. "software_engineer"
  title_label: string;    // Human readable label
  cluster_label: string;  // e.g. "AI & Data"
  cluster_code: string;   // e.g. "tech"
  probability: number;    // 0–1
}


export default api;
