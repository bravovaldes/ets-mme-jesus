"use client";

import { Plus, Trash2 } from "lucide-react";
import type { ContactFamille, ContributionInfo, EventType } from "@/lib/types";
import { REGIONS_CAMEROUN } from "@/lib/types";
import { createEmptyContact } from "@/lib/creator-helpers";

interface Step5Props {
  eventType: EventType;
  ville: string;
  onChangeVille: (v: string) => void;
  region: string;
  onChangeRegion: (v: string) => void;
  adresseReception: string;
  onChangeAdresse: (v: string) => void;
  codeVestimentaire: string;
  onChangeCodeVest: (v: string) => void;
  pagneInfo: string;
  onChangePagne: (v: string) => void;
  infoHebergement: string;
  onChangeHeberg: (v: string) => void;
  infoTransport: string;
  onChangeTransport: (v: string) => void;
  celebrant: string;
  onChangeCelebrant: (v: string) => void;
  remerciements: string;
  onChangeRemerciements: (v: string) => void;
  contactsFamille: ContactFamille[];
  onChangeContacts: (c: ContactFamille[]) => void;
  contributions: ContributionInfo;
  onChangeContributions: (c: ContributionInfo) => void;
  isPrivate: boolean;
  onChangePrivate: (v: boolean) => void;
}

const inputStyles = "w-full px-3 py-2.5 bg-cream border border-border text-charcoal text-sm focus:outline-none focus:border-accent transition-colors";
const labelStyles = "block text-xs text-muted mb-1.5";

