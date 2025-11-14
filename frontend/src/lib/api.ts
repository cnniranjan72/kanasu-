import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.yourdomain.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface PredictRequest {
  age: number;
  education: string;
  stream_code: string;
  interests: string[];
  skills: string[];
  gender?: string;
  location: {
    lat: number;
    lng: number;
  };
}

export interface CareerRecommendation {
  title_code: string;
  title_label: string;
  cluster_code: string;
  cluster_label: string;
  probability: number;
}

export interface PredictResponse {
  recommendations: CareerRecommendation[];
}

export interface RoadmapRequest {
  titles: string[];
  user_profile: PredictRequest;
  locale: string;
}

export interface Institution {
  name: string;
  address: string;
  lat: number;
  lng: number;
}

export interface RoadmapResponse {
  roadmap_text: string;
  steps: Array<{
    term: string;
    tasks: string[];
    courses: string[];
    colleges: string[];
  }>;
  nearby_institutions: Institution[];
  metadata: Record<string, any>;
}

export const predictCareers = async (data: PredictRequest): Promise<PredictResponse> => {
  const response = await api.post<PredictResponse>('/api/predict', data);
  return response.data;
};

export const generateRoadmap = async (data: RoadmapRequest): Promise<RoadmapResponse> => {
  const response = await api.post<RoadmapResponse>('/api/gemini/roadmap', data);
  return response.data;
};

export const normalizeTokens = (text: string): string => {
  // Normalize synonyms and common variations
  const normalizations: Record<string, string> = {
    'coding': 'programming',
    'computers': 'computer science',
    'maths': 'mathematics',
    'drawing': 'art',
    'science': 'sciences',
  };

  let normalized = text.toLowerCase();
  Object.entries(normalizations).forEach(([key, value]) => {
    normalized = normalized.replace(new RegExp(key, 'gi'), value);
  });

  return normalized;
};

export default api;