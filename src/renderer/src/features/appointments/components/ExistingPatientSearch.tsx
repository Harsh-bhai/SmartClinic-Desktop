"use client";

import { useEffect, useMemo, useState } from "react";
import Fuse from "fuse.js";
import { SearchIcon, User } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Patient } from "@renderer/features/patients";

interface ExistingPatientSearchProps {
  patients: Patient[];
  onSelect: (patient: Patient) => void;
}

/**
 * 🔍 Fuzzy Search Command for Existing Patients
 * Uses Fuse.js to search by name, phone, gender, or age
 */
export function ExistingPatientSearch({
  patients,
  onSelect,
}: ExistingPatientSearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Patient[]>([]);

  // Initialize Fuse.js
  const fuse = useMemo(
    () =>
      new Fuse(patients, {
        keys: ["name", "phone"],
        threshold: 0.3, // Lower = stricter match
      }),
    [patients]
  );

  // Handle Search Query
  useEffect(() => {
    if (query.trim() === "") {
      setResults(patients);
    } else {
      const fuzzyResults = fuse.search(query).map((r) => r.item);
      setResults(fuzzyResults);
    }
  }, [query, fuse, patients]);

  // Optional: Keyboard Shortcut (Ctrl+K / Cmd+K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <button
        className="inline-flex h-9 w-fit rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
        onClick={() => setOpen(true)}
      >
        <span className="flex grow items-center">
          <SearchIcon
            className="-ms-1 me-3 text-muted-foreground/80"
            size={16}
            aria-hidden="true"
          />
          <span className="font-normal text-muted-foreground/70">
            Search Patients
          </span>
        </span>
        <kbd className="ms-12 -me-1 inline-flex h-5 max-h-full items-center rounded border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
          ⌘K
        </kbd>
      </button>

      {/* Command Palette */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search by Name, Phone, or Gender..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>No matching patients found.</CommandEmpty>

          <CommandGroup heading="Patients">
            {results.map((patient) => (
              <CommandItem
                key={patient.id}
                value={patient.name}
                onSelect={() => {
                  onSelect(patient);
                  setOpen(false);
                }}
              >
                <User size={16} className="opacity-60 mr-2" />
                <div className="flex flex-col">
                  <span className="font-medium">{patient.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {patient.gender}, {patient.age} yrs • {patient.phone}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />
        </CommandList>
      </CommandDialog>
    </>
  );
}
