import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type { FairePartPage, Condolence } from "./types";
import { demoFaireParts, demoCondolences } from "./demo-fairepart";

const FAIREPARTES_COLLECTION = "faireParts";
const CONDOLENCES_COLLECTION = "condolences";

export async function getFaireParts(onlyPublic = true): Promise<FairePartPage[]> {
  if (!db) return demoFaireParts.filter((f) => !onlyPublic || !f.isPrivate);
  try {
    const constraints = [
      where("isPublished", "==", true),
      orderBy("createdAt", "desc"),
    ];
    if (onlyPublic) {
      constraints.push(where("isPrivate", "==", false));
    }
    const q = query(collection(db, FAIREPARTES_COLLECTION), ...constraints);
    const snapshot = await getDocs(q);
    const results = snapshot.docs.map(
      (d) => ({ ...d.data(), id: d.id, slug: d.data().slug || d.id } as FairePartPage)
    );
    return results.length > 0
      ? results
      : demoFaireParts.filter((f) => !onlyPublic || !f.isPrivate);
  } catch {
    return demoFaireParts.filter((f) => !onlyPublic || !f.isPrivate);
  }
}

export async function getFairePartBySlug(
  slug: string
): Promise<FairePartPage | null> {
  if (!db) return demoFaireParts.find((f) => f.slug === slug) || null;
  try {
    // Try by document ID first
    const docRef = doc(db, FAIREPARTES_COLLECTION, slug);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { ...docSnap.data(), id: docSnap.id, slug } as FairePartPage;
    }
    // Try by slug field
    const q = query(
      collection(db, FAIREPARTES_COLLECTION),
      where("slug", "==", slug)
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const d = snapshot.docs[0];
      return { ...d.data(), id: d.id } as FairePartPage;
    }
    return demoFaireParts.find((f) => f.slug === slug) || null;
  } catch {
    return demoFaireParts.find((f) => f.slug === slug) || null;
  }
}

export async function getCondolences(fairePartId: string): Promise<Condolence[]> {
  if (!db) return demoCondolences.filter((c) => c.fairePartId === fairePartId);
  try {
    const q = query(
      collection(db, CONDOLENCES_COLLECTION),
      where("fairePartId", "==", fairePartId),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    const results = snapshot.docs.map(
      (d) => ({ ...d.data(), id: d.id } as Condolence)
    );
    return results.length > 0
      ? results
      : demoCondolences.filter((c) => c.fairePartId === fairePartId);
  } catch {
    return demoCondolences.filter((c) => c.fairePartId === fairePartId);
  }
}

export async function addCondolence(data: {
  fairePartId: string;
  auteur: string;
  lien: string;
  message: string;
  ville?: string;
}): Promise<string> {
  if (!db) throw new Error("Firebase not configured");
  const docRef = await addDoc(collection(db, CONDOLENCES_COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}
