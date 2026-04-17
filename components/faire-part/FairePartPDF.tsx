import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Font,
  Link,
} from "@react-pdf/renderer";
import type { FairePartPage } from "@/lib/types";
import { EVENT_TYPE_LABELS, FAMILLE_CATEGORIES } from "@/lib/types";

// Register Cormorant Garamond font
Font.register({
  family: "Cormorant",
  fonts: [
    { src: "/fonts/CormorantGaramond-SemiBold.ttf", fontWeight: 600 },
  ],
});

function createStyles(design: FairePartPage["fairePartDesign"]) {
  return StyleSheet.create({
    page: {
      paddingTop: 50,
      paddingBottom: 50,
      paddingHorizontal: 50,
      backgroundColor: design.backgroundColor,
    },
    coverPage: {
      paddingTop: 0,
      paddingBottom: 0,
      paddingHorizontal: 0,
      backgroundColor: design.primaryColor,
    },
    // Cover
    coverContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 60,
    },
    accentBar: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 6,
      backgroundColor: design.accentColor,
    },
    badge: {
      borderWidth: 1,
      borderColor: design.accentColor,
      paddingVertical: 6,
      paddingHorizontal: 24,
      marginBottom: 30,
    },
    badgeText: {
      fontSize: 10,
      letterSpacing: 3,
      textTransform: "uppercase",
      color: design.accentColor,
    },
    coverName: {
      fontSize: 36,
      fontFamily: "Cormorant",
      color: design.backgroundColor,
      textAlign: "center",
      marginBottom: 8,
    },
    coverDates: {
      fontSize: 16,
      fontFamily: "Cormorant",
      color: design.accentColor,
      textAlign: "center",
      marginTop: 16,
    },
    coverVille: {
      fontSize: 11,
      color: `${design.backgroundColor}90`,
      textAlign: "center",
      marginTop: 12,
      letterSpacing: 2,
    },
    divider: {
      width: 60,
      height: 1,
      backgroundColor: design.accentColor,
      marginVertical: 20,
      opacity: 0.6,
      alignSelf: "center",
    },
    coverFooter: {
      position: "absolute",
      bottom: 20,
      left: 0,
      right: 0,
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: 40,
    },
    coverFooterText: {
      fontSize: 9,
      color: `${design.backgroundColor}60`,
      letterSpacing: 1,
    },
    coverFooterBrand: {
      fontSize: 9,
      color: design.accentColor,
      letterSpacing: 1,
    },
    // Section headings
    sectionTitle: {
      fontSize: 22,
      fontFamily: "Cormorant",
      color: design.primaryColor,
      textAlign: "center",
      marginBottom: 6,
    },
    sectionDivider: {
      width: 40,
      height: 1,
      backgroundColor: design.accentColor,
      alignSelf: "center",
      marginBottom: 20,
    },
    // Body text
    body: {
      fontSize: 10,
      lineHeight: 1.6,
      color: `${design.primaryColor}CC`,
    },
    bodyItalic: {
      fontSize: 10,
      lineHeight: 1.6,
      fontStyle: "italic",
      color: `${design.primaryColor}99`,
      textAlign: "center",
    },
    // Programme
    dayHeader: {
      fontSize: 14,
      fontFamily: "Cormorant",
      color: design.primaryColor,
      marginBottom: 8,
      marginTop: 14,
    },
    eventRow: {
      flexDirection: "row",
      marginBottom: 6,
      paddingBottom: 6,
      borderBottomWidth: 0.5,
      borderBottomColor: `${design.accentColor}20`,
    },
    eventTime: {
      width: 50,
      fontSize: 10,
      fontFamily: "Cormorant",
      color: design.accentColor,
    },
    eventContent: {
      flex: 1,
    },
    eventTitle: {
      fontSize: 10,
      fontWeight: "bold",
      color: design.primaryColor,
    },
    eventDetail: {
      fontSize: 8,
      color: `${design.primaryColor}80`,
      marginTop: 1,
    },
    // Family
    groupTitle: {
      fontSize: 10,
      letterSpacing: 1,
      textTransform: "uppercase",
      color: design.accentColor,
      marginBottom: 4,
      marginTop: 10,
    },
    memberText: {
      fontSize: 9,
      color: `${design.primaryColor}CC`,
      marginBottom: 1.5,
    },
    // Contributions
    contribCard: {
      borderWidth: 0.5,
      borderColor: `${design.accentColor}40`,
      padding: 10,
      marginBottom: 6,
    },
    contribLabel: {
      fontSize: 8,
      letterSpacing: 1.5,
      textTransform: "uppercase",
      color: `${design.primaryColor}60`,
      marginBottom: 2,
    },
    contribValue: {
      fontSize: 12,
      fontFamily: "Cormorant",
      color: design.primaryColor,
    },
    // QR footer
    qrFooter: {
      marginTop: 30,
      alignItems: "center",
    },
    qrText: {
      fontSize: 8,
      color: `${design.primaryColor}60`,
      marginBottom: 6,
    },
    linkText: {
      fontSize: 9,
      color: design.accentColor,
      textDecoration: "underline",
    },
    // Page number
    pageNumber: {
      position: "absolute",
      bottom: 25,
      right: 50,
      fontSize: 8,
      color: `${design.primaryColor}40`,
    },
  });
}

