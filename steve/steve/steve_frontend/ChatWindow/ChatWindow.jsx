import React, { useEffect, useRef } from "react";
import { useSteveStore } from "../steveStore";
import UserBubble from "./UserBubble";
import AIBubble from "./AIBubble";
import FileBubble from "./FileBubble";
import ChatInputBar from "./ChatInputBar";
import SummaryCard from "../SummaryCard/SummaryCard";
import CreateCampaignModal from "../Modals/CreateCampaignModal";
import EditOverviewModal from "../Modals/EditOverviewModal";

export default function ChatWindow() {
  const { activeConversation, loadMessages, messages } = useSteveStore();
  const scrollRef = useRef();

  useEffect(() => {
    if (activeConversation) loadMessages(activeConversation.id);
  }, [activeConversation, loadMessages]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  if (!activeConversation) {
    return (
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#F7F8FA"
      }}>
        <div style={{ textAlign: "center", maxWidth: 360 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🤖</div>
          <h3 style={{ margin: "0 0 8px 0", fontSize: 20, fontWeight: 700, color: "#0F172A" }}>
            Start a Campaign Chat
          </h3>
          <p style={{ margin: 0, color: "#64748B", fontSize: 14, lineHeight: 1.6 }}>
            Click "New Chat" in the sidebar to begin creating a marketing campaign with Steve AI.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      height: "100%",
      minHeight: 0,
      overflow: "hidden"
    }}>
      <div ref={scrollRef} style={{
        flex: 1,
        padding: 20,
        overflowY: "auto",
        overflowX: "hidden",
        background: "#F7F8FA",
        WebkitOverflowScrolling: "touch",
        scrollbarWidth: "thin",
        scrollbarColor: "#CBD5E1 #F1F5F9"
      }}
      className="custom-scrollbar"
      >
        {!Array.isArray(messages) || messages.length === 0 ? (
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            color: "#94A3B8",
            flexDirection: "column",
            gap: 12
          }}>
            <div style={{ fontSize: 48 }}>🤖</div>
            <div style={{ fontSize: 15 }}>Start chatting to see messages here.</div>
          </div>
        ) : (
          messages.map((m) => {
            if (m.role === "assistant" && m.content?.type === "summary") {
              return <SummaryCard key={m.id} snapshot={m.content.snapshot} messageId={m.id} />;
            }
            if (m.content?.file) {
              return <FileBubble key={m.id} msg={m} />;
            }
            return m.role === "user" ? <UserBubble key={m.id} msg={m} /> : <AIBubble key={m.id} msg={m} />;
          })
        )}
      </div>

      <div style={{ borderTop: "1px solid #EEF2F7", padding: 12, background: "#fff" }}>
        <ChatInputBar />
      </div>

      <EditOverviewModal />
      <CreateCampaignModal />
    </div>
  );
}
