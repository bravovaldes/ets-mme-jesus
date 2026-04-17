"use client";

import { motion } from "framer-motion";
import {
  ClipboardList,
  Flower2,
  Tent,
  UtensilsCrossed,
  FileText,
  Car,
  FileCheck,
  Heart,
} from "lucide-react";
import Link from "next/link";

const iconMap: Record<string, React.ElementType> = {
  ClipboardList,
  Flower2,
  Tent,
  UtensilsCrossed,
  FileText,
  Car,
  FileCheck,
  Heart,
};

interface ServiceSectionProps {
  id: string;
  title: string;
  description: string;
  includes: string[];
  icon: string;
  index: number;
}

export default function ServiceSection({
  id,
  title,
  description,
  includes,
  icon,
  index,
}: ServiceSectionProps) {
  const Icon = iconMap[icon] || ClipboardList;
  const isEven = index % 2 === 0;

  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`flex flex-col lg:flex-row gap-12 items-start ${
        !isEven ? "lg:flex-row-reverse" : ""
      }`}
    >
      {/* Icon + text */}
      <div className="flex-1">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 border border-accent/30 flex items-center justify-center">
            <Icon size={24} className="text-accent" strokeWidth={1.5} />
          </div>
          <h3 className="font-heading text-2xl md:text-3xl text-charcoal">
            {title}
          </h3>
        </div>
        <p className="text-charcoal/80 leading-relaxed mb-8">{description}</p>
        <div className="mb-8">
          <h4 className="text-sm font-medium text-charcoal tracking-wide uppercase mb-4">
            Ce qui est inclus :
          </h4>
          <ul className="space-y-2">
            {includes.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-charcoal/70 text-sm"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <Link
          href={`/contact?service=${encodeURIComponent(title)}`}
          className="text-accent text-sm hover:text-accent-dark transition-colors"
        >
          Demander un devis pour ce service &rarr;
        </Link>
      </div>

      {/* Decorative block */}
      <div className="flex-1 hidden lg:block">
        <div className="aspect-[4/3] bg-primary/5 border border-border flex items-center justify-center">
          <Icon size={64} className="text-primary/10" strokeWidth={1} />
        </div>
      </div>
    </motion.div>
  );
}
