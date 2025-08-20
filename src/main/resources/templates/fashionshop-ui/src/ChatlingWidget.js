import { useEffect } from "react";

export default function ChatlingWidget() {
  useEffect(() => {
    window.chtlConfig = {
      chatbotId: "2796661159",
    };

    const script = document.createElement("script");
    script.src = "https://chatling.ai/js/embed.js";
    script.async = true;
    script.id = "chtl-script";
    document.body.appendChild(script);

    return () => {
      const oldScript = document.getElementById("chtl-script");
      if (oldScript) document.body.removeChild(oldScript);
    };
  }, []);

  return null;
}
