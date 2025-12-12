import { create } from "zustand";
import { supabase } from "./services/supabaseClient";

// NOTE: Ensure Supabase has public bucket named "creative-assets"
// or update uploadFile() path in store.

export const useSteveStore = create((set, get) => ({
  conversations: [],
  pinned: [],
  recent: [],
  activeConversation: null,
  messages: [],
  loading: false,

  editModalOpen: false,
  editSnapshot: null,
  createModalOpen: false,
  createResult: null,

  loadConversations: async () => {
    try {
      const user = (await supabase.auth.getUser()).data?.user;
      if (!user) return;
      const { data } = await supabase
        .from("conversations")
        .select("*")
        .eq("user_id", user.id)
        .eq("assistant_type", "steve")
        .order("created_at", { ascending: false });

      if (!data || data.length === 0) {
        const { data: created } = await supabase
          .from("conversations")
          .insert([{ user_id: user.id, title: "New Campaign Chat", assistant_type: "steve" }])
          .select()
          .single();

        const newConv = { ...created, timeLabel: "Just now", active: true };
        set({
          conversations: [newConv],
          activeConversation: newConv,
          pinned: [],
          recent: [newConv],
          messages: []
        });
        return;
      }

      const enhance = (items) =>
        items.map((c) => ({
          ...c,
          timeLabel: formatTimeLabel(c.created_at)
        }));

      set({
        conversations: enhance(data),
        pinned: enhance(data.filter((c) => c.is_pinned)),
        recent: enhance(data.filter((c) => !c.is_pinned))
      });
    } catch (err) {
      console.error("SteveStore loadConversations Error:", err);
    }
  },

  createConversation: async () => {
    try {
      const user = (await supabase.auth.getUser()).data?.user;
      if (!user) return;
      const title = "New Campaign Chat";
      const { data } = await supabase
        .from("conversations")
        .insert([{ user_id: user.id, title, assistant_type: "steve" }])
        .select()
        .single();

      const newConv = { ...data, timeLabel: "Just now", active: true };
      const updatedConvs = [newConv, ...get().conversations.map(c => ({ ...c, active: false }))];

      set({
        conversations: updatedConvs,
        activeConversation: newConv,
        messages: [],
        recent: [newConv, ...get().recent]
      });
    } catch (err) {
      console.error("SteveStore createConversation Error:", err);
    }
  },

  selectConversation: (id) => {
    const conv = get().conversations.find((c) => c.id === id);
    if (!conv) return;

    const updatedList = get().conversations.map((c) => ({
      ...c,
      active: c.id === id
    }));

    set({
      activeConversation: { ...conv, active: true },
      conversations: updatedList,
      pinned: updatedList.filter((c) => c.is_pinned),
      recent: updatedList.filter((c) => !c.is_pinned)
    });
  },

  loadMessages: async (conversationId) => {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });
    set({ messages: data || [] });
  },

  sendMessage: async ({ text }) => {
    const user = (await supabase.auth.getUser()).data?.user;
    if (!user || !get().activeConversation) return;
    const convId = get().activeConversation.id;

    const userMsg = {
      conversation_id: convId,
      user_id: user.id,
      role: "user",
      content: { text },
      created_at: new Date().toISOString()
    };
    const { data: insertedUserMsg } = await supabase
      .from("messages")
      .insert([userMsg])
      .select()
      .single();

    if (insertedUserMsg) {
      set((s) => ({ messages: [...s.messages, insertedUserMsg] }));
    }

    setTimeout(async () => {
      const assistantText = generateSteveReply(text);
      const assistantMsg = {
        conversation_id: convId,
        user_id: user.id,
        role: "assistant",
        content: { text: assistantText },
        created_at: new Date().toISOString()
      };
      const { data: insertedAiMsg } = await supabase
        .from("messages")
        .insert([assistantMsg])
        .select()
        .single();

      if (insertedAiMsg) {
        set((s) => ({ messages: [...s.messages, insertedAiMsg] }));
      }

      if (/create campaign|plan campaign|campaign overview|launch campaign/i.test(text)) {
        const snapshot = generateCampaignSnapshotFromMessages(
          get().messages.concat([insertedAiMsg || assistantMsg])
        );
        const summaryMsg = {
          conversation_id: convId,
          user_id: user.id,
          role: "assistant",
          content: { type: "summary", snapshot },
          created_at: new Date().toISOString()
        };
        const { data: insertedSummary } = await supabase
          .from("messages")
          .insert([summaryMsg])
          .select()
          .single();

        await supabase.from("campaign_overview_snapshots").insert([{
          snapshot,
          created_at: new Date().toISOString()
        }]);

        if (insertedSummary) {
          set((s) => ({ messages: [...s.messages, insertedSummary] }));
        }
      }
    }, 800);
  },

  uploadFile: async (files) => {
    const user = (await supabase.auth.getUser()).data?.user;
    if (!user || !get().activeConversation) return;
    const convId = get().activeConversation.id;

    for (let f of Array.from(files)) {
      const fileName = `${user.id}/${Date.now()}_${f.name}`;
      const { data, error } = await supabase.storage
        .from("creative-assets")
        .upload(fileName, f);

      if (!error && data) {
        const publicUrl = supabase.storage
          .from("creative-assets")
          .getPublicUrl(data.path).data.publicUrl;

        const fileMsg = {
          conversation_id: convId,
          user_id: user.id,
          role: "user",
          content: { text: `Uploaded file: ${f.name}`, file: publicUrl },
          created_at: new Date().toISOString()
        };
        const { data: insertedMsg } = await supabase
          .from("messages")
          .insert([fileMsg])
          .select()
          .single();

        if (insertedMsg) {
          set((s) => ({ messages: [...s.messages, insertedMsg] }));
        }
      }
    }
  },

  openEditModal: (snapshot) => set({ editModalOpen: true, editSnapshot: snapshot }),
  closeEditModal: () => set({ editModalOpen: false, editSnapshot: null }),

  saveEditedSnapshot: async (snap) => {
    await supabase.from("campaign_overview_snapshots").insert([{ snapshot: snap }]);

    const convId = get().activeConversation?.id;
    if (convId) {
      const user = (await supabase.auth.getUser()).data?.user;
      if (user) {
        const msg = {
          conversation_id: convId,
          user_id: user.id,
          role: "assistant",
          content: { type: "summary", snapshot: snap },
          created_at: new Date().toISOString()
        };
        const { data: insertedMsg } = await supabase
          .from("messages")
          .insert([msg])
          .select()
          .single();

        if (insertedMsg) {
          set((s) => ({ messages: [...s.messages, insertedMsg] }));
        }
      }
    }
  },

  saveDraft: async (snapshot) => {
    const user = (await supabase.auth.getUser()).data?.user;
    if (!user) return;
    const { data } = await supabase.from("campaign_drafts").insert([{
      user_id: user.id,
      title: snapshot.title || "Campaign Draft",
      payload: snapshot,
      status: "draft"
    }]).select().single();
    return data;
  },

  createCampaign: async (snapshot) => {
    const user = (await supabase.auth.getUser()).data?.user;
    if (!user) return;

    const { data } = await supabase.from("campaign_drafts").insert([{
      user_id: user.id,
      title: snapshot.title || "Campaign Request",
      payload: snapshot,
      status: "REQUESTED",
      created_at: new Date().toISOString()
    }]).select().single();

    const campaignId = generateCampaignId();

    set({ createModalOpen: true, createResult: { success: true, campaignId } });

    if (data) {
      await supabase.from("campaign_overview_snapshots").insert([{
        campaign_id: data.id,
        snapshot
      }]);
    }

    return { success: true, campaignId, dbId: data?.id };
  },

  closeCreateModal: () => set({ createModalOpen: false, createResult: null }),

  pinConversation: async (id) => {
    try {
      await supabase.from("conversations").update({ is_pinned: true }).eq("id", id);
      get().loadConversations();
    } catch (err) {
      console.error("SteveStore pinConversation Error:", err);
    }
  },

  unpinConversation: async (id) => {
    try {
      await supabase.from("conversations").update({ is_pinned: false }).eq("id", id);
      get().loadConversations();
    } catch (err) {
      console.error("SteveStore unpinConversation Error:", err);
    }
  },

  renameConversation: async (id, title) => {
    try {
      await supabase.from("conversations").update({ title }).eq("id", id);
      get().loadConversations();
    } catch (err) {
      console.error("SteveStore renameConversation Error:", err);
    }
  },

  deleteConversation: async (id) => {
    try {
      await supabase.from("messages").delete().eq("conversation_id", id);
      await supabase.from("conversations").delete().eq("id", id);
      get().loadConversations();
      if (get().activeConversation?.id === id) {
        set({ activeConversation: null, messages: [] });
      }
    } catch (err) {
      console.error("SteveStore deleteConversation Error:", err);
    }
  }
}));

