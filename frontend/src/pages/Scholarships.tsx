import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BigCard } from "@/components/BigCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search, ExternalLink } from "lucide-react";

const Scholarships: React.FC = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");

  const scholarships = [
    {
      id: "1",
      title: "Karnataka State Scholarship",
      description: "Financial assistance for students from economically weaker sections",
      eligibility: "Students studying in Karnataka institutions",
      amount: "₹10,000 - ₹50,000",
      link: "https://scholarships.gov.in",
      category: "State Government",
    },
    {
      id: "2",
      title: "Post Matric Scholarship for SC/ST",
      description: "Scholarship for students from SC/ST categories",
      eligibility: "SC/ST students pursuing higher education",
      amount: "₹15,000 - ₹1,00,000",
      link: "https://scholarships.gov.in",
      category: "Central Government",
    },
    {
      id: "3",
      title: "Merit-cum-Means Scholarship",
      description: "For meritorious students from low-income families",
      eligibility: "Minimum 60% marks, family income below ₹6 lakhs",
      amount: "₹20,000 per year",
      link: "https://scholarships.gov.in",
      category: "Merit Based",
    },
  ];

  const filtered = scholarships.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-4xl">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">{t("scholarships")}</h2>
        <p className="text-muted-foreground">{t("findFinancialHelp")}</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder={t("searchScholarships")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="space-y-4">
        {filtered.map((s) => (
          <BigCard key={s.id}>
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold">{s.title}</h3>
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                    {s.category}
                  </span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">{s.description}</p>

              <div className="text-sm space-y-1">
                <div>
                  <strong>{t("eligibility")}:</strong> {s.eligibility}
                </div>
                <div>
                  <strong>{t("amount")}:</strong>{" "}
                  <span className="text-primary font-semibold">{s.amount}</span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.open(s.link, "_blank")}
              >
                {t("learnMore")}
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </BigCard>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          {t("noScholarships")}
        </div>
      )}
    </div>
  );
};

export default Scholarships;
