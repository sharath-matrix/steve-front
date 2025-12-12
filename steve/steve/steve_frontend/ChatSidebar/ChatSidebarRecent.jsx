import React from "react";
import { useSteveStore } from "../../../stores/steveStore";
import ChatSidebarItem from "./ChatSidebarItem";

export default function ChatSidebarRecent() {
  const recent = useSteveStore((s) => s.recent);

  return (
    <div>
      <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 6, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Recent</div>
      {recent && recent.length > 0 ? (
        recent.map((c) => (
          <ChatSidebarItem key={c.id} item={c} />
        ))
      ) : (
        <div style={{ fontSize: 13, color: "#94A3B8", padding: "10px", textAlign: "center" }}>
          No conversations yet
        </div>
      )}
    </div>
  );
}