function formatTimeLabel(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

function generateSteveReply(text) {
  if (/brand awareness|awareness/i.test(text)) {
    return "Got it — you want a Brand Awareness campaign. What is your preferred location (city/locality) and budget?";
  }
  if (/launch campaign|create campaign|plan campaign/i.test(text)) {
    return "I'll prepare a campaign overview based on the information provided. Please confirm the objective, budget and location.";
  }
  if (/budget/i.test(text)) {
    return "Noted the budget. I recommend allocating across In-App and Transit channels for maximum reach. Would you like me to create a draft?";
  }
  return "Thanks — can you share more details about target audience, budget and locations? I will create a campaign overview.";
}

function generateCampaignSnapshotFromMessages(messages) {
  const joined = messages.map((m) => m.content?.text || "").join(" ");
  const objective = (joined.match(/brand awareness|product launch|increase footfall|awareness/i) || ["Brand Awareness"])[0];
  const budgetMatch = joined.match(/\b(?:₹|rs|rs.|rs)\s?[\d,]+|\d+\s?(?:k|K|L|l|lakhs|lakhs)/i);
  const budget = budgetMatch ? budgetMatch[0] : "₹50,000";
  const locationMatch = joined.match(/(Bangalore|Mumbai|Delhi|Hyderabad|Chennai|Kolkata)/i);
  const location = locationMatch ? locationMatch[0] : "Unknown City";
  const audience = (joined.match(/(students|professionals|families|working professionals)/i) || ["General Audience"])[0];

  return {
    title: `${objective} — ${location}`,
    summary: `A focused ${objective} campaign in ${location} with a budget of ${budget}.`,
    objective,
    budget,
    location,
    audience,
    allocation: [
      { channel: "In-App", amount: "40%" },
      { channel: "Transit/OOH", amount: "40%" },
      { channel: "Print/Local", amount: "20%" }
    ],
    metrics: { impressions: "100k - 200k" }
  };
}

function generateCampaignId() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `CAM-${y}${m}-${rand}`;
}
