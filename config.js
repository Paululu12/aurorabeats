/**
 * ╔══════════════════════════════════════════════════════╗
 * ║          AURORA BEATS — WEBSITE KONFIGURATION        ║
 * ║  Hier kannst du ALLES anpassen. Nur diese Datei!    ║
 * ╚══════════════════════════════════════════════════════╝
 *
 * Nach jeder Änderung:
 *   git add config.js
 *   git commit -m "update"
 *   git push
 * → Seite ist nach ~1 Minute aktuell.
 */

const CONFIG = {

  /* ─────────────────────────────────────
     1. DEINE INFOS
  ───────────────────────────────────── */
  djName:      "Aurora Beats",        // Dein DJ-Name (groß angezeigt)
  realName:    "Paul Witthohn",       // Dein echter Name (im Impressum)
  poweredBy:   "p4ul.wit",            // Wird im Footer angezeigt
  tagline:     "Elektronische Musik, die bewegt.",
  bio: [
    // Jeder Eintrag = ein Absatz. Einfach mehr hinzufügen oder löschen.
    "Zwischen hypnotischen Melodien und treibenden Basslines erschafft jedes Set eine eigene Welt — irgendwo zwischen Club und Cosmos.",
    "Seit Jahren verwurzelt im elektronischen Untergrund geht es bei Aurora Beats nie nur um Musik — es geht um das Gefühl dahinter.",
  ],
  genres: ["Deep House", "Techno", "Melodic", "Ambient"],

  /* ─────────────────────────────────────
     2. ONLINE / OFFLINE STATUS
     ★ DAS IST DEIN HAUPT-SCHALTER ★
     true  = du bist ONLINE (grün)
     false = du bist OFFLINE (grau)
  ───────────────────────────────────── */
  online: false,

  /* ─────────────────────────────────────
     3. SENDEPLAN / TERMINE
     Füge Zeilen hinzu oder lösche sie.
     live: true = zeigt "LIVE"-Badge
  ───────────────────────────────────── */
  schedule: [
    { day: "Freitag",  time: "20:00 – 22:00", show: "DJ Set",        genre: "House · Techno",       live: true  },
    { day: "Samstag",  time: "18:00 – 20:00", show: "Weekend Vibes", genre: "Deep House · Melodic", live: true  },
    { day: "Sonntag",  time: "16:00 – 18:00", show: "Sunday Session",genre: "Chill · Ambient",      live: false },
    { day: "Mittwoch", time: "21:00 – 23:00", show: "Midweek Mix",   genre: "Techno · Industrial",  live: false },
  ],

  /* ─────────────────────────────────────
     4. SOCIAL LINKS
     Ersetze "#" mit deiner echten URL.
     Auf null setzen = wird ausgeblendet.
  ───────────────────────────────────── */
  socials: [
    { icon: "ig",      label: "Instagram", url: "#" },        // ← deine Instagram-URL
    { icon: "discord", label: "Discord",   url: "https://discord.gg/C9XZjHKWXr" },
  ],

  /* ─────────────────────────────────────
     5. IMPRESSUM
  ───────────────────────────────────── */
  impressum: {
    name:    "Paul Witthohn",
    street:  "Lindenstraße 13c",
    city:    "23821 Rohlstorf",
    email:   "direktanfragepaul@gmail.com",
    country: "Deutschland",
  },

  /* ─────────────────────────────────────
     6. DOMAIN
  ───────────────────────────────────── */
  domain: "aurorabeats.site",

  /* ─────────────────────────────────────
     7. JSONBIN (OPTIONAL — ECHTZEIT-STATUS)
     Wenn du enabled: false lässt →
     wird der Status aus config.js oben
     verwendet (Variante A).

     Wenn du JSONBin einrichten willst:
     1. Geh zu https://jsonbin.io
     2. Erstelle ein kostenloses Konto
     3. Erstelle einen neuen Bin mit diesem Inhalt:
        { "online": false }
     4. Kopiere die Bin-ID und den API-Key hierher
     5. Setze enabled: true
     → Status ändert sich dann OHNE Code-Push!
  ───────────────────────────────────── */
  jsonbin: {
    enabled: false,
    binId:   "DEINE_BIN_ID",          // z.B. "64a1b2c3d4e5f6a7b8c9d0e1"
    apiKey:  "DEIN_MASTER_KEY",        // beginnt mit $2b$...
    // Polling-Intervall in Sekunden (wie oft Status abgefragt wird)
    pollInterval: 30,
  },

};