export default function Step5Infos(props: Step5Props) {
  const isFunerailles = props.eventType === "funerailles" || props.eventType === "levee-de-deuil";

  function addContact() {
    props.onChangeContacts([...props.contactsFamille, createEmptyContact()]);
  }

  function removeContact(i: number) {
    if (props.contactsFamille.length <= 1) return;
    props.onChangeContacts(props.contactsFamille.filter((_, j) => j !== i));
  }

  function updateContact(i: number, field: keyof ContactFamille, value: string) {
    const updated = [...props.contactsFamille];
    updated[i] = { ...updated[i], [field]: value };
    props.onChangeContacts(updated);
  }

  function updateContrib(field: keyof ContributionInfo, value: string) {
    props.onChangeContributions({ ...props.contributions, [field]: value || undefined });
  }

  return (
    <div className="space-y-8">
      {/* Lieu */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelStyles}>Ville *</label>
          <input type="text" value={props.ville} onChange={(e) => props.onChangeVille(e.target.value)} className={inputStyles} placeholder="Dschang" />
        </div>
        <div>
          <label className={labelStyles}>Region</label>
          <select value={props.region} onChange={(e) => props.onChangeRegion(e.target.value)} className={inputStyles}>
            {REGIONS_CAMEROUN.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className={labelStyles}>Adresse de reception</label>
          <input type="text" value={props.adresseReception} onChange={(e) => props.onChangeAdresse(e.target.value)} className={inputStyles} placeholder="Domicile familial, quartier Foto, Dschang" />
        </div>
      </div>

      {/* Celebrant */}
      <div>
        <label className={labelStyles}>Celebrant (pretre, pasteur, imam)</label>
        <input type="text" value={props.celebrant} onChange={(e) => props.onChangeCelebrant(e.target.value)} className={inputStyles} placeholder="Abbe Pierre Ngounou" />
      </div>

      {/* Code vestimentaire */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelStyles}>Code vestimentaire</label>
          <input type="text" value={props.codeVestimentaire} onChange={(e) => props.onChangeCodeVest(e.target.value)} className={inputStyles} placeholder="Pagne de deuil / Tenue traditionnelle" />
        </div>
        <div>
          <label className={labelStyles}>Ou se procurer le pagne</label>
          <input type="text" value={props.pagneInfo} onChange={(e) => props.onChangePagne(e.target.value)} className={inputStyles} placeholder="Chez Mme X au +237 699..." />
        </div>
      </div>

      {/* Hebergement et transport */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelStyles}>Hebergement (pour la diaspora)</label>
          <textarea value={props.infoHebergement} onChange={(e) => props.onChangeHeberg(e.target.value)} rows={2} className={`${inputStyles} resize-none`} placeholder="Hotel Meumi Palace, +237 233..." />
        </div>
        <div>
          <label className={labelStyles}>Transport / Navettes</label>
          <textarea value={props.infoTransport} onChange={(e) => props.onChangeTransport(e.target.value)} rows={2} className={`${inputStyles} resize-none`} placeholder="Navettes depuis Douala (depart 05h00)..." />
        </div>
      </div>

      {/* Contacts famille */}
      <div>
        <h3 className="font-heading text-lg text-charcoal mb-3">Contacts de la famille</h3>
        <div className="space-y-3">
          {props.contactsFamille.map((c, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-start">
              <input type="text" value={c.nom} onChange={(e) => updateContact(i, "nom", e.target.value)} className={`${inputStyles} col-span-4`} placeholder="Nom *" />
              <input type="text" value={c.telephone} onChange={(e) => updateContact(i, "telephone", e.target.value)} className={`${inputStyles} col-span-3`} placeholder="Telephone *" />
              <input type="text" value={c.ville || ""} onChange={(e) => updateContact(i, "ville", e.target.value)} className={`${inputStyles} col-span-2`} placeholder="Ville" />
              <input type="text" value={c.role || ""} onChange={(e) => updateContact(i, "role", e.target.value)} className={`${inputStyles} col-span-2`} placeholder="Role" />
              <button onClick={() => removeContact(i)} className="col-span-1 text-red-300 hover:text-red-500 p-2">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          <button onClick={addContact} className="flex items-center gap-1.5 text-xs text-accent">
            <Plus size={14} /> Ajouter un contact
          </button>
        </div>
      </div>

      {/* Contributions */}
      <div>
        <h3 className="font-heading text-lg text-charcoal mb-1">Contributions financieres</h3>
        <p className="text-muted text-xs mb-4">Renseignez les numeros Mobile Money et/ou le RIB pour recevoir les contributions.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelStyles}>Message (optionnel)</label>
            <input type="text" value={props.contributions.message || ""} onChange={(e) => updateContrib("message", e.target.value)} className={inputStyles} placeholder="Toute contribution est la bienvenue" />
          </div>
          <div>
            <label className={labelStyles}>Nom du beneficiaire</label>
            <input type="text" value={props.contributions.nomBeneficiaire || ""} onChange={(e) => updateContrib("nomBeneficiaire", e.target.value)} className={inputStyles} placeholder="Comite d'organisation..." />
          </div>
          <div>
            <label className={labelStyles}>Orange Money</label>
            <input type="text" value={props.contributions.orangeMoney || ""} onChange={(e) => updateContrib("orangeMoney", e.target.value)} className={inputStyles} placeholder="699 12 34 56 (Nom)" />
          </div>
          <div>
            <label className={labelStyles}>MTN Mobile Money</label>
            <input type="text" value={props.contributions.mtnMomo || ""} onChange={(e) => updateContrib("mtnMomo", e.target.value)} className={inputStyles} placeholder="677 88 99 00 (Nom)" />
          </div>
          <div className="sm:col-span-2">
            <label className={labelStyles}>RIB bancaire</label>
            <input type="text" value={props.contributions.rib || ""} onChange={(e) => updateContrib("rib", e.target.value)} className={inputStyles} placeholder="BICEC - Compte N° ..." />
          </div>
          <div>
            <label className={labelStyles}>Interac (Canada)</label>
            <input type="text" value={props.contributions.interac || ""} onChange={(e) => updateContrib("interac", e.target.value)} className={inputStyles} placeholder="email@example.com" />
          </div>
          <div>
            <label className={labelStyles}>PayPal</label>
            <input type="text" value={props.contributions.paypal || ""} onChange={(e) => updateContrib("paypal", e.target.value)} className={inputStyles} placeholder="email@paypal.com" />
          </div>
        </div>
      </div>

      {/* Remerciements */}
      {isFunerailles && (
        <div>
          <label className={labelStyles}>Remerciements (optionnel)</label>
          <textarea value={props.remerciements} onChange={(e) => props.onChangeRemerciements(e.target.value)} rows={3} className={`${inputStyles} resize-none`} placeholder="La famille remercie sincerement le personnel medical, la communaute..." />
        </div>
      )}

      {/* Privacy */}
      <div className="border border-border p-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={props.isPrivate} onChange={(e) => props.onChangePrivate(e.target.checked)} className="accent-accent w-4 h-4" />
          <div>
            <p className="text-sm text-charcoal font-medium">Page privee</p>
            <p className="text-xs text-muted">Seules les personnes disposant du lien pourront acceder au faire-part. Il ne sera pas visible dans la liste publique.</p>
          </div>
        </label>
      </div>
    </div>
  );
}
