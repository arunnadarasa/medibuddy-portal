import { useEffect, useRef } from "react";

function ElevenLabsWidget({ userId }) {
  const widgetRef = useRef(null);

  useEffect(() => {
    const scriptSrc = "https://elevenlabs.io/convai-widget/index.js";

    // Check if script already exists
    if (!document.querySelector(`script[src='${scriptSrc}']`)) {
      const script = document.createElement("script");
      script.src = scriptSrc;
      script.async = true;
      script.onload = () => console.log("ElevenLabs script loaded");
      document.body.appendChild(script);
    }

    // Wait until the widget is defined
    customElements.whenDefined("elevenlabs-convai").then(() => {
      console.log("ElevenLabs Widget Ready");

      // Get the agent instance and set context
      if (widgetRef.current) {
        widgetRef.current.addEventListener("agent-ready", () => {
          console.log("Agent is ready, setting context...");

          widgetRef.current.setAttribute(
            "context",
            JSON.stringify({ user_id: userId })
          );
        });
      }
    });
  }, [userId]);

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
