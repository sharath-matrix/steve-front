import React from "react";
import { useSteveStore } from "../../../stores/steveStore";

export default function NewChatButton() {
  const newChat = useSteveStore((s) => s.createConversation);

  return (
    <button
      onClick={newChat}
      style={{
        width: "100%",
        padding: "10px",
        borderRadius: 10,
        background: "linear-gradient(90deg,#2F5CF0,#4D7CFF)",
        color: "#FFF",
        border: "none",
        marginBottom: 20,
        cursor: "pointer",
        fontWeight: 600,
        fontSize: 14
      }}
    >
      + New Chat
    </button>
  );
}
