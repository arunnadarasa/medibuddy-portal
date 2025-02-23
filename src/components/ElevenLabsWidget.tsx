import { useEffect } from "react";

function ElevenLabsWidget() {
  useEffect(() => {
    // Check if script already exists to avoid multiple loads
    if (
      !document.querySelector(
        "script[src='https://elevenlabs.io/convai-widget/index.js']"
      )
    ) {
      const script = document.createElement("script");
      script.src = "https://elevenlabs.io/convai-widget/index.js";
      script.async = true;
      script.onload = () => console.log("ElevenLabs script loaded");
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div>
      {/* The custom ElevenLabs element - greg-oteOQYnH3OJ7l5JGpdPT - raph-8pkVgwjpCRqjsfbGte5P*/}
      <elevenlabs-convai agent-id="oteOQYnH3OJ7l5JGpdPT"></elevenlabs-convai>
    </div>
  );
}

export default ElevenLabsWidget;
