import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { BigCard } from "@/components/BigCard";

import { ArrowLeft, MapPin } from "lucide-react";

import type { CareerRecommendation } from "@/lib/api";

interface InstitutionMock {
  name: string;
  address: string;
  lat: number;
  lng: number;
}

const Roadmap: React.FC = () => {
  const navigate = useNavigate();

  const [career, setCareer] = useState<CareerRecommendation | null>(null);
  const [loading, setLoading] = useState(true);

  const mockRoadmap = {
    roadmap_text: "This is a complete mock career roadmap generated for demo purposes.",
    steps: [
      {
        term: "Short Term",
        tasks: ["Learn basics", "Build small projects"],
        courses: ["Course A", "Course B"],
        colleges: ["College 1", "College 2"],
      },
      {
        term: "Medium Term",
        tasks: ["Work on real-world projects", "Get internships"],
        courses: ["Course C"],
        colleges: ["College 3"],
      },
      {
        term: "Long Term",
        tasks: ["Join full-time", "Specialize in skills"],
        courses: [],
        colleges: [],
      },
    ],
    nearby_institutions: [
      { name: "ABC Institute", address: "MG Road", lat: 12.97, lng: 77.59 },
      { name: "Tech Academy", address: "BTM Layout", lat: 12.91, lng: 77.60 },
    ] as InstitutionMock[],
  };

  useEffect(() => {
    const saved = localStorage.getItem("selectedCareer");
    if (!saved) {
      navigate("/career-recommender");
      return;
    }
    setCareer(JSON.parse(saved));
    setLoading(false);
  }, [navigate]);

  if (loading || !career) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl space-y-6">

      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/career-recommender")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="flex-1">
          <h2 className="text-2xl font-bold">{career.title_label}</h2>
          <p className="text-sm text-muted-foreground">{career.cluster_label}</p>
        </div>
      </div>

      {/* Summary */}
      <BigCard>
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
          {mockRoadmap.roadmap_text}
        </p>
      </BigCard>

      {/* Steps */}
      {mockRoadmap.steps.map((step, i) => (
        <BigCard key={i}>
          <h3 className="text-lg font-bold mb-2">{step.term}</h3>

          <ul className="list-disc ml-6 text-sm text-muted-foreground space-y-1">
            {step.tasks.map((task, idx) => (
              <li key={idx}>{task}</li>
            ))}
          </ul>
        </BigCard>
      ))}

      {/* Institutions */}
      <div>
        <h3 className="text-xl font-bold mb-3">Nearby Institutions</h3>

        <div className="grid gap-4">
          {mockRoadmap.nearby_institutions.map((inst, i) => (
            <BigCard key={i}>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">{inst.name}</h4>
                  <p className="text-sm text-muted-foreground">{inst.address}</p>
                </div>

                <Button
                  variant="outline"
                  onClick={() =>
                    window.open(
                      `https://www.google.com/maps?q=${inst.lat},${inst.lng}`,
                      "_blank"
                    )
                  }
                >
                  <MapPin className="h-4 w-4 mr-2" /> Map
                </Button>
              </div>
            </BigCard>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Roadmap;
