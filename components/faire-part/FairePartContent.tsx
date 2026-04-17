"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Clock,
  Phone,
  Share2,
  Users,
  Printer,
  Heart,
  Send,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { BamilekeDivider, BamilekeFrame } from "./BamilekeBorder";
import VirtualCandle from "./VirtualCandle";
import AddPhotoByCode from "./AddPhotoByCode";
import Chronicle from "./Chronicle";
import VideoPlayer from "./VideoPlayer";
import CeremonyProgramme from "./CeremonyProgramme";
import DotDisplay from "./DotDisplay";
import MemoryWall from "./MemoryWall";
import PDFDownloadButton from "./PDFDownloadButton";
import ContributionPayment from "./ContributionPayment";
import ContributionsList from "./ContributionsList";
import WhatsAppShare from "./WhatsAppShare";
import LifeCounters from "./LifeCounters";
import type { FairePartPage, Condolence } from "@/lib/types";
import { EVENT_TYPE_LABELS, FAMILLE_CATEGORIES } from "@/lib/types";
import { getCondolences, addCondolence } from "@/lib/fairepart-service";
import { flattenProgrammeEvents } from "@/lib/media-helpers";
import { demoCondolences } from "@/lib/demo-fairepart";

export default function FairePartContent({
  fp,
}: {
  fp: FairePartPage;
}) {
  const [condolences, setCondolences] = useState<Condolence[]>([]);
  const [loadingCondolences, setLoadingCondolences] = useState(true);
  const [showPayment, setShowPayment] = useState(false);
  const [showWhatsAppShare, setShowWhatsAppShare] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const design = fp.fairePartDesign;
  const isFunerailles =
    fp.eventType === "funerailles" || fp.eventType === "levee-de-deuil";
  const isMariage = fp.eventType.startsWith("mariage");
  const mainPerson = fp.personnes[0];
  const secondPerson = fp.personnes[1];

  const loadCondolences = useCallback(async () => {
    try {
      const data = await getCondolences(fp.id);
      setCondolences(data);
    } catch {
      setCondolences(demoCondolences.filter((c) => c.fairePartId === fp.id));
    } finally {
      setLoadingCondolences(false);
    }
  }, [fp.id]);

  useEffect(() => {
    loadCondolences();
  }, [loadCondolences]);

  function handlePrint() {
    window.print();
  }

  function handleShare() {
    const url = window.location.href;
    const text = isFunerailles
      ? `${fp.titre} - ${mainPerson.prenoms} ${mainPerson.nom}. Que son ame repose en paix.`
      : `${fp.titre} - ${fp.familleName}`;
    if (navigator.share) {
      navigator.share({ title: text, url });
    } else {
      navigator.clipboard.writeText(`${text}\n${url}`);
    }
  }

  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(
    `${fp.titre} - ${mainPerson.prenoms} ${mainPerson.nom}\n\n${
      typeof window !== "undefined" ? window.location.href : ""
    }`
  )}`;



  return (
    <>
      {/* ========================================= */}
      {/* FAIRE-PART DIGITAL — SECTION PRINCIPALE   */}
      {/* ========================================= */}
      <div
        ref={printRef}
        className="print:p-0"
        style={{
          ["--fp-primary" as string]: design.primaryColor,
          ["--fp-accent" as string]: design.accentColor,
          ["--fp-bg" as string]: design.backgroundColor,
        }}
      >
        {/* Hero */}
        <section
          className="relative pt-28 sm:pt-32 pb-16 sm:pb-20"
          style={{ backgroundColor: design.primaryColor }}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Verset biblique */}
            {fp.versetBiblique && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="font-heading text-sm italic text-cream/50 mb-6 max-w-md mx-auto"
              >
                {fp.versetBiblique}
              </motion.p>
            )}

            {/* Event type badge */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-xs sm:text-sm tracking-[0.3em] uppercase mb-6"
              style={{ color: design.accentColor }}
            >
              {EVENT_TYPE_LABELS[fp.eventType]}
            </motion.p>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-heading text-3xl sm:text-4xl md:text-5xl font-normal mb-8 text-cream"
            >
              {fp.titre}
            </motion.h1>

            <BamilekeDivider color={design.accentColor} />

            {/* Portrait(s) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className={`flex justify-center gap-6 sm:gap-10 mt-8 ${
                secondPerson ? "items-end" : ""
              }`}
            >
              {/* Main person */}
              <div className="text-center">
                <div
                  className="relative w-36 h-48 sm:w-48 sm:h-64 mx-auto border-2 overflow-hidden"
                  style={{ borderColor: design.accentColor }}
                >
                  <Image
                    src={mainPerson.photoPortrait}
                    alt={`${mainPerson.prenoms} ${mainPerson.nom}`}
                    fill
                    className="object-cover"
                    sizes="192px"
                    priority
                  />
                </div>
                {mainPerson.titreHonorifique && (
                  <p
                    className="text-xs mt-3 tracking-wider"
                    style={{ color: `${design.accentColor}` }}
                  >
                    {mainPerson.titreHonorifique}
                  </p>
                )}
                <h2 className="font-heading text-2xl sm:text-3xl text-cream mt-2">
                  {mainPerson.prenoms} {mainPerson.nom}
                </h2>
                {mainPerson.surnom && (
                  <p className="text-cream/60 text-sm italic mt-1">
                    dit &laquo; {mainPerson.surnom} &raquo;
                  </p>
                )}
                {/* Dates + lieux */}
                {isFunerailles && mainPerson.lieuNaissance && (
                  <p className="text-cream/50 text-xs mt-2">
                    {mainPerson.sexe === "femme" ? "Nee" : "Ne"} a {mainPerson.lieuNaissance}
                    {mainPerson.dateNaissance && ` le ${mainPerson.dateNaissance}`}
                  </p>
                )}
                {isFunerailles && !mainPerson.lieuNaissance && mainPerson.dateNaissance && (
                  <p className="text-cream/50 text-xs mt-2">
                    {mainPerson.sexe === "femme" ? "Nee" : "Ne"} le {mainPerson.dateNaissance}
                  </p>
                )}
                {isFunerailles && mainPerson.dateDeces && (
                  <p className="text-cream/50 text-xs mt-1">
                    {mainPerson.causeDecesMention
                      ? `${mainPerson.sexe === "femme" ? "Decedee" : "Decede"} ${mainPerson.causeDecesMention}`
                      : `${mainPerson.sexe === "femme" ? "Rappelee" : "Rappele"} a Dieu`}
                    {mainPerson.lieuDeces && ` a ${mainPerson.lieuDeces}`} le {mainPerson.dateDeces}
                    {mainPerson.ageAuDeces && `, a l'age de ${mainPerson.ageAuDeces} ans`}
                  </p>
                )}
                {!isFunerailles && mainPerson.dateNaissance && (
                  <p className="text-cream/50 text-sm mt-2">{mainPerson.dateNaissance}</p>
                )}
                {/* Profession + grade */}
                {mainPerson.gradeOuFonction && (
                  <p className="text-cream/40 text-xs mt-2">{mainPerson.gradeOuFonction}</p>
                )}
                {mainPerson.profession && mainPerson.profession !== mainPerson.gradeOuFonction && (
                  <p className="text-cream/40 text-xs mt-0.5">{mainPerson.profession}</p>
                )}
                {/* Decorations */}
                {mainPerson.decorations && mainPerson.decorations.length > 0 && (
                  <p className="text-cream/30 text-[10px] mt-1">
                    {mainPerson.decorations.join(" — ")}
                  </p>
                )}
                {/* Titre traditionnel + village */}
                {mainPerson.titreTradi && (
                  <p className="text-xs mt-1" style={{ color: design.accentColor }}>
                    {mainPerson.titreTradi}
                  </p>
                )}
                {mainPerson.villageOrigine && (
                  <p className="text-cream/30 text-[10px] mt-0.5">
                    {mainPerson.chefferie || `Village de ${mainPerson.villageOrigine}`}
                  </p>
                )}
              </div>

              {/* Second person (mariage) */}
              {secondPerson && (
                <>
                  <div className="flex items-center self-center">
                    <span
                      className="font-heading text-3xl sm:text-4xl"
                      style={{ color: design.accentColor }}
                    >
                      &amp;
                    </span>
                  </div>
                  <div className="text-center">
                    <div
                      className="relative w-36 h-48 sm:w-48 sm:h-64 mx-auto border-2 overflow-hidden"
                      style={{ borderColor: design.accentColor }}
                    >
                      <Image
                        src={secondPerson.photoPortrait}
                        alt={`${secondPerson.prenoms} ${secondPerson.nom}`}
                        fill
                        className="object-cover"
                        sizes="192px"
                        priority
                      />
                    </div>
                    <h2 className="font-heading text-2xl sm:text-3xl text-cream mt-5">
                      {secondPerson.prenoms} {secondPerson.nom}
                    </h2>
                    {secondPerson.profession && (
                      <p className="text-cream/40 text-xs mt-1">
                        {secondPerson.profession}
                      </p>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          </div>
          <div className="h-1 mt-16" style={{ backgroundColor: design.accentColor }} />
        </section>

        {/* Annonce / Sous-titre */}
        <section style={{ backgroundColor: design.backgroundColor }}>
          <div className="max-w-3xl mx-auto px-6 sm:px-8 py-12 sm:py-16 text-center">
            <BamilekeFrame color={design.accentColor}>
              <p
                className="font-heading text-base sm:text-lg md:text-xl leading-relaxed italic"
                style={{ color: design.primaryColor }}
              >
                {fp.sousTitre}
              </p>
              {fp.epitaphe && (
                <>
                  <BamilekeDivider
                    color={design.accentColor}
                    className="my-6"
                  />
                  <p
                    className="text-sm sm:text-base leading-relaxed"
                    style={{ color: `${design.primaryColor}99` }}
                  >
                    &laquo; {fp.epitaphe} &raquo;
                  </p>
                </>
              )}
              {fp.messageInvitation && (
                <>
                  <BamilekeDivider
                    color={design.accentColor}
                    className="my-6"
                  />
                  <p
                    className="text-sm sm:text-base leading-relaxed"
                    style={{ color: `${design.primaryColor}99` }}
                  >
                    {fp.messageInvitation}
                  </p>
                </>
              )}
            </BamilekeFrame>
          </div>
        </section>

        {/* ========= PHOTOS SOUVENIRS DE LA PERSONNE ========= */}
        {fp.fairePartPhotos && fp.fairePartPhotos.length > 0 && (
          <section className="py-10 sm:py-14" style={{ backgroundColor: design.backgroundColor }}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="font-heading text-xl sm:text-2xl text-center mb-2" style={{ color: design.primaryColor }}>
                {isFunerailles ? "En souvenir" : "Moments de vie"}
              </h2>
              <BamilekeDivider color={design.accentColor} className="mb-8" />
              <div className={`grid gap-4 sm:gap-6 ${
                fp.fairePartPhotos.length === 1
                  ? "grid-cols-1 max-w-sm mx-auto"
                  : fp.fairePartPhotos.length === 2
                    ? "grid-cols-2 max-w-lg mx-auto"
                    : "grid-cols-2 sm:grid-cols-3"
              }`}>
                {fp.fairePartPhotos.map((photo) => (
                  <motion.div
                    key={photo.id}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden border-4 mx-auto" style={{ borderColor: `${design.accentColor}30` }}>
                      <Image
                        src={photo.url}
                        alt={photo.caption || ""}
                        fill
                        className="object-cover sepia-[0.15] contrast-[1.05]"
                        sizes={fp.fairePartPhotos!.length <= 2 ? "50vw" : "33vw"}
                      />
                    </div>
                    {photo.caption && (
                      <p className="font-heading text-xs sm:text-sm italic mt-3" style={{ color: `${design.primaryColor}80` }}>
                        {photo.caption}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ========= BOUGIE VIRTUELLE (funerailles) — en haut, emotionnel ========= */}
        {isFunerailles && (
          <section className="print:hidden py-10 sm:py-14" style={{ backgroundColor: `${design.primaryColor}F5` }}>
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <VirtualCandle
                fairePartId={fp.id}
                accentColor={design.accentColor}
                primaryColor={design.primaryColor}
              />
            </div>
          </section>
        )}

        {/* ========= COMPTEURS DE VIE ========= */}
        {isFunerailles && (
          <section className="py-12 sm:py-16" style={{ backgroundColor: `${design.primaryColor}E0` }}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <LifeCounters fp={fp} accentColor={design.accentColor} />
            </div>
          </section>
        )}

        {/* ========= BIOGRAPHIE ========= */}
        {fp.biographie && (
          <section style={{ backgroundColor: design.primaryColor }} className="relative overflow-hidden">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: `repeating-linear-gradient(45deg, ${design.accentColor} 0, ${design.accentColor} 1px, transparent 0, transparent 50%)`,
              backgroundSize: "24px 24px",
            }} />
            <div className="max-w-3xl mx-auto px-6 sm:px-8 py-12 sm:py-16 relative">
              <h2 className="font-heading text-2xl sm:text-3xl text-center text-cream mb-2">
                {isFunerailles ? "Biographie" : "Notre histoire"}
              </h2>
              <BamilekeDivider color={design.accentColor} className="mb-8" />
              <p className="text-cream/70 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {fp.biographie}
              </p>
            </div>
          </section>
        )}

        {/* ========= VIDEO RECAP ========= */}
        {fp.recapVideoUrl && (
          <section className="print:hidden py-12 sm:py-16" style={{ backgroundColor: design.primaryColor }}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="font-heading text-2xl sm:text-3xl text-center text-cream mb-2">
                {fp.recapVideoTitle || "Video de la ceremonie"}
              </h2>
              <BamilekeDivider color={design.accentColor} className="mb-8" />
              <VideoPlayer
                url={fp.recapVideoUrl}
                title={fp.recapVideoTitle}
                accentColor={design.accentColor}
              />
            </div>
          </section>
        )}

        {/* ========= PROGRAMME — CEREMONIE ========= */}
        {fp.programme.length > 0 && (
          <section style={{ backgroundColor: design.backgroundColor }}>
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
              <h2
                className="font-heading text-2xl sm:text-3xl text-center mb-2"
                style={{ color: design.primaryColor }}
              >
                Programme
              </h2>
              <BamilekeDivider color={design.accentColor} className="mb-10" />
              <CeremonyProgramme
                programme={fp.programme}
                accentColor={design.accentColor}
                primaryColor={design.primaryColor}
                backgroundColor={design.backgroundColor}
              />
            </div>
          </section>
        )}

        {/* ========= FAMILLE ========= */}
        {fp.famille.length > 0 && (
          <section style={{ backgroundColor: design.backgroundColor }}>
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
              <h2
                className="font-heading text-2xl sm:text-3xl text-center mb-2"
                style={{ color: design.primaryColor }}
              >
                {isFunerailles ? "La famille" : "Les familles"}
              </h2>
              <BamilekeDivider color={design.accentColor} className="mb-10" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {fp.famille.map((group, i) => {
                  const cat = FAMILLE_CATEGORIES.find(
                    (c) => c.value === group.categorie
                  );
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                      className="border p-4 sm:p-5"
                      style={{ borderColor: `${design.accentColor}30` }}
                    >
                      {group.coteFamille && isMariage && (
                        <p className="text-[10px] tracking-widest uppercase mb-1" style={{ color: `${design.accentColor}80` }}>
                          {group.coteFamille === "marie" ? "Cote marie" : group.coteFamille === "mariee" ? "Cote mariee" : ""}
                        </p>
                      )}
                      <h4
                        className="font-heading text-sm tracking-wider uppercase mb-3"
                        style={{ color: design.accentColor }}
                      >
                        {group.labelCustom || cat?.label || group.categorie}
                      </h4>
                      <ul className="space-y-1.5">
                        {group.membres.map((membre, j) => (
                          <li
                            key={j}
                            className="text-sm leading-relaxed"
                            style={{ color: design.primaryColor }}
                          >
                            {membre.estDecede && <span className="opacity-60">Feu </span>}
                            {membre.nom}
                            {membre.conjoint && <span className="opacity-70"> {membre.conjoint}</span>}
                            {membre.mention && <span className="opacity-60"> {membre.mention}</span>}
                            {membre.villeResidence && (
                              <span className="opacity-50 text-xs"> ({membre.villeResidence})</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ========= DOT (mariage traditionnel) ========= */}
        {fp.dotItems && fp.dotItems.length > 0 && (
          <section style={{ backgroundColor: design.backgroundColor }}>
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
              <h2 className="font-heading text-2xl sm:text-3xl text-center mb-2" style={{ color: design.primaryColor }}>
                La dot
              </h2>
              <BamilekeDivider color={design.accentColor} className="mb-8" />
              <DotDisplay
                items={fp.dotItems}
                accentColor={design.accentColor}
                primaryColor={design.primaryColor}
              />
            </div>
          </section>
        )}

        {/* ========= CONTRIBUTIONS ========= */}
        {fp.contributions && (
          <section style={{ backgroundColor: design.primaryColor }}>
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
              <h2 className="font-heading text-2xl sm:text-3xl text-center text-cream mb-2">
                Contributions
              </h2>
              <BamilekeDivider color={design.accentColor} className="mb-8" />
              {fp.contributions.message && (
                <p className="text-cream/60 text-sm text-center mb-8 max-w-lg mx-auto leading-relaxed">
                  {fp.contributions.message}
                </p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {fp.contributions.orangeMoney && (
                  <div className="border p-4 text-center" style={{ borderColor: `${design.accentColor}30` }}>
                    <p className="text-xs text-cream/40 uppercase tracking-wider mb-1">Orange Money</p>
                    <p className="text-cream font-heading text-lg">{fp.contributions.orangeMoney}</p>
                  </div>
                )}
                {fp.contributions.mtnMomo && (
                  <div className="border p-4 text-center" style={{ borderColor: `${design.accentColor}30` }}>
                    <p className="text-xs text-cream/40 uppercase tracking-wider mb-1">MTN Mobile Money</p>
                    <p className="text-cream font-heading text-lg">{fp.contributions.mtnMomo}</p>
                  </div>
                )}
                {fp.contributions.rib && (
                  <div className="border p-4 text-center sm:col-span-2" style={{ borderColor: `${design.accentColor}30` }}>
                    <p className="text-xs text-cream/40 uppercase tracking-wider mb-1">Virement bancaire</p>
                    <p className="text-cream text-sm">{fp.contributions.rib}</p>
                  </div>
                )}
                {fp.contributions.interac && (
                  <div className="border p-4 text-center" style={{ borderColor: `${design.accentColor}30` }}>
                    <p className="text-xs text-cream/40 uppercase tracking-wider mb-1">Interac (Canada)</p>
                    <p className="text-cream text-sm">{fp.contributions.interac}</p>
                  </div>
                )}
                {fp.contributions.paypal && (
                  <div className="border p-4 text-center" style={{ borderColor: `${design.accentColor}30` }}>
                    <p className="text-xs text-cream/40 uppercase tracking-wider mb-1">PayPal</p>
                    <p className="text-cream text-sm">{fp.contributions.paypal}</p>
                  </div>
                )}
              </div>
              {fp.contributions.nomBeneficiaire && (
                <p className="text-cream/30 text-xs text-center mt-4">
                  Beneficiaire : {fp.contributions.nomBeneficiaire}
                </p>
              )}

              {/* CTA Paiement en ligne */}
              <div className="mt-8 text-center">
                <button
                  onClick={() => setShowPayment(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white rounded-lg transition-all hover:brightness-110 hover:scale-[1.02]"
                  style={{ backgroundColor: design.accentColor }}
                >
                  <Heart size={16} />
                  Contribuer en ligne
                </button>
                <p className="text-cream/30 text-[10px] mt-2">
                  Orange Money, MTN MoMo, Visa/Mastercard
                </p>
              </div>

              {/* Real-time contributions list */}
              <ContributionsList
                fairePartId={fp.id}
                contributionsTotal={fp.contributionsTotal}
                accentColor={design.accentColor}
                primaryColor={design.primaryColor}
              />
            </div>
          </section>
        )}

        {/* Payment modal */}
        {showPayment && (
          <ContributionPayment
            fairePartId={fp.id}
            accentColor={design.accentColor}
            primaryColor={design.primaryColor}
            onClose={() => setShowPayment(false)}
          />
        )}

        {showWhatsAppShare && (
          <WhatsAppShare
            fairePartSlug={fp.slug}
            fairePartTitle={fp.titre}
            personName={mainPerson ? `${mainPerson.prenoms} ${mainPerson.nom}` : fp.familleName}
            accentColor={design.accentColor}
            primaryColor={design.primaryColor}
            onClose={() => setShowWhatsAppShare(false)}
          />
        )}

        {/* ========= REMERCIEMENTS ========= */}
        {fp.remerciements && (
          <section style={{ backgroundColor: design.backgroundColor }}>
            <div className="max-w-3xl mx-auto px-6 sm:px-8 py-12 sm:py-16 text-center">
              <h2 className="font-heading text-2xl sm:text-3xl mb-2" style={{ color: design.primaryColor }}>
                Remerciements
              </h2>
              <BamilekeDivider color={design.accentColor} className="mb-8" />
              <p className="text-sm leading-relaxed italic" style={{ color: `${design.primaryColor}80` }}>
                {fp.remerciements}
              </p>
            </div>
          </section>
        )}

        {/* ========= INFOS PRATIQUES ========= */}
        <section style={{ backgroundColor: design.backgroundColor }}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <h2
              className="font-heading text-2xl sm:text-3xl text-center mb-2"
              style={{ color: design.primaryColor }}
            >
              Informations pratiques
            </h2>
            <BamilekeDivider color={design.accentColor} className="mb-8" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fp.adresseReception && (
                <div className="flex items-start gap-3 p-4 border" style={{ borderColor: `${design.accentColor}30` }}>
                  <MapPin size={18} style={{ color: design.accentColor }} className="mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs uppercase tracking-wider" style={{ color: design.accentColor }}>Adresse</p>
                    <p className="text-sm mt-1" style={{ color: design.primaryColor }}>{fp.adresseReception}</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3 p-4 border" style={{ borderColor: `${design.accentColor}30` }}>
                <Phone size={18} style={{ color: design.accentColor }} className="mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs uppercase tracking-wider" style={{ color: design.accentColor }}>Contacts famille</p>
                  {fp.contactsFamille.map((c, i) => (
                    <div key={i} className="mt-1">
                      <a href={`tel:${c.telephone.replace(/\s/g, "")}`} className="text-sm block" style={{ color: design.primaryColor }}>{c.telephone}</a>
                      <span className="text-xs opacity-50">{c.nom}{c.ville ? ` (${c.ville})` : ""}{c.role ? ` — ${c.role}` : ""}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 border" style={{ borderColor: `${design.accentColor}30` }}>
                <Users size={18} style={{ color: design.accentColor }} className="mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs uppercase tracking-wider" style={{ color: design.accentColor }}>Organise par</p>
                  <p className="text-sm mt-1" style={{ color: design.primaryColor }}>ETS Mme Jesus</p>
                  <a href={`tel:${fp.contactOrganisateur.replace(/\s/g, "")}`} className="text-xs mt-0.5 block" style={{ color: design.accentColor }}>{fp.contactOrganisateur}</a>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 border" style={{ borderColor: `${design.accentColor}30` }}>
                <Calendar size={18} style={{ color: design.accentColor }} className="mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs uppercase tracking-wider" style={{ color: design.accentColor }}>Lieu</p>
                  <p className="text-sm mt-1" style={{ color: design.primaryColor }}>{fp.ville}, {fp.region}</p>
                </div>
              </div>
              {fp.codeVestimentaire && (
                <div className="flex items-start gap-3 p-4 border sm:col-span-2" style={{ borderColor: `${design.accentColor}30` }}>
                  <Clock size={18} style={{ color: design.accentColor }} className="mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs uppercase tracking-wider" style={{ color: design.accentColor }}>Code vestimentaire</p>
                    <p className="text-sm mt-1" style={{ color: design.primaryColor }}>{fp.codeVestimentaire}</p>
                    {fp.pagneInfo && <p className="text-xs mt-1 opacity-60" style={{ color: design.primaryColor }}>{fp.pagneInfo}</p>}
                  </div>
                </div>
              )}
              {fp.infoHebergement && (
                <div className="flex items-start gap-3 p-4 border" style={{ borderColor: `${design.accentColor}30` }}>
                  <MapPin size={18} style={{ color: design.accentColor }} className="mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs uppercase tracking-wider" style={{ color: design.accentColor }}>Hebergement</p>
                    <p className="text-sm mt-1 whitespace-pre-line" style={{ color: design.primaryColor }}>{fp.infoHebergement}</p>
                  </div>
                </div>
              )}
              {fp.infoTransport && (
                <div className="flex items-start gap-3 p-4 border" style={{ borderColor: `${design.accentColor}30` }}>
                  <Users size={18} style={{ color: design.accentColor }} className="mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs uppercase tracking-wider" style={{ color: design.accentColor }}>Transport / Navettes</p>
                    <p className="text-sm mt-1 whitespace-pre-line" style={{ color: design.primaryColor }}>{fp.infoTransport}</p>
                  </div>
                </div>
              )}
              {fp.comiteOrganisation && fp.comiteOrganisation.length > 0 && (
                <div className="flex items-start gap-3 p-4 border sm:col-span-2" style={{ borderColor: `${design.accentColor}30` }}>
                  <Users size={18} style={{ color: design.accentColor }} className="mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs uppercase tracking-wider" style={{ color: design.accentColor }}>Comite d&apos;organisation</p>
                    {fp.comiteOrganisation.map((m, i) => (
                      <p key={i} className="text-sm mt-1" style={{ color: design.primaryColor }}>{m}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ========= ALBUM SOUVENIR ========= */}
        <section className="print:hidden py-16 sm:py-20 relative overflow-hidden" style={{ backgroundColor: `${design.primaryColor}F8` }}>
          {/* Subtle texture overlay */}
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: `radial-gradient(${design.accentColor} 1px, transparent 1px)`,
            backgroundSize: "20px 20px",
          }} />
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl text-center text-cream mb-2">
              {isFunerailles ? "Album souvenir" : "Album photos et videos"}
            </h2>
            <p className="text-cream/25 text-xs text-center mb-2">
              Souvenirs partages par la famille et les proches
            </p>
            <BamilekeDivider color={design.accentColor} className="mb-10" />

            <Chronicle
              fp={fp}
              accentColor={design.accentColor}
              primaryColor={design.primaryColor}
            />

            {/* Add photo by code */}
            <div className="mt-10 pt-8 border-t" style={{ borderColor: `${design.accentColor}15` }}>
              <AddPhotoByCode
                fairePartId={fp.id}
                slug={fp.slug}
                accessCode={fp.accessCode}
                accentColor={design.accentColor}
                programmeEvents={flattenProgrammeEvents(fp.programme)}
                onPhotoAdded={() => window.location.reload()}
              />
            </div>
          </div>
        </section>
      </div>

      {/* ========= TOOLBAR (non imprime) ========= */}
      <div className="print:hidden border-t" style={{ backgroundColor: design.primaryColor, borderColor: `${design.accentColor}30` }}>
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 text-xs text-cream/80 hover:text-cream border border-cream/20 hover:border-cream/40 transition-colors"
          >
            <Printer size={14} />
            <span className="hidden sm:inline">Imprimer</span>
          </button>
          <PDFDownloadButton fp={fp} />
          <a
            href={whatsappShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 text-xs bg-whatsapp text-white hover:brightness-110 transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Partager
          </a>
          <button
            onClick={() => setShowWhatsAppShare(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs bg-whatsapp text-white hover:brightness-110 transition-all"
          >
            <Send size={14} />
            <span className="hidden sm:inline">Envoyer</span>
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 text-xs text-cream/80 hover:text-cream border border-cream/20 hover:border-cream/40 transition-colors"
          >
            <Share2 size={14} />
            <span className="hidden sm:inline">Copier le lien</span>
          </button>
        </div>
      </div>

      {/* ========= QR CODE ========= */}
      <section className="print:hidden py-8" style={{ backgroundColor: design.backgroundColor }}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-xs mb-3" style={{ color: `${design.primaryColor}60` }}>
            Scannez pour acceder a cette page
          </p>
          <div className="inline-block p-3 bg-white border" style={{ borderColor: `${design.accentColor}30` }}>
            <QRCodeSVG
              value={typeof window !== "undefined" ? window.location.href : `https://etsmmejesus.com/faire-part/${fp.slug}`}
              size={100}
              fgColor={design.primaryColor}
              bgColor="white"
            />
          </div>
        </div>
      </section>

      {/* ========= MUR DE SOUVENIRS / MESSAGES (non imprime) ========= */}
      {fp.allowCondolences && (
        <section className="print:hidden py-12 sm:py-16" style={{ backgroundColor: design.primaryColor }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-heading text-2xl sm:text-3xl text-center text-cream mb-2">
              {isFunerailles ? "Mur de souvenirs" : "Messages"}
            </h2>
            <BamilekeDivider color={design.accentColor} className="mb-8" />
            <MemoryWall
              condolences={condolences}
              loading={loadingCondolences}
              isFunerailles={isFunerailles}
              accentColor={design.accentColor}
              primaryColor={design.primaryColor}
              onSubmit={async (data) => {
                await addCondolence({
                  fairePartId: fp.id,
                  auteur: data.auteur,
                  lien: data.lien,
                  message: data.message,
                  ville: data.ville || undefined,
                });
                loadCondolences();
              }}
            />
          </div>
        </section>
      )}

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          nav,
          footer,
          .print\\:hidden {
            display: none !important;
          }
          body {
            padding-bottom: 0 !important;
          }
          section {
            break-inside: avoid;
          }
        }
      `}</style>
    </>
  );
}
