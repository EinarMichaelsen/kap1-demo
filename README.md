# KAP1 — Landingsside for kickoff 26. august

En enkel, rask landingsside som tester interessen for **KAP1** — en satsing som
gir folk kunnskapen og verktøyene de trenger for å starte sitt eget selskap.

Siden er bygget for å være et **eksperiment**, ikke bare en brosjyre: den
fanger e-post fra folk som vil bli med på kickoffen, slik at du kan måle om det
er nok interesse til å satse videre.

## Slik måler du om folk er gira

1. Publiser siden (se under) og driv trafikk dit fra Instagram-postene i
   `/marketing`.
2. Følg med på to tall:
   - **Besøkende** (fra Vercel Analytics eller Instagram-innsikt)
   - **Påmeldinger** (i Formspree-dashbordet ditt)
3. Regn ut konverteringsraten: `påmeldinger / besøkende`.
   - **20 %+** = sterkt signal, folk vil ha dette. Sett i gang.
   - **5–20 %** = lovende, men juster budskap/målgruppe og test igjen.
   - **< 5 %** = svakt signal. Du sparte deg selv for måneder med arbeid.

## Teknisk

- [Next.js 14](https://nextjs.org/) (App Router) + Tailwind CSS
- Deployes på [Vercel](https://vercel.com)

### Kjør lokalt

```bash
npm install
npm run dev
# åpne http://localhost:3000
```

### Koble på e-postinnsamling (Formspree — ca. 30 sekunder)

Siden fungerer i «demo-modus» uten oppsett, men for å faktisk lagre
e-postadresser:

1. Lag en gratis konto på [formspree.io](https://formspree.io) og opprett et
   nytt skjema. Du får en endpoint som ser slik ut:
   `https://formspree.io/f/xxxxxxxx`.
2. Legg den inn som en miljøvariabel i Vercel (Project → Settings →
   Environment Variables):

   ```
   FORMSPREE_ENDPOINT = https://formspree.io/f/xxxxxxxx
   ```

3. Redeploy. Nå havner hver påmelding i Formspree-dashbordet ditt, og du kan
   eksportere listen til CSV når du vil.

> Vil du heller bruke et Google Sheet? Lag et Apps Script-webhook og lim inn
> den URL-en i `FORMSPREE_ENDPOINT` i stedet — API-ruten sender samme JSON
> (`{ email, source, submittedAt }`) uansett mottaker.

## Foto-AI (`/foto`)

En liten ekstra app: gå til `/foto`, ta et bilde i nettleseren, så sendes det
til en AI-modell (Claude) som beskriver hva den ser og viser svaret tilbake.

- Live kamera via nettleseren (bakkamera på mobil), med opplasting som reserve
  hvis kameraet ikke er tilgjengelig.
- Bildet skaleres ned i nettleseren før det sendes, så det går raskt.
- Selve AI-kallet skjer server-side i `app/api/analyze/route.js` — API-nøkkelen
  ligger aldri i nettleseren.

### Koble på AI-en

Du trenger en API-nøkkel fra [Anthropic](https://console.anthropic.com). Legg
den inn som en miljøvariabel i Vercel (Project → Settings → Environment
Variables):

```
ANTHROPIC_API_KEY = sk-ant-...
```

Lokalt: lag en fil `.env.local` med samme linje (se `.env.example`). Uten
nøkkelen svarer `/foto` med en tydelig feilmelding i stedet for å krasje.

## Struktur

```
app/
  page.jsx              # Selve landingssiden
  layout.jsx            # Metadata, fonter
  globals.css           # KAP1-logo-effekt + bakgrunn
  foto/page.jsx         # Foto-AI-appen
  components/
    WaitlistForm.jsx    # Påmeldingsskjema
    Countdown.jsx       # Nedtelling til 26. august
    CameraAnalyzer.jsx  # Kamera + sending til AI (klientkomponent)
  api/subscribe/route.js# Tar imot e-post, sender til Formspree
  api/analyze/route.js  # Sender bilde til Claude, returnerer beskrivelse
marketing/              # Instagram-poster (bilder + caption-tekst)
```
