# Chat mit Vector Datenbank – VectorChat Studio

Eine moderne React-Anwendung für den Upload von Dokumenten, das Management deiner n8n Webhook-Profile und einen KI-gestützten Chat, der auf einer Pinecone Vektordatenbank basiert.

## Features

- **Datenbank Tab**: Lade PDFs, Texte oder strukturierte Daten hoch, vergib Tags und steuere über einen eleganten Regler, ob dein Index aktualisiert wird.
- **Upload Monitoring**: Verfolge den Status deiner Ingestion-Jobs mit einer Live-Fortschrittsanzeige.
- **Chat Tab**: Unterhalte dich mit deinem Agenten, inklusive Quellen-Hinweisen aus Pinecone und einem Toggle für Quellen.
- **Einstellungen**: Verwalte mehrere Webhook-Profile, speichere sie dauerhaft im Local Storage und starte eine Onboarding-Tour neu.
- **Onboarding & Theme**: Automatische Guided Tour beim Erststart sowie Dark-/Light-Mode.

## Entwicklung

```bash
npm install
npm run dev
```

Die Anwendung läuft anschließend auf [http://localhost:5173](http://localhost:5173).

Für ein Produktionsbuild:

```bash
npm run build
```

## Struktur

- `src/pages` – Seiten für Datenbank, Chat und Einstellungen.
- `src/components` – Wiederverwendbare UI-Bausteine (Upload, Chat, Settings, Onboarding).
- `src/store` – Persistente Einstellungen (Zustand Store).
- `src/api` – Webhook-Clients für Uploads und Chat.
- `src/theme` – Material UI Theme mit Blautönen und Dark Mode.

Viel Spaß beim Chatten mit deinen eigenen Daten! 💙
