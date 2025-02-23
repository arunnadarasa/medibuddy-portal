import { useEffect, useRef } from "react";

function ElevenLabsWidget({ userId }) {
  const widgetRef = useRef(null);

  useEffect(() => {
    const scriptSrc = "https://elevenlabs.io/convai-widget/index.js";

    console.log("ElevenLabs Widget Loading...");

    // Check if script already exists
    if (!document.querySelector(`script[src='${scriptSrc}']`)) {
      const script = document.createElement("script");
      script.src = scriptSrc;
      script.async = true;
      script.onload = () => console.log("ElevenLabs script loaded");
      document.body.appendChild(script);
    }

    // Ensure the custom element is ready before setting attributes
    customElements.whenDefined("elevenlabs-convai").then(() => {
      console.log("ElevenLabs Widget Ready");

      if (widgetRef.current) {
        widgetRef.current.setAttribute(
          "context",
          JSON.stringify({ user_id: userId })
        );
        console.log("Agent context set:", { user_id: userId });
      }
    });
  }, [userId]); // Ensure reactivity if userId changes

  return (
    <div>
      {/* The custom ElevenLabs element - greg-oteOQYnH3OJ7l5JGpdPT - raph-8pkVgwjpCRqjsfbGte5P*/}
      <elevenlabs-convai
        ref={widgetRef}
        agent-id="oteOQYnH3OJ7l5JGpdPT"
      ></elevenlabs-convai>
    </div>
  );
}

export default ElevenLabsWidget;
