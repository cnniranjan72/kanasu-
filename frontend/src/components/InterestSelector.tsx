import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

const INTEREST_DOMAINS = {
  "🎨 Creative & Arts": [
    "drawing",
    "painting",
    "crafting",
    "photography",
    "videography",
    "graphic_design",
    "content_writing",
    "storytelling",
    "singing",
    "dancing",
    "music_production",
  ],
  "💻 Technology & Computers": [
    "coding",
    "programming",
    "problem_solving",
    "robotics",
    "machine_learning",
    "ai",
    "web_development",
    "app_development",
    "data_analysis",
    "cybersecurity",
  ],
  "📚 Academic & Research": [
    "reading",
    "maths",
    "physics",
    "chemistry",
    "biology",
    "research",
    "experiments",
    "teaching",
    "tutoring",
  ],
  "🌍 Social & Community": [
    "volunteering",
    "social_service",
    "community_work",
    "ngo",
    "counselling",
    "public_speaking",
    "leadership",
  ],
  "⚕️ Medicine & Health": [
    "healthcare",
    "first_aid",
    "human_biology",
    "medical_research",
  ],
  "💼 Business & Management": [
    "entrepreneurship",
    "marketing",
    "finance",
    "sales",
    "team_management",
    "organizing_events",
  ],
  "⚡ Engineering / Technical": [
    "mechanics",
    "electronics",
    "circuit_design",
    "automobile",
    "hardware",
    "tinkering",
  ],
  "🏞️ Agriculture & Environment": [
    "farming",
    "gardening",
    "environment",
    "sustainability",
    "animal_care",
  ],
  "⚖️ Law & Government": [
    "law",
    "civil_services",
    "political_science",
    "justice",
  ],
  "🏃 Sports & Defence": [
    "sports",
    "athletics",
    "fitness",
    "martial_arts",
    "defence",
  ],
};

interface InterestSelectorProps {
  selected: string[];
  onChange: (values: string[]) => void;
}

export const InterestSelector: React.FC<InterestSelectorProps> = ({
  selected,
  onChange,
}) => {
  const [open, setOpen] = useState(false);

  const toggleInterest = (interest: string) => {
    if (selected.includes(interest)) {
      onChange(selected.filter((i) => i !== interest));
    } else if (selected.length < 4) {
      onChange([...selected, interest]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          {selected.length === 0
            ? "Select your interests"
            : selected.join(", ")}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select up to 4 Interests</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {Object.entries(INTEREST_DOMAINS).map(([domain, items]) => (
            <div key={domain} className="space-y-3">
              <h3 className="font-semibold text-lg">{domain}</h3>

              <div className="grid grid-cols-2 gap-3">
                {items.map((item) => {
                  const disabled =
                    !selected.includes(item) && selected.length >= 4;

                  return (
                    <label
                      key={item}
                      className={`flex items-center gap-2 p-2 rounded-md border ${
                        selected.includes(item)
                          ? "border-primary bg-primary/10"
                          : "border-muted"
                      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <Checkbox
                        checked={selected.includes(item)}
                        disabled={disabled}
                        onCheckedChange={() => toggleInterest(item)}
                      />
                      <span className="capitalize">{item.replace("_", " ")}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <Button onClick={() => setOpen(false)}>Done</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
