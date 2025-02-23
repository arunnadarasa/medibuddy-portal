import { useEffect, useRef } from "react";

function ElevenLabsWidget({ userId }) {
  const widgetContainerRef = useRef(null);

  useEffect(() => {
    if (!userId) {
      console.warn(
        "ElevenLabs Widget: userId is missing, skipping initialization."
      );
      return;
    }

    const scriptSrc = "https://elevenlabs.io/convai-widget/index.js";
    console.log("ElevenLabs Widget Loading...");

    // Check if script is already added
    if (!document.querySelector(`script[src="${scriptSrc}"]`)) {
      const script = document.createElement("script");
      script.src = scriptSrc;
      script.async = true;
      script.onload = () => {
        console.log("ElevenLabs script loaded, initializing widget...");

        // Ensure the widget is fully ready before setting attributes
        customElements.whenDefined("elevenlabs-convai").then(() => {
          console.log("ElevenLabs Widget Ready");

          const widget =
            widgetContainerRef.current?.querySelector("elevenlabs-convai");
          if (widget) {
            widget.setAttribute("context", JSON.stringify({ user_id: userId }));
            console.log("Agent context set:", { user_id: userId });
          } else {
            console.error("ElevenLabs Widget: Could not find widget element.");
          }
        });
      };
      document.body.appendChild(script);
    }
  }, [userId]); // Only re-run if userId changes

  return (
    <div ref={widgetContainerRef}>
      {/* The custom ElevenLabs element - greg-oteOQYnH3OJ7l5JGpdPT - raph-8pkVgwjpCRqjsfbGte5P*/}
      <elevenlabs-convai agent-id="oteOQYnH3OJ7l5JGpdPT"></elevenlabs-convai>
    </div>
  );
}

export default ElevenLabsWidget;