export default function FairePartPDF({ fp }: { fp: FairePartPage }) {
  const design = fp.fairePartDesign;
  const styles = createStyles(design);
  const isFunerailles =
    fp.eventType === "funerailles" || fp.eventType === "levee-de-deuil";
  const isMariage = fp.eventType.startsWith("mariage");
  const mainPerson = fp.personnes[0];
  const secondPerson = fp.personnes[1];
  const eventLabel =
    EVENT_TYPE_LABELS[fp.eventType as keyof typeof EVENT_TYPE_LABELS] ||
    fp.eventType;

  let displayName = "";
  if (mainPerson) {
    displayName = mainPerson.titreHonorifique
      ? `${mainPerson.titreHonorifique} ${mainPerson.prenoms} ${mainPerson.nom}`
      : `${mainPerson.prenoms} ${mainPerson.nom}`;
  }
  if (secondPerson && isMariage) {
    displayName += ` & ${secondPerson.prenoms} ${secondPerson.nom}`;
  }

  let subtitle = "";
  if (isFunerailles && mainPerson) {
    const parts: string[] = [];
    if (mainPerson.dateNaissance) parts.push(mainPerson.dateNaissance);
    if (mainPerson.dateDeces) parts.push(mainPerson.dateDeces);
    subtitle = parts.join(" — ");
  } else if (isMariage && fp.programme[0]) {
    subtitle = fp.programme[0].jour;
  }

  const siteUrl = `https://etsmmejesus.com/faire-part/${fp.slug}`;

  return (
    <Document title={`${eventLabel} — ${displayName}`} author="ETS Mme Jesus">
      {/* ===== PAGE 1: COVER ===== */}
      <Page size="A4" style={styles.coverPage}>
        <View style={styles.accentBar} />
        <View style={styles.coverContainer}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{eventLabel}</Text>
          </View>
          <View style={styles.divider} />
          <Text style={styles.coverName}>{displayName}</Text>
          {subtitle ? (
            <Text style={styles.coverDates}>{subtitle}</Text>
          ) : null}
          <View style={styles.divider} />
          {fp.ville && (
            <Text style={styles.coverVille}>
              {fp.ville}
              {fp.region ? `, ${fp.region}` : ""}
            </Text>
          )}
        </View>
        <View style={styles.coverFooter}>
          <Text style={styles.coverFooterText}>{fp.familleName}</Text>
          <Text style={styles.coverFooterBrand}>ETS Mme Jesus</Text>
        </View>
      </Page>

      {/* ===== PAGE 2: ANNONCE + BIOGRAPHIE ===== */}
      <Page size="A4" style={styles.page}>
        {fp.sousTitre && (
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.sectionTitle}>Annonce</Text>
            <View style={styles.sectionDivider} />
            <Text style={styles.body}>{fp.sousTitre}</Text>
          </View>
        )}

        {fp.versetBiblique && (
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.bodyItalic}>{fp.versetBiblique}</Text>
          </View>
        )}

        {fp.epitaphe && (
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.bodyItalic}>{fp.epitaphe}</Text>
          </View>
        )}

        {fp.biographie && (
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.sectionTitle}>Biographie</Text>
            <View style={styles.sectionDivider} />
            <Text style={styles.body}>{fp.biographie}</Text>
          </View>
        )}

        {fp.messageInvitation && (
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.bodyItalic}>{fp.messageInvitation}</Text>
          </View>
        )}

        <Text
          style={styles.pageNumber}
          render={({ pageNumber }) => `${pageNumber}`}
          fixed
        />
      </Page>

      {/* ===== PAGE 3: PROGRAMME ===== */}
      {fp.programme.length > 0 && (
        <Page size="A4" style={styles.page}>
          <Text style={styles.sectionTitle}>Programme</Text>
          <View style={styles.sectionDivider} />
          {fp.programme.map((jour) => (
            <View key={jour.id}>
              <Text style={styles.dayHeader}>{jour.jour}</Text>
              {jour.evenements.map((evt, ei) => (
                <View key={ei} style={styles.eventRow}>
                  <Text style={styles.eventTime}>{evt.heure}</Text>
                  <View style={styles.eventContent}>
                    <Text style={styles.eventTitle}>{evt.titre}</Text>
                    <Text style={styles.eventDetail}>{evt.lieu}</Text>
                    {evt.description && (
                      <Text style={styles.eventDetail}>{evt.description}</Text>
                    )}
                    {evt.codeVestimentaire && (
                      <Text style={styles.eventDetail}>
                        Tenue : {evt.codeVestimentaire}
                      </Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          ))}
          <Text
            style={styles.pageNumber}
            render={({ pageNumber }) => `${pageNumber}`}
            fixed
          />
        </Page>
      )}

      {/* ===== PAGE 4: FAMILLE ===== */}
      {fp.famille.length > 0 && (
        <Page size="A4" style={styles.page} wrap>
          <Text style={styles.sectionTitle}>
            {isFunerailles ? "La famille" : "Les familles"}
          </Text>
          <View style={styles.sectionDivider} />
          {fp.famille.map((group, i) => {
            const cat = FAMILLE_CATEGORIES.find(
              (c) => c.value === group.categorie
            );
            return (
              <View key={i} wrap={false}>
                <Text style={styles.groupTitle}>
                  {group.labelCustom || cat?.label || group.categorie}
                </Text>
                {group.membres.map((membre, j) => (
                  <Text key={j} style={styles.memberText}>
                    {membre.estDecede ? "Feu " : ""}
                    {membre.nom}
                    {membre.conjoint ? ` ${membre.conjoint}` : ""}
                    {membre.mention ? ` ${membre.mention}` : ""}
                    {membre.villeResidence ? ` (${membre.villeResidence})` : ""}
                  </Text>
                ))}
              </View>
            );
          })}
          <Text
            style={styles.pageNumber}
            render={({ pageNumber }) => `${pageNumber}`}
            fixed
          />
        </Page>
      )}

      {/* ===== PAGE 5: CONTRIBUTIONS + INFOS PRATIQUES ===== */}
      <Page size="A4" style={styles.page}>
        {fp.contributions && (
          <View style={{ marginBottom: 30 }}>
            <Text style={styles.sectionTitle}>Contributions</Text>
            <View style={styles.sectionDivider} />
            {fp.contributions.message && (
              <Text style={[styles.bodyItalic, { marginBottom: 12 }]}>
                {fp.contributions.message}
              </Text>
            )}
            {fp.contributions.orangeMoney && (
              <View style={styles.contribCard}>
                <Text style={styles.contribLabel}>Orange Money</Text>
                <Text style={styles.contribValue}>
                  {fp.contributions.orangeMoney}
                </Text>
              </View>
            )}
            {fp.contributions.mtnMomo && (
              <View style={styles.contribCard}>
                <Text style={styles.contribLabel}>MTN Mobile Money</Text>
                <Text style={styles.contribValue}>
                  {fp.contributions.mtnMomo}
                </Text>
              </View>
            )}
            {fp.contributions.rib && (
              <View style={styles.contribCard}>
                <Text style={styles.contribLabel}>Virement bancaire</Text>
                <Text style={styles.contribValue}>{fp.contributions.rib}</Text>
              </View>
            )}
            {fp.contributions.interac && (
              <View style={styles.contribCard}>
                <Text style={styles.contribLabel}>Interac (Canada)</Text>
                <Text style={styles.contribValue}>
                  {fp.contributions.interac}
                </Text>
              </View>
            )}
            {fp.contributions.paypal && (
              <View style={styles.contribCard}>
                <Text style={styles.contribLabel}>PayPal</Text>
                <Text style={styles.contribValue}>
                  {fp.contributions.paypal}
                </Text>
              </View>
            )}
            {fp.contributions.nomBeneficiaire && (
              <Text
                style={[styles.contribLabel, { marginTop: 6, fontSize: 7 }]}
              >
                Beneficiaire : {fp.contributions.nomBeneficiaire}
              </Text>
            )}
          </View>
        )}

        {/* Practical info */}
        <View style={{ marginBottom: 20 }}>
          <Text style={styles.sectionTitle}>Informations pratiques</Text>
          <View style={styles.sectionDivider} />

          {fp.adresseReception && (
            <Text style={[styles.body, { marginBottom: 4 }]}>
              Lieu : {fp.adresseReception}
            </Text>
          )}
          {fp.codeVestimentaire && (
            <Text style={[styles.body, { marginBottom: 4 }]}>
              Tenue : {fp.codeVestimentaire}
            </Text>
          )}
          {fp.pagneInfo && (
            <Text style={[styles.body, { marginBottom: 4 }]}>
              Pagne : {fp.pagneInfo}
            </Text>
          )}
          {fp.infoHebergement && (
            <Text style={[styles.body, { marginBottom: 4 }]}>
              Hebergement : {fp.infoHebergement}
            </Text>
          )}
          {fp.infoTransport && (
            <Text style={[styles.body, { marginBottom: 4 }]}>
              Transport : {fp.infoTransport}
            </Text>
          )}

          {fp.contactsFamille && fp.contactsFamille.length > 0 && (
            <View style={{ marginTop: 10 }}>
              <Text style={styles.groupTitle}>Contacts</Text>
              {fp.contactsFamille.map((c, i) => (
                <Text key={i} style={styles.memberText}>
                  {c.nom} — {c.telephone}
                  {c.ville ? ` (${c.ville})` : ""}
                  {c.role ? ` — ${c.role}` : ""}
                </Text>
              ))}
            </View>
          )}
        </View>

        {/* Online link */}
        <View style={styles.qrFooter}>
          <Text style={styles.qrText}>
            Consultez ce faire-part en ligne avec photos, condoleances et plus :
          </Text>
          <Link src={siteUrl}>
            <Text style={styles.linkText}>{siteUrl}</Text>
          </Link>
        </View>

        {fp.remerciements && (
          <View style={{ marginTop: 24 }}>
            <View style={styles.divider} />
            <Text style={[styles.bodyItalic, { marginTop: 10, fontSize: 8 }]}>
              {fp.remerciements}
            </Text>
          </View>
        )}

        <Text
          style={styles.pageNumber}
          render={({ pageNumber }) => `${pageNumber}`}
          fixed
        />
      </Page>
    </Document>
  );
}
