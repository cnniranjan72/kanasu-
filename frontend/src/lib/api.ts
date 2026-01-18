import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

/* ============================================
   1. Career Prediction
   POST /predict
============================================ */
export interface PredictRequest {
  age: number;
  gender: string;
  education: string;
  stream_code: string;
  interests: string[];
  skills: string[];
}

export interface PredictResponse {
  top_3: CareerRecommendation[];
}

export interface CareerRecommendation {
  label: string;      // e.g. "software_engineer"
  probability: number;
  cluster: string;    // e.g. "Technology"
}

export const predictCareer = async (payload: PredictRequest): Promise<PredictResponse> => {
  const res = await api.post<PredictResponse>("/predict", payload);
  return res.data;
};

/* ============================================
   2. Roadmap Generator
   POST /roadmap
============================================ */
export interface RoadmapRequest {
  career: string;
  education: string;
  interests: string[];
  skills: string[];
}

export interface RoadmapResponse {
  career: string;
  roadmap: string[]; // Array of plain bullet strings
}

export const generateRoadmap = async (payload: RoadmapRequest): Promise<RoadmapResponse> => {
  const res = await api.post<RoadmapResponse>("/roadmap", payload);
  return res.data;
};

/* ============================================
   3. Institution Recommender
   POST /institutions
============================================ */
export interface InstitutionRequest {
  location: string;
  text: string;
  interests?: string[];
  skills?: string[];
}

export interface Institution {
  name: string;
  address: string;
  maps_url: string;
  distance_km?: number;
  description: string;
}

export interface InstitutionResponse {
  predictions?: CareerRecommendation[]; // Optional if backend returns it
  institutes: Institution[];
}

export const getInstitutions = async (payload: InstitutionRequest): Promise<InstitutionResponse> => {
  const res = await api.post<InstitutionResponse>("/institutions", payload);
  // Backend contract says response might just be the objects, but let's assume standard wrapper or check what frontend expects
  // Based on PROMPT: Response is not explicitly fully detailed but we inferred `institutes` array.
  // Actually, let's trust the inferred response structure or existing code if logical.
  // The existing InstitutionRecommender used `res.institutes`. Let's stick to that.
  return res.data;
};

/* ============================================
   4. Chatbot
   POST /chat
============================================ */
export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  reply: string; // Inferred from existing code or standard chatbots
}

export const sendChat = async (message: string): Promise<ChatResponse> => {
  const res = await api.post<ChatResponse>("/chat", { message });
  return res.data;
};

export default api;
