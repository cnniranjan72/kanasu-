// frontend/src/pages/Institutions.tsx
import React, { useState } from "react";
import { Institution, InstitutionRequest } from "@/lib/api";
import { Loader2, MapPin, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { InterestSelector } from "@/components/InterestSelector";
import api from "@/lib/api";

const Institutions: React.FC = () => {
  const [location, setLocation] = useState("");
  const [text, setText] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [institutes, setInstitutes] = useState<Institution[]>([]);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
  console.log("HANDLE SEARCH CALLED");

  if (!location.trim()) return;

  try {
    setLoading(true);
    setError("");
    setHasSearched(true);

    const res = await api.post("/institutions", {
      location,
      text: [text, ...interests, ...skills].join(" ").trim(),
      interests,
      skills,
    });

    console.log("API RESPONSE", res.data);
    setInstitutes(res.data.institutes);
  } catch (e) {
    console.error("INSTITUTION ERROR", e);
    setError("Failed to fetch institutions. Please try again.");
    setInstitutes([]);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Building2 className="h-6 w-6 text-primary" />
        Find Institutions Near You
      </h1>

      <div className="p-6 bg-white rounded-xl shadow-sm border space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Location (city, district) *"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <Input
            placeholder="Career text / short profile (optional)"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="space-y-2">
            <Label>Interests (optional)</Label>
            <InterestSelector
              selected={interests}
              onChange={setInterests}
            />
          </div>
          <div className="space-y-2">
            <Label>Skills (optional)</Label>
            <InterestSelector
              selected={skills}
              onChange={setSkills}
            />
          </div>
        </div>

        <Button
          type="button"
          className="w-full md:w-auto"
          onClick={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Searching...
            </>
          ) : (
            <>
              <MapPin className="h-4 w-4 mr-2" />
              Find Institutes
            </>
          )}
        </Button>
      </div>

      {error && (
        <div className="text-red-500 bg-red-50 p-3 rounded">
          {error}
        </div>
      )}

      {institutes.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Recommended Institutes</h2>
          <div className="grid grid-cols-1 gap-4">
            {institutes.map((ins, i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle className="text-lg text-primary">{ins.name}</CardTitle>
                  <CardDescription>{ins.address}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-sm text-gray-600">{ins.description}</div>
                  {ins.distance_km !== undefined && (
                    <div className="text-sm font-medium text-muted-foreground">
                      Distance: {ins.distance_km} km
                    </div>
                  )}
                  <Button variant="outline" size="sm" asChild className="mt-2">
                    <a href={ins.maps_url} target="_blank" rel="noreferrer">
                      Open in Maps
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {hasSearched && !loading && institutes.length === 0 && !error && (
        <div className="text-center py-8">
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">No institutes found</h3>
          <p className="text-sm text-muted-foreground">Try adjusting your search criteria or location</p>
        </div>
      )}
    </div>
  );
};

export default Institutions;
