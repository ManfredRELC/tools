"use client";

import { useEffect, useRef, useState } from "react";
import { MicIcon } from "./icons";

// Dictation button for free-text fields, built on the browser's native Web
// Speech API. Only Chrome/Edge implement it today, so the button simply
// doesn't render anywhere else -- there's no server-side fallback here.
export function MicButton({ onTranscript }: { onTranscript: (text: string) => void }) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const onTranscriptRef = useRef(onTranscript);

  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  useEffect(() => {
    const SpeechRecognitionCtor = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) return;

    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let finalText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) finalText += result[0].transcript;
      }
      if (finalText.trim()) onTranscriptRef.current(finalText.trim());
    };

    recognition.onerror = (event) => {
      setListening(false);
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        setError("Microphone access was blocked. Check your browser's site permissions.");
      }
    };

    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    setSupported(true);

    return () => {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      recognition.stop();
    };
  }, []);

  if (!supported) return null;

  function toggle() {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    setError(null);
    if (listening) {
      recognition.stop();
      setListening(false);
    } else {
      recognition.start();
      setListening(true);
    }
  }

  return (
    <>
      <button
        type="button"
        className={`mic-btn${listening ? " listening" : ""}`}
        onClick={toggle}
        title={listening ? "Stop dictation" : "Dictate with microphone"}
        aria-label={listening ? "Stop dictation" : "Start dictation"}
      >
        <MicIcon />
      </button>
      {error ? <span className="mic-error">{error}</span> : null}
    </>
  );
}
