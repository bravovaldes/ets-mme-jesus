"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { collection, addDoc, getDocs, query, where, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface VirtualCandleProps {
  fairePartId: string;
  accentColor: string;
  primaryColor: string;
}

export default function VirtualCandle({
  fairePartId,
  accentColor,
  primaryColor,
}: VirtualCandleProps) {
  const [count, setCount] = useState(0);
  const [lit, setLit] = useState(false);
  const [name, setName] = useState("");
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    async function loadCount() {
      if (!db) { setCount(12); return; }
      try {
        const q = query(collection(db, "candles"), where("fairePartId", "==", fairePartId));
        const snapshot = await getDocs(q);
        setCount(Math.max(1, snapshot.size));
      } catch {
        setCount(1);
      }
    }
    loadCount();
  }, [fairePartId]);

  async function handleLight() {
    if (lit) return;
    if (!name.trim()) { setShowInput(true); return; }

    try {
      if (db) {
        await addDoc(collection(db, "candles"), {
          fairePartId,
          auteur: name.trim(),
          createdAt: serverTimestamp(),
        });
      }
      setCount((prev) => prev + 1);
      setLit(true);
      setShowInput(false);
    } catch {
      setLit(true);
      setCount((prev) => prev + 1);
    }
  }

  return (
    <div className="text-center py-8">
      {/* Candle visual */}
      <div className="relative inline-block mb-6">
        {/* Candle body */}
        <div className="w-8 h-20 mx-auto rounded-t-sm" style={{ backgroundColor: `${accentColor}40` }}>
          <div className="w-6 h-16 mx-auto rounded-t-sm" style={{ backgroundColor: `${accentColor}60` }} />
        </div>

        {/* Flame — always lit */}
        <motion.div
          className="absolute -top-8 left-1/2 -translate-x-1/2"
          animate={{
            scale: [1, 1.1, 0.95, 1.05, 1],
            y: [0, -2, 1, -1, 0],
          }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <div
            className="w-4 h-6 rounded-full blur-[1px]"
            style={{
              background: `radial-gradient(ellipse, #FFD700 0%, ${accentColor} 50%, transparent 100%)`,
              boxShadow: `0 0 20px ${accentColor}80, 0 0 40px ${accentColor}40`,
            }}
          />
        </motion.div>

        {/* Glow — always visible */}
        <div
          className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full opacity-30"
          style={{
            background: `radial-gradient(circle, ${accentColor}30 0%, transparent 70%)`,
          }}
        />
      </div>

      {/* Count */}
      <p className="text-cream/40 text-xs mb-4">
        {count > 0 && (
          <span>
            <span className="font-heading text-lg" style={{ color: accentColor }}>
              {count}
            </span>{" "}
            {count === 1 ? "bougie allumee" : "bougies allumees"} en sa memoire
          </span>
        )}
      </p>

      {/* Action */}
      {!lit ? (
        <div className="space-y-3">
          {showInput && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="max-w-xs mx-auto"
            >
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Votre nom"
                className="w-full px-4 py-2.5 text-sm text-center border bg-transparent text-cream focus:outline-none"
                style={{ borderColor: `${accentColor}30` }}
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && handleLight()}
              />
            </motion.div>
          )}
          <button
            onClick={handleLight}
            className="inline-flex items-center gap-2 px-6 py-2.5 border text-sm transition-all hover:bg-white/5"
            style={{ borderColor: `${accentColor}50`, color: accentColor }}
          >
            Ajouter une bougie
          </button>
        </div>
      ) : (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm italic"
          style={{ color: `${accentColor}80` }}
        >
          Merci {name}. Votre bougie brille en sa memoire.
        </motion.p>
      )}
    </div>
  );
}
