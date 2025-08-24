import { useEffect } from "react";

export default function ChatlingWidget() {
  useEffect(() => {
    const script = document.createElement("script");
    script.id = "messenger-widget-b";
    script.src = "https://cdn.botpenguin.com/website-bot.js";
    script.defer = true;

    // Đây là phần nội dung trong <script>...</script>
    const botContent = document.createTextNode(
      "68a6db512d211603a972a75c,68a58dbff4310e67c802bdfa"
    );

    script.appendChild(botContent);
    document.body.appendChild(script);

    return () => {
      const oldScript = document.getElementById("messenger-widget-b");
      if (oldScript) document.body.removeChild(oldScript);
    };
  }, []);

  return null;
}
