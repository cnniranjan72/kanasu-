import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { generateRoadmap } from "@/lib/api";
import { Loader2 } from "lucide-react";

const RoadmapPage: React.FC = () => {
  const loc = useLocation();

  const [career, setCareer] = useState<any>(null);

  const [education, setEducation] = useState("");
  const [interestsText, setInterestsText] = useState("");
  const [skillsText, setSkillsText] = useState("");

  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<string[]>([]);

  useEffect(() => {
    const s = (loc.state as any)?.career;
    if (s) {
      setCareer(s);
      localStorage.setItem("selectedCareer", JSON.stringify(s));
    } else {
      const saved = localStorage.getItem("selectedCareer");
      if (saved) setCareer(JSON.parse(saved));
    }
  }, [loc.state]);

  const handleGenerate = async () => {
    if (!career) return alert("No career selected.");

    setLoading(true);
    try {
      const payload = {
        career: career.title_code || career,
        education: education || undefined,
        interests: interestsText
          ? interestsText.split(",").map((x) => x.trim())
          : undefined,
        skills: skillsText
          ? skillsText.split(",").map((x) => x.trim())
          : undefined,
      };

      const res = await generateRoadmap(payload);
      setRoadmap(res.roadmap);
    } catch (err: any) {
      alert(err?.response?.data?.detail || "Failed to generate roadmap.");
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl space-y-6">
      
      <h1 className="text-3xl font-bold">
        Roadmap for{" "}
        <span className="text-primary">{career?.title_label ?? career}</span>
      </h1>

      <div className="p-4 rounded-xl bg-white shadow space-y-3">
        <input
          className="border p-2 w-full rounded"
          placeholder="Education (optional)"
          value={education}
          onChange={(e) => setEducation(e.target.value)}
        />
        <input
          className="border p-2 w-full rounded"
          placeholder="Interests (comma-separated)"
          value={interestsText}
          onChange={(e) => setInterestsText(e.target.value)}
        />
        <input
          className="border p-2 w-full rounded"
          placeholder="Skills (comma-separated)"
          value={skillsText}
          onChange={(e) => setSkillsText(e.target.value)}
        />

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="bg-primary text-white px-4 py-2 rounded flex items-center gap-2"
        >
          {loading && <Loader2 className="h-5 w-5 animate-spin" />}
          {loading ? "Generating..." : "Generate Roadmap"}
        </button>
      </div>

      {roadmap.length > 0 && (
        <div className="p-4 rounded-xl bg-white shadow">
          <h2 className="text-xl font-semibold mb-3">Career Roadmap</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            {roadmap.map((step, idx) => (
              <li key={idx} className="leading-relaxed">
                {step}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RoadmapPage;
