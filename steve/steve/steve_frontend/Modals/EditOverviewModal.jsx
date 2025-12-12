import React, { useState, useEffect } from "react";
import { useSteveStore } from "../../../stores/steveStore";

export default function EditOverviewModal() {
  const { editModalOpen, closeEditModal, editSnapshot, saveEditedSnapshot } = useSteveStore();
  const [form, setForm] = useState(editSnapshot || {});

  useEffect(() => {
    setForm(editSnapshot || {});
  }, [editSnapshot]);

  if (!editModalOpen) return null;

  const save = () => {
    saveEditedSnapshot(form);
    closeEditModal();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(15,23,42,0.5)",
        zIndex: 1000
      }}
      onClick={closeEditModal}
    >
      <div
        style={{
          background: "#fff",
          width: "90%",
          maxWidth: 760,
          borderRadius: 12,
          padding: 24,
          boxShadow: "0 20px 60px rgba(15,23,42,0.2)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ margin: "0 0 20px 0", fontSize: 20, fontWeight: 700, color: "#0F172A" }}>
          Edit Campaign Overview
        </h3>

        <div style={{ display: "grid", gap: 12 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 4 }}>
              Title
            </label>
            <input
              placeholder="Campaign Title"
              value={form.title || ""}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 8,
                border: "1px solid #E6EDF3",
                fontSize: 14
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 4 }}>
              Summary
            </label>
            <textarea
              placeholder="Campaign Summary"
              value={form.summary || ""}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 8,
                border: "1px solid #E6EDF3",
                fontSize: 14,
                minHeight: 80,
                fontFamily: "inherit",
                resize: "vertical"
              }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 4 }}>
                Objective
              </label>
              <input
                placeholder="Objective"
                value={form.objective || ""}
                onChange={(e) => setForm({ ...form, objective: e.target.value })}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: "1px solid #E6EDF3",
                  fontSize: 14
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 4 }}>
                Location
              </label>
              <input
                placeholder="Location"
                value={form.location || ""}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: "1px solid #E6EDF3",
                  fontSize: 14
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 4 }}>
                Budget
              </label>
              <input
                placeholder="Budget"
                value={form.budget || ""}
                onChange={(e) => setForm({ ...form, budget: e.target.value })}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: "1px solid #E6EDF3",
                  fontSize: 14
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 4 }}>
                Audience
              </label>
              <input
                placeholder="Audience"
                value={form.audience || ""}
                onChange={(e) => setForm({ ...form, audience: e.target.value })}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: "1px solid #E6EDF3",
                  fontSize: 14
                }}
              />
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
          <button
            onClick={closeEditModal}
            style={{
              padding: "10px 16px",
              borderRadius: 8,
              border: "1px solid #E6EDF3",
              background: "#fff",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 500
            }}
          >
            Cancel
          </button>
          <button
            onClick={save}
            style={{
              padding: "10px 16px",
              borderRadius: 8,
              background: "linear-gradient(90deg,#2F5CF0,#4D7CFF)",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 600
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
