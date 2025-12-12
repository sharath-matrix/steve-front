import React from "react";
import { useSteveStore } from "../../../stores/steveStore";
import ChatSidebarItem from "./ChatSidebarItem";

export default function ChatSidebarPinned() {
  const pinned = useSteveStore((s) => s.pinned);

  if (!pinned || pinned.length === 0) return null;

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 6, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Pinned</div>
      {pinned.map((c) => (
        <ChatSidebarItem key={c.id} item={c} />
      ))}
    </div>
  );
}
