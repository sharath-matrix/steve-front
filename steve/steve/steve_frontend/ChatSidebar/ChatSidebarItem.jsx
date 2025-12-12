import React from "react";
import { useSteveStore } from "../../../stores/steveStore";

export default function ChatSidebarItem({ item }) {
  const select = useSteveStore((s) => s.selectConversation);

  return (
    <div
      onClick={() => select(item.id)}
      style={{
        display: "flex",
        alignItems: "center",
        padding: "10px",
        borderRadius: 10,
        cursor: "pointer",
        marginBottom: 6,
        gap: 10,
        background: item.active ? "#EEF2FF" : "transparent",
        transition: "0.15s"
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#F5F7FF")}
      onMouseLeave={(e) => (e.currentTarget.style.background = item.active ? "#EEF2FF" : "transparent")}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: "#F8FAFC",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0
        }}
      >
        💬
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontWeight: 600,
            fontSize: 14,
            color: item.active ? "#2F5CF0" : "#0F172A",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}
        >
          {item.title || "Untitled Chat"}
        </div>
        <div style={{ fontSize: 12, color: "#94A3B8" }}>{item.timeLabel || "Just now"}</div>
      </div>
    </div>
  );
}
