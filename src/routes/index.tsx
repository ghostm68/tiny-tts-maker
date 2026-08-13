import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

import "../pocket-tts/pocket-tts.css";
import { pocketTtsMarkup } from "../pocket-tts/markup";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pocket TTS - Neural Voice Cloning in Your Browser" },
      {
        name: "description",
        content:
          "Real-time multilingual neural text-to-speech with voice cloning, running entirely in your browser on CPU via ONNX Runtime.",
      },
      { property: "og:title", content: "Pocket TTS - Voice Cloning in Your Browser" },
      {
        property: "og:description",
        content:
          "Stream neural speech and clone voices locally in the browser. Multilingual ONNX text-to-speech, no server required.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Quicksand:wght@500;600;700&family=Nunito:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  component: Index,
});

function Index() {
  useEffect(() => {
    const scripts: HTMLScriptElement[] = [];

    const load = (src: string, type?: "module") =>
      new Promise<void>((resolve, reject) => {
        const el = document.createElement("script");
        el.src = src;
        if (type) el.type = type;
        el.onload = () => resolve();
        el.onerror = () => reject(new Error(`Failed to load ${src}`));
        document.body.appendChild(el);
        scripts.push(el);
      });

    let cancelled = false;
    (async () => {
      try {
        await load("https://cdn.jsdelivr.net/npm/onnxruntime-web@1.20.0/dist/ort.min.js");
        if (cancelled) return;
        await load("/onnx-streaming.js", "module");
      } catch (error) {
        console.error(error);
      }
    })();

    return () => {
      cancelled = true;
      scripts.forEach((el) => el.remove());
    };
  }, []);

  return (
    <div
      className="pocket-tts-root"
      dangerouslySetInnerHTML={{ __html: pocketTtsMarkup }}
    />
  );
}
