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

    // Ensure the custom element is ready before setting attributes
    customElements.whenDefined("elevenlabs-convai").then(() => {
      console.log("ElevenLabs Widget Ready");

      if (widgetRef.current) {
        widgetRef.current.setAttribute("context", JSON.stringify({ user_id: userId })); // ✅ Correct usage
        console.log("Agent context set:", { user_id: userId });
      }
    });
  }, [userId]); // Ensure reactivity if userId changes

  return (
    <div>
      <elevenlabs-convai ref={widgetRef} agent-id="oteOQYnH3OJ7l5JGpdPT"></elevenlabs-convai>
    </div>
  );
}

export default ElevenLabsWidget;
