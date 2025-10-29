"use client";

import { useEffect, useState } from "react";
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
 * 🔍 Simple Search (no Fuse.js)
 * Supports searching by Name or Phone number (case-insensitive, partial match)
 */
export function ExistingPatientSearch({
  patients,
  onSelect,
}: ExistingPatientSearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Patient[]>(patients);

  // Handle Search Query
  useEffect(() => {
    const q = query.trim().toLowerCase();

    if (!q) {
      setResults(patients);
      return;
    }

    const filtered = patients.filter((p) => {
      const nameMatch = p.name?.toLowerCase().includes(q);
      const phoneMatch = p.phone?.toLowerCase().includes(q);
      return nameMatch || phoneMatch;
    });
    console.log(`query "${q}"`);
    console.log("filtered", filtered);

    setResults(filtered);
  }, [query, patients]);

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
        {/* Custom input instead of CommandInput */}
        <div className="p-2">
          <input
            placeholder="Search by Name or Phone..."
            className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <CommandList className="max-h-[70vh] overflow-y-auto scrollbar-none">
          {results.length === 0 && (
            <CommandEmpty>No matching patients found.</CommandEmpty>
          )}

          <CommandGroup heading="Patients">
            {results.map((patient) => (
              <CommandItem
                key={patient.id}
                value={`${patient.name} ${patient.phone}`} // important
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
        </CommandList>
      </CommandDialog>
    </>
  );
}
