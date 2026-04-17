"use client";

import { categories } from "@/lib/data";

interface FiltersProps {
  active: string;
  onChange: (id: string) => void;
}

export default function Filters({ active, onChange }: FiltersProps) {
  return (
    <div className="flex flex-wrap gap-3 justify-center mb-12">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={`px-5 py-2 text-sm tracking-wide border transition-all duration-300 ${
            active === cat.id
              ? "bg-accent text-cream border-accent"
              : "bg-transparent text-charcoal border-border hover:border-accent/50"
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
