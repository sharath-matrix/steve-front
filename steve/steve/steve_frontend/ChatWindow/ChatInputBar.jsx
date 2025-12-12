import React, { useState } from "react";
import { useSteveStore } from "../../../stores/steveStore";

export default function ChatInputBar() {
  const [text, setText] = useState("");
  const send = useSteveStore((s) => s.sendMessage);
  const uploadFile = useSteveStore((s) => s.uploadFile);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    await send({ text });
    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e);
    }
  };

  return (
    <form onSubmit={onSubmit} style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <label style={{ cursor: "pointer" }}>
        <input
          type="file"
          style={{ display: "none" }}
          multiple
          onChange={(e) => uploadFile(e.target.files)}
        />
        <span style={{
          padding: 8,
          borderRadius: 8,
          background: "#F1F5F9",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18
        }}>
          📎
        </span>
      </label>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Describe your campaign goals, target audience, budget..."
        style={{
          flex: 1,
          minHeight: 44,
          maxHeight: 120,
          padding: 10,
          borderRadius: 10,
          border: "1px solid #E6EDF3",
          resize: "vertical",
          fontFamily: "inherit",
          fontSize: 14,
          outline: "none"
        }}
        rows={1}
      />

      <button
        type="submit"
        disabled={!text.trim()}
        style={{
          background: text.trim() ? "linear-gradient(90deg,#2F5CF0,#4D7CFF)" : "#E2E8F0",
          color: "#fff",
          padding: "10px 14px",
          borderRadius: 10,
          border: "none",
          cursor: text.trim() ? "pointer" : "not-allowed",
          fontSize: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        ➤
      </button>
    </form>
  );
}
