import React from "react";
import { Bot } from "lucide-react";
import ChatSidebar from "./ChatSidebar/ChatSidebar";
import ChatWindow from "./ChatWindow/ChatWindow";

export default function SteveWorkspace() {
  return (
    <div style={{ display: "flex", height: "100%", background: "#F7F8FA", overflow: "hidden" }}>
      <ChatSidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: 20, borderBottom: "1px solid #EEF2F7", background: "#fff" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Bot size={24} color="#3B82F6" />
            <span style={{ fontSize: 18, fontWeight: 700 }}>Steve — Campaign Strategist</span>
          </div>
          <p style={{ color: "#64748B", marginTop: 4, margin: 0 }}>Plan and optimize your advertising campaigns.</p>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
          <ChatWindow />
        </div>
      </div>
    </div>
  );
}
