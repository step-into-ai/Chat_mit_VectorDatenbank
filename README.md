# Chat mit Vector Datenbank - VectorChat Studio

Eine moderne React-Anwendung, mit der du Dokumente hochlaedst, n8n-Webhooks verwaltest und ueber einen KI-gestuetzten Chat auf deinen Vector-Speicher zugreifst.

## Features

- Dokument-Flow: PDFs, Notizen oder CSVs hochladen und direkt an deinen n8n-Flow weiterleiten.
- Upload-Feedback: Dateiliste, Statusmeldungen und Base64-Uebertragung ohne komplizierte Formulare.
- Chat Workspace: Fragen in Alltagssprache stellen - Antworten kommen aus deinem Vector-Kontext.
- Einstellungen: Webhooks zentral pflegen, lokal speichern und bei Bedarf zuruecksetzen.
- Theme & Onboarding: Moderne UI mit Light/Dark-Mode und optionaler Guided Tour.

## Entwicklung

Lokal installieren und starten:
- npm install
- npm run dev

Die Anwendung laeuft anschliessend auf http://localhost:5173.

Fuer ein Produktions-Build: npm run build

## Deployment auf GitHub Pages

1. npm run build:docs (erstellt docs/ plus .nojekyll)
2. docs/ committen und auf main pushen
3. In den Pages-Einstellungen Branch: main und Ordner: /docs setzen

Nach jedem Update wiederholst du Schritt 1 und 2; GitHub Pages zieht sich dann automatisch die gebauten Assets.

## Struktur

- src/pages - Seiten fuer Datenbank, Chat und Einstellungen
- src/components - Wiederverwendbare UI-Bausteine
- src/store - Persistente Einstellungen (Zustand Store)
- src/api - Webhook-Clients fuer Uploads und Chat
- src/theme - Material-UI-Theme mit VectorChat-Farben

Viel Spass beim Chatten mit deinen eigenen Daten!
