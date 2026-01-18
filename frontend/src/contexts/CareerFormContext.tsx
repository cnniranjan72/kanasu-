import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import type { CareerRecommendation } from "@/lib/api";

export interface CareerFormData {
  age: string; // Kept as string for Input, will convert to number for API
  gender: string;
  education: string;
  stream_code: string;
  interests: string[];
  skills: string[]; // ✅ Fixed: should be array for consistency
}

interface CareerFormContextType {
  formData: CareerFormData;
  setFormData: Dispatch<SetStateAction<CareerFormData>>;
  updateFormData: <K extends keyof CareerFormData>(
    key: K,
    value: CareerFormData[K]
  ) => void;
  careerRecommendations: CareerRecommendation[];
  setCareerRecommendations: Dispatch<SetStateAction<CareerRecommendation[]>>;
  selectedCareer: CareerRecommendation | null;
  setSelectedCareer: Dispatch<SetStateAction<CareerRecommendation | null>>;
}

const CareerFormContext = createContext<CareerFormContextType | undefined>(
  undefined
);

export const CareerFormProvider = ({ children }: { children: ReactNode }) => {
  const [formData, setFormData] = useState<CareerFormData>({
    age: "",
    gender: "",
    education: "",
    stream_code: "",
    interests: [],
    skills: [], // Fixed: array to match interface
  });

  const [careerRecommendations, setCareerRecommendations] = useState<CareerRecommendation[]>([]);
  const [selectedCareer, setSelectedCareer] = useState<CareerRecommendation | null>(null);

  const updateFormData = <K extends keyof CareerFormData>(
    key: K,
    value: CareerFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <CareerFormContext.Provider
      value={{
        formData,
        setFormData,
        updateFormData,
        careerRecommendations, // Renamed from predictionResult for clarity/correctness
        setCareerRecommendations,
        selectedCareer,
        setSelectedCareer,
      }}
    >
      {children}
    </CareerFormContext.Provider>
  );
};

export const useCareerForm = (): CareerFormContextType => {
  const context = useContext(CareerFormContext);
  if (!context) {
    throw new Error(
      "useCareerForm must be used within a CareerFormProvider"
    );
  }
  return context;
};
