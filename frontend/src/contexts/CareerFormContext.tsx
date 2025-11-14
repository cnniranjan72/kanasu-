import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

export interface CareerFormData {
  age: string;
  gender: string;
  education: string;
  stream_code: string;
  interests: string[];
  skills: string;
}

interface CareerFormContextType {
  formData: CareerFormData;
  setFormData: Dispatch<SetStateAction<CareerFormData>>;
  updateFormData: <K extends keyof CareerFormData>(
    key: K,
    value: CareerFormData[K]
  ) => void;
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
    skills: "",
  });

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
