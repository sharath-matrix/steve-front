import React from "react";
import { useSteveStore } from "../../../stores/steveStore";

export default function CreateCampaignModal() {
  const { createModalOpen, createResult, closeCreateModal } = useSteveStore();

  if (!createModalOpen) return null;

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
      onClick={closeCreateModal}
    >
      <div
        style={{
          background: "#fff",
          width: "90%",
          maxWidth: 560,
          borderRadius: 12,
          padding: 24,
          boxShadow: "0 20px 60px rgba(15,23,42,0.2)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {createResult?.success ? (
          <>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: 999,
              background: "#DCFCE7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              marginBottom: 16
            }}>
              ✓
            </div>
            <h3 style={{ margin: "0 0 12px 0", fontSize: 20, fontWeight: 700, color: "#0F172A" }}>
              Campaign Created Successfully
            </h3>
            <p style={{ margin: "0 0 20px 0", color: "#64748B", fontSize: 14 }}>
              Your campaign request has been submitted to our team.
            </p>

            <div style={{
              background: "#F7F8FA",
              padding: 16,
              borderRadius: 10,
              marginBottom: 20
            }}>
              <div style={{ fontSize: 12, color: "#64748B", marginBottom: 6 }}>Campaign ID</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#2F5CF0", fontFamily: "monospace" }}>
                {createResult.campaignId}
              </div>
            </div>

            <div style={{
              padding: 16,
              background: "#EEF2FF",
              borderRadius: 10,
              marginBottom: 20,
              border: "1px solid #C7D2FE"
            }}>
              <div style={{ fontSize: 14, color: "#0F172A" }}>
                Our AdzBasket team will contact you shortly with campaign details and next steps.
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={closeCreateModal}
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
                Close
              </button>
            </div>
          </>
        ) : (
          <>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: 999,
              background: "#EEF2FF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              marginBottom: 16,
              animation: "pulse 1.5s ease-in-out infinite"
            }}>
              ⏳
            </div>
            <h3 style={{ margin: "0 0 12px 0", fontSize: 20, fontWeight: 700, color: "#0F172A" }}>
              Creating Campaign...
            </h3>
            <p style={{ margin: 0, color: "#64748B", fontSize: 14 }}>
              Please wait while we process your request.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
