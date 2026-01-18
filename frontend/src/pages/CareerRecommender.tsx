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

import { predictCareer, CareerRecommendation } from "@/lib/api";

const CareerRecommender: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { formData, updateFormData, careerRecommendations: recommendations, setCareerRecommendations: setRecommendations, setSelectedCareer } = useCareerForm();
  const { t } = useLanguage();

  const resultsRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(false);

  const educationLevels = [
    { value: "sslc", label: "SSLC (10th)", icon: School },
    { value: "puc", label: "PUC (11th–12th)", icon: BookOpen },
    { value: "diploma", label: "Diploma", icon: GraduationCap },
    { value: "bachelor", label: "Bachelor’s Degree", icon: University },
    { value: "master", label: "Master’s Degree", icon: Library },
    { value: "other", label: "Other", icon: MoreHorizontal },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        age: parseInt(formData.age) || 0,
        gender: formData.gender,
        education: formData.education,
        stream_code: formData.stream_code,
        interests: formData.interests,
        skills: formData.skills ? formData.skills.split(",").map(s => s.trim()) : [],
      };

      const res = await predictCareer(payload);
      const recs = res.top_3 || []; // Safety check
      setRecommendations(recs);

      toast({
        title: "Success",
        description: "Career recommendations loaded!",
      });

      // Auto-scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 300);

    } catch (err: any) {
      console.error(err);
      toast({
        title: "Error",
        description: err?.response?.data?.detail || "Failed to get recommendations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewRoadmap = (career: CareerRecommendation) => {
    // strict context usage
    setSelectedCareer(career);
    navigate("/roadmap");
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl space-y-6">

      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold">Career Recommender</h2>
        <p className="text-muted-foreground">
          Fill your details to get AI-powered career matches
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
            <InterestSelector
              selected={formData.skills ? formData.skills.split(",").map(s => s.trim()).filter(Boolean) : []}
              onChange={(v) => updateFormData("skills", v.join(", "))}
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
                  career={career as any} // Cast if UI CareerCard expects slightly diff, but kept consistent
                  onViewRoadmap={() => handleViewRoadmap(career)}
                  onShowInfo={() =>
                    toast({
                      title: career.label, // updated from title_label
                      description: career.cluster, // updated from cluster_label
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
