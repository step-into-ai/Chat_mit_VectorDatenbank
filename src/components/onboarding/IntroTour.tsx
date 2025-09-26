import { Button, Snackbar } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';

const TOUR_KEY = 'vectorchat:onboarding-completed';

interface IntroTourProps {
  enabled: boolean;
}

export const IntroTour: React.FC<IntroTourProps> = ({ enabled }) => {
  const [run, setRun] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setRun(false);
      setOpenSnackbar(false);
      return;
    }
    if (typeof window === 'undefined') {
      return;
    }
    const completed = window.localStorage.getItem(TOUR_KEY) === 'true';
    if (completed) {
      setRun(false);
      setOpenSnackbar(true);
    } else {
      setRun(true);
      setOpenSnackbar(false);
    }
  }, [enabled]);

  const steps: Step[] = [
    {
      target: 'body',
      placement: 'center',
      content: 'Willkommen bei VectorChat Studio! Lass uns die Highlights anschauen.'
    },
    {
      target: '#database-section',
      content: 'Hier lädst du Dokumente hoch und steuerst, wie deine Pinecone-Datenbank aktualisiert wird.'
    },
    {
      target: '#chat-section',
      content: 'Starte hier Gespräche mit deinem KI Agent. Quellen aus Pinecone werden direkt angezeigt.'
    },
    {
      target: '#settings-section',
      content: 'Verwalte deine Webhook Profile und teste Verbindungen zu n8n.'
    }
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finished = status === STATUS.FINISHED || status === STATUS.SKIPPED;
    if (finished) {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(TOUR_KEY, 'true');
      }
      setRun(false);
      setOpenSnackbar(true);
    }
  };

  return (
    <>
      <Joyride
        steps={steps}
        run={run}
        continuous
        showSkipButton
        locale={{
          next: 'Weiter',
          back: 'Zurück',
          skip: 'Überspringen',
          last: 'Fertig'
        }}
        styles={{
          options: {
            primaryColor: '#2979ff',
            textColor: '#0b1120'
          }
        }}
        callback={handleJoyrideCallback}
      />
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        message="Tour abgeschlossen! Du kannst sie in den Einstellungen neu starten."
        onClose={() => setOpenSnackbar(false)}
        action={
          !run && (
            <Button color="secondary" size="small" onClick={() => setRun(true)}>
              Jetzt starten
            </Button>
          )
        }
      />
    </>
  );
};
