import React from "react";
import { formatTime } from "../../../utils/time";

export default function AIBubble({ msg }) {
  const content = msg.content?.text || "";
  const styleBubble = {
    maxWidth: "78%",
    background: "#FFFFFF",
    color: "#0F172A",
    padding: 14,
    borderRadius: 16,
    border: "1px solid #E5EAF1",
    boxShadow: "0 2px 8px rgba(15,23,42,0.03)",
    whiteSpace: "pre-wrap"
  };

  return (
    <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 12 }}>
      <div style={{ marginRight: 10 }}>
        <div style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          background: "#EEF2FF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          🤖
        </div>
      </div>
      <div style={styleBubble}>
        {content}
        <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 8 }}>
          {formatTime(msg.created_at)}
        </div>
      </div>
    </div>
  );
}
