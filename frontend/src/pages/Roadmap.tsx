import React, { useState, useEffect } from "react";
import { generateRoadmap } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { useCareerForm } from "@/contexts/CareerFormContext";
import { useNavigate } from "react-router-dom";

const RoadmapPage: React.FC = () => {
  const { selectedCareer, formData } = useCareerForm();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<string[]>([]);
  const [error, setError] = useState("");

  const careerLabel = selectedCareer?.label || "Unknown Career";

  // Route guard: Redirect to career-recommender if no career is selected
  useEffect(() => {
    if (!selectedCareer) {
      navigate("/career-recommender");
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCareer]);

  useEffect(() => {
    if (selectedCareer) {
      handleGenerate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCareer]);

  const handleGenerate = async () => {
    if (!selectedCareer) return;

    setLoading(true);
    setError("");
    try {
      const payload = {
        career: selectedCareer.label, // Sending label as career identifier per existing contracts/mock
        education: formData.education,
        interests: formData.interests,
        skills: formData.skills ? formData.skills.split(",").map(x => x.trim()).filter(Boolean) : [],
      };

      const res = await generateRoadmap(payload);
      // Safely coerce to string bullets - handle malformed Gemini output
      const roadmapData: any = res.roadmap;
      if (Array.isArray(roadmapData)) {
        setRoadmap(roadmapData.map(item => String(item)));
      } else if (typeof roadmapData === 'string') {
        // If it's a single string, try to split by newlines or keep as single step
        const lines = roadmapData.split('\n').filter((line: string) => line.trim());
        setRoadmap(lines.length > 1 ? lines : [roadmapData]);
      } else {
        // Fallback for unexpected format
        setRoadmap(['Roadmap generation completed. Please try again if details are missing.']);
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.detail || "Failed to generate roadmap.");
    } finally {
      setLoading(false);
    }
  };

  if (!selectedCareer) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <h2 className="text-xl font-bold mb-4">No Career Selected</h2>
        <p className="text-muted-foreground">Please go back to Career Recommender and select a career.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl space-y-6">

      <h1 className="text-3xl font-bold">
        Roadmap for <span className="text-primary">{careerLabel}</span>
      </h1>

      {loading && (
        <div className="flex flex-col items-center justify-center p-12 space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-lg text-muted-foreground">Generating personalized roadmap using Gemini AI...</p>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-lg bg-destructive/10 text-destructive font-medium">
          {error}
        </div>
      )}

      {!loading && roadmap.length > 0 && (
        <div className="p-6 rounded-xl bg-white shadow-sm border space-y-4">
          <h2 className="text-2xl font-semibold border-b pb-2">Your Path</h2>

          <ul className="space-y-4">
            {roadmap.map((step, idx) => (
              <li key={idx} className="flex gap-3">
                <span className="flex-shrink-0 w-2 h-2 rounded-full bg-primary/60 mt-2"></span>
                <span className="text-gray-700 leading-relaxed">
                  {step}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RoadmapPage;
