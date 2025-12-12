import React from "react";
import { formatTime } from "../utils/time";

export default function UserBubble({ msg }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
      <div style={{
        maxWidth: "68%",
        background: "linear-gradient(90deg,#2F5CF0,#4D7CFF)",
        color: "#fff",
        padding: 12,
        borderRadius: 16,
        boxShadow: "0 4px 12px rgba(47,92,240,0.12)",
        whiteSpace: "pre-wrap"
      }}>
        {msg.content?.text || JSON.stringify(msg.content)}
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.85)", marginTop: 6, textAlign: "right" }}>
          {formatTime(msg.created_at)}
        </div>
      </div>
    </div>
  );
}
