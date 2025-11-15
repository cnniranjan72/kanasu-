import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BigCard } from "@/components/BigCard";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";

const ProfileUser: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();

  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    age: user?.age?.toString() || "",
    location: user?.location?.city || "",
  });

  const handleSave = async () => {
    await updateUser({
      name: formData.name,
      age: Number(formData.age),
      location: { ...user!.location, city: formData.location },
    });

    toast({ title: "Success", description: "Profile updated" });
    setEditing(false);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl space-y-6">
      <h2 className="text-2xl font-bold text-center">User Info</h2>

      <BigCard>
        <div className="space-y-6">

          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={formData.name}
              disabled={!editing}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Age</Label>
            <Input
              type="number"
              value={formData.age}
              disabled={!editing}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Location</Label>
            <Input
              value={formData.location}
              disabled={!editing}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          {editing ? (
            <Button className="w-full" onClick={handleSave}>
              <Save className="mr-2 h-5 w-5" /> Save
            </Button>
          ) : (
            <Button className="w-full" variant="outline" onClick={() => setEditing(true)}>
              Edit
            </Button>
          )}
        </div>
      </BigCard>
    </div>
  );
};

export default ProfileUser;
