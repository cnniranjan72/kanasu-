import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

import { BigCard } from "@/components/BigCard";
import { CareerCard } from "@/components/CareerCard";
import { InterestSelector } from "@/components/InterestSelector";
import { StreamSelector } from "@/components/StreamSelector";

import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCareerForm } from "@/contexts/CareerFormContext";

import {
  Loader2,
  Sparkles,
  GraduationCap,
  School,
  BookOpen,
  University,
  Library,
  MoreHorizontal,
} from "lucide-react";

import type { CareerRecommendation } from "@/lib/api";

const MOCK_RECOMMENDATIONS: CareerRecommendation[] = [
  {
    title_code: "software_engineer",
    title_label: "Software Engineer",
    cluster_label: "Technology",
    cluster_code: "tech",
    probability: 0.92,
  },
  {
    title_code: "data_scientist",
    title_label: "Data Scientist",
    cluster_label: "AI & Data",
    cluster_code: "data",
    probability: 0.88,
  },
  {
    title_code: "ux_designer",
    title_label: "UX Designer",
    cluster_label: "Creative",
    cluster_code: "creative",
    probability: 0.74,
  },
];

const CareerRecommender: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { formData, updateFormData } = useCareerForm();
  const { t } = useLanguage();

  const resultsRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<CareerRecommendation[]>([]);

  const educationLevels = [
    { value: "sslc", label: "SSLC (10th)", icon: School },
    { value: "puc", label: "PUC (11th–12th)", icon: BookOpen },
    { value: "diploma", label: "Diploma", icon: GraduationCap },
    { value: "bachelor", label: "Bachelor’s Degree", icon: University },
    { value: "master", label: "Master’s Degree", icon: Library },
    { value: "other", label: "Other", icon: MoreHorizontal },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // load mock data
    setTimeout(() => {
      setRecommendations(MOCK_RECOMMENDATIONS);

      toast({
        title: "Success",
        description: "Mock recommendations loaded!",
      });

      // Auto-scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 300);

      setLoading(false);
    }, 600);
  };

  const handleViewRoadmap = (career: CareerRecommendation) => {
    localStorage.setItem("selectedCareer", JSON.stringify(career));
    navigate("/roadmap");
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl space-y-6">

      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold">Career Recommender</h2>
        <p className="text-muted-foreground">
          Fill your details to get mock careers
        </p>
      </div>

      <BigCard>
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Age + Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div className="space-y-2">
              <Label>Age</Label>
              <Input
                type="number"
                value={formData.age}
                onChange={(e) => updateFormData("age", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Gender</Label>
              <Select
                value={formData.gender}
                onValueChange={(v) => updateFormData("gender", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

          </div>

          {/* Education + Stream */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div className="space-y-2">
              <Label>Education</Label>
              <Select
                value={formData.education}
                onValueChange={(v) => updateFormData("education", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select education" />
                </SelectTrigger>
                <SelectContent>
                  {educationLevels.map((level) => {
                    const Icon = level.icon;
                    return (
                      <SelectItem key={level.value} value={level.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-primary" />
                          {level.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Stream</Label>
              <StreamSelector
                selected={formData.stream_code}
                onChange={(v) => updateFormData("stream_code", v)}
              />
            </div>

          </div>

          {/* Interests */}
          <div className="space-y-2">
            <Label>Interests</Label>
            <InterestSelector
              selected={formData.interests}
              onChange={(v) => updateFormData("interests", v)}
            />
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <Label>Skills</Label>
            <Input
              placeholder="coding, leadership..."
              value={formData.skills}
              onChange={(e) => updateFormData("skills", e.target.value)}
            />
          </div>

          <Button className="w-full" size="lg" disabled={loading}>
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-2" />
                Get Recommendations
              </>
            )}
          </Button>

        </form>
      </BigCard>

      {/* RESULTS */}
      <div ref={resultsRef}>
        {recommendations.length > 0 && (
          <div className="space-y-4 mt-4">

            <h3 className="text-xl font-bold text-center">
              Top Career Matches
            </h3>

            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
              {recommendations.map((career, index) => (
                <CareerCard
                  key={index}
                  career={career}
                  onViewRoadmap={() => handleViewRoadmap(career)}
                  onShowInfo={() =>
                    toast({
                      title: career.title_label,
                      description: career.cluster_label,
                    })
                  }
                />
              ))}
            </div>

          </div>
        )}
      </div>

    </div>
  );
};

export default CareerRecommender;
