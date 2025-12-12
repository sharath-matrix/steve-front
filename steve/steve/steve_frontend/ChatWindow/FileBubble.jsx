import React from "react";

export default function FileBubble({ msg }) {
  const fileUrl = msg.content?.file;
  if (!fileUrl) return null;

  return (
    <div style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", marginBottom: 12 }}>
      <div style={{
        maxWidth: "60%",
        background: msg.role === "user" ? "linear-gradient(90deg,#2F5CF0,#4D7CFF)" : "#FFFFFF",
        color: msg.role === "user" ? "#fff" : "#0F172A",
        padding: 10,
        borderRadius: 14,
        border: msg.role === "assistant" ? "1px solid #E5EAF1" : "none",
        boxShadow: "0px 2px 8px rgba(0,0,0,0.05)"
      }}>
        <div style={{ marginBottom: 6, fontWeight: 600 }}>
          {msg.role === "user" ? "File Uploaded" : "File Received"}
        </div>

        <img
          src={fileUrl}
          alt="Uploaded"
          style={{
            width: "100%",
            borderRadius: 12,
            marginBottom: 6,
            boxShadow: "0px 2px 8px rgba(0,0,0,0.08)"
          }}
        />

        <div style={{ fontSize: 11, opacity: 0.85, textAlign: "right" }}>
          {new Date(msg.created_at).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
