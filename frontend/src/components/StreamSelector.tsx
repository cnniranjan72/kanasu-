import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const STREAM_GROUPS = {
  "PUC Streams": {
    pcm: "PCM (Physics, Chemistry, Maths)",
    pcmb: "PCMB (Physics, Chemistry, Maths, Biology)",
    pcmc: "PCMC (Physics, Chemistry, Maths, Computer Science)",
    pcb: "PCB (Physics, Chemistry, Biology)",
    commerce: "Commerce",
    arts: "Arts/Humanities",
  },

  "Diploma & UG Streams": {
    cs: "Computer Science (CS)",
    it: "Information Technology (IT)",
    mech: "Mechanical Engineering (MECH)",
    civil: "Civil Engineering",
    ece: "Electronics & Communication (ECE)",
    eee: "Electrical & Electronics (EEE)",
    biotech: "Biotechnology",
    bba: "BBA (Business Administration)",
    bcom: "B.Com (Commerce)",
    ba: "BA (Arts/Humanities)",
  },

  "General Options": {
    no_stream: "No Specific Stream",
    other: "Other",
  },
};

interface StreamSelectorProps {
  selected: string;
  onChange: (value: string) => void;
}

export const StreamSelector: React.FC<StreamSelectorProps> = ({
  selected,
  onChange,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          {selected
            ? STREAM_GROUPS["PUC Streams"][selected] ||
              STREAM_GROUPS["Diploma & UG Streams"][selected] ||
              STREAM_GROUPS["General Options"][selected]
            : "Select Stream"}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[75vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select Your Stream</DialogTitle>
        </DialogHeader>

        <div className="space-y-8 pt-2">
          {Object.entries(STREAM_GROUPS).map(([group, streams]) => (
            <div key={group} className="space-y-4">
              <h3 className="font-semibold text-lg">{group}</h3>

              <RadioGroup
                value={selected}
                onValueChange={(value) => {
                  onChange(value);
                  setOpen(false);
                }}
                className="space-y-3"
              >
                {Object.entries(streams).map(([code, label]) => (
                  <div
                    key={code}
                    className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-accent transition ${
                      selected === code ? "border-primary bg-primary/10" : ""
                    }`}
                    onClick={() => {
                      onChange(code);
                      setOpen(false);
                    }}
                  >
                    <RadioGroupItem value={code} />
                    <Label className="text-sm font-medium">{label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
