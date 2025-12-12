import React, { useEffect, useState } from "react";
import { useSteveStore } from "../steveStore";
import { MoreHorizontal, Pin, Edit2, Trash2, ChevronLeft, PlusCircle, MessageSquare } from "lucide-react";

export default function SteveChatSidebar() {
  const { conversations, loadConversations, createConversation, selectConversation, pinConversation, unpinConversation, renameConversation, deleteConversation } = useSteveStore();
  const [collapsed, setCollapsed] = useState(false);
  const [query, setQuery] = useState("");
  const [menuOpenFor, setMenuOpenFor] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  useEffect(() => { loadConversations(); }, [loadConversations]);

  const filtered = conversations.filter(c => !query || (c.title || "").toLowerCase().includes(query.toLowerCase()));

  return (
    <div style={{
      width: collapsed ? 72 : 360,
      transition: "width 200ms",
      borderRight: "1px solid #E6EDF3",
      background: "#fff",
      display: "flex",
      flexDirection: "column",
      height: "100%"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: 12 }}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
            padding: 4,
            display: "flex",
            alignItems: "center"
          }}
        >
          <ChevronLeft size={18} style={{ transform: collapsed ? "rotate(180deg)" : "none", transition: "transform 200ms" }} />
        </button>
        {!collapsed && (
          <input
            placeholder="Search chats..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 10,
              border: "1px solid #E6EDF3",
              fontSize: 14
            }}
          />
        )}
      </div>

      <div style={{ padding: "0 12px 12px" }}>
        <button
          onClick={() => createConversation()}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 12,
            background: "linear-gradient(90deg,#3B82F6,#2563EB)",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8
          }}
        >
          {!collapsed && <><PlusCircle size={16} /> New Campaign</>}
          {collapsed && <PlusCircle size={20} />}
        </button>
      </div>

      <div style={{ padding: "0 12px", overflowY: "auto", flex: 1 }}>
        {!collapsed && <div style={{ color: "#94A3B8", marginBottom: 8, fontSize: 12, fontWeight: 600 }}>Pinned</div>}
        {filtered.filter(c => c.is_pinned).map(c => (
          <ChatItem
            key={c.id}
            c={c}
            collapsed={collapsed}
            onSelect={() => selectConversation(c.id)}
            onMenu={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setMenuPosition({
                top: rect.top + rect.height / 2,
                left: rect.right + 8
              });
              setMenuOpenFor(c.id);
            }}
          />
        ))}

        {!collapsed && filtered.filter(c => c.is_pinned).length === 0 && (
          <div style={{ fontSize: 13, color: "#94A3B8", padding: "8px 0", marginBottom: 12 }}>No pinned chats</div>
        )}

        {!collapsed && <div style={{ marginTop: 12, color: "#94A3B8", fontSize: 12, fontWeight: 600 }}>Recent</div>}
        {filtered.filter(c => !c.is_pinned).map(c => (
          <ChatItem
            key={c.id}
            c={c}
            collapsed={collapsed}
            onSelect={() => selectConversation(c.id)}
            onMenu={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setMenuPosition({
                top: rect.top + rect.height / 2,
                left: rect.right + 8
              });
              setMenuOpenFor(c.id);
            }}
          />
        ))}
      </div>

      {menuOpenFor && (() => {
        const conv = conversations.find(x => x.id === menuOpenFor);
        if (!conv) return null;
        return (
          <>
            <div
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 50
              }}
              onClick={() => setMenuOpenFor(null)}
            />
            <div style={{
              position: "fixed",
              left: menuPosition.left,
              top: menuPosition.top,
              transform: "translateY(-50%)",
              background: "#fff",
              borderRadius: 8,
              boxShadow: "0 8px 30px rgba(15,23,42,0.15)",
              padding: 8,
              zIndex: 60,
              minWidth: 180
            }}>
              <div style={{ display: "flex", gap: 4, flexDirection: "column" }}>
                <button
                  onClick={() => {
                    conv.is_pinned ? unpinConversation(conv.id) : pinConversation(conv.id);
                    setMenuOpenFor(null);
                  }}
                  style={{
                    padding: "10px 12px",
                    background: "transparent",
                    border: "none",
                    textAlign: "left",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    borderRadius: 6,
                    fontSize: 14
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#F1F5F9"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <Pin size={16} /> {conv.is_pinned ? "Unpin" : "Pin"}
                </button>
                <button
                  onClick={() => {
                    const newTitle = prompt("Rename chat", conv.title || "Untitled Chat");
                    if (newTitle) renameConversation(conv.id, newTitle);
                    setMenuOpenFor(null);
                  }}
                  style={{
                    padding: "10px 12px",
                    background: "transparent",
                    border: "none",
                    textAlign: "left",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    borderRadius: 6,
                    fontSize: 14
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#F1F5F9"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <Edit2 size={16} /> Rename
                </button>
                <button
                  onClick={() => {
                    if (confirm("Delete this chat? This cannot be undone.")) {
                      deleteConversation(conv.id);
                    }
                    setMenuOpenFor(null);
                  }}
                  style={{
                    padding: "10px 12px",
                    background: "transparent",
                    border: "none",
                    color: "#ef4444",
                    textAlign: "left",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    borderRadius: 6,
                    fontSize: 14
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#FEE2E2"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          </>
        );
      })()}
    </div>
  );
}

function ChatItem({ c, collapsed, onSelect, onMenu }) {
  return (
    <div
      onClick={onSelect}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: collapsed ? "10px 8px" : "12px",
        borderRadius: 10,
        cursor: "pointer",
        marginBottom: 8,
        background: c.active ? "#EEF2FF" : "#fff",
        border: c.active ? "1px solid #DBEAFE" : "1px solid transparent"
      }}
      onMouseEnter={(e) => {
        if (!c.active) e.currentTarget.style.background = "#F9FAFB";
      }}
      onMouseLeave={(e) => {
        if (!c.active) e.currentTarget.style.background = "#fff";
      }}
    >
      <div style={{ display: "flex", gap: 10, alignItems: "center", flex: 1, minWidth: 0 }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 8,
          background: c.active ? "#DBEAFE" : "#F1F5F9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0
        }}>
          <MessageSquare size={20} color={c.active ? "#2563EB" : "#475569"} />
        </div>
        {!collapsed && (
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontWeight: 600,
              fontSize: 14,
              color: c.active ? "#2563EB" : "#0F172A",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }}>
              {c.title || "Untitled Campaign"}
            </div>
            <div style={{ fontSize: 12, color: "#94A3B8" }}>
              {new Date(c.created_at).toLocaleDateString()}
            </div>
          </div>
        )}
      </div>

      {!collapsed && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMenu(e);
          }}
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
            padding: 4,
            display: "flex",
            alignItems: "center",
            color: "#64748B"
          }}
        >
          <MoreHorizontal size={18} />
        </button>
      )}
    </div>
  );
}
