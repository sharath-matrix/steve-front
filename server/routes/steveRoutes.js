const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { supabase } = require('../db/index');
const llm = require('../services/llmService');
const { findMatches } = require('../services/inventoryService');


// POST /api/steve/chat
router.post('/chat', requireAuth, async (req, res) => {
  try {
    const user = req.user;
    const { conversation_id, message, metadata } = req.body;

    let convId = conversation_id;

    // Create conversation if not exist
    if (!convId) {
      const { data, error } = await supabase
        .from('conversations')
        .insert({ user_id: user.id, channel: 'steve', metadata })
        .select()
        .single();

      if (error) throw error;
      convId = data.id;
    }

    // Insert user message
    await supabase.from('messages').insert({
      conversation_id: convId,
      user_id: user.id,
      role: 'user',
      content: message
    });

    // Fetch recent messages
    const { data: recent } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', convId)
      .order('created_at', { ascending: true })
      .limit(50);

    // Generate assistant reply
    const llmRes = await llm.generateReplyPlaceholder(recent, user);

    const { data: assistantRow, error: insertErr } = await supabase
      .from('messages')
      .insert({
        conversation_id: convId,
        role: 'assistant',
        content: llmRes.reply,
        content_json: llmRes.snapshot ? { snapshot: llmRes.snapshot } : null
      })
      .select()
      .single();

    if (insertErr) throw insertErr;

    res.status(201).json({
      conversation_id: convId,
      assistant_message_id: assistantRow.id,
      assistant_reply: llmRes.reply
    });

  } catch (err) {
    console.error("STEVE CHAT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


// POST /api/steve/extract
router.post('/extract', requireAuth, async (req, res) => {
  try {
    const user = req.user;
    const { conversation_id } = req.body;

    const { data: recent } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversation_id)
      .order('created_at', { ascending: true });

    const snapshot = await llm.extractSnapshotPlaceholder(recent);

    const { data, error } = await supabase
      .from('campaign_overview_snapshots')
      .insert({
        conversation_id,
        user_id: user.id,
        snapshot
      })
      .select()
      .single();

    if (error) throw error;

    res.json({ snapshot_id: data.id, snapshot: data.snapshot });

  } catch (err) {
    console.error("SNAPSHOT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


// POST /api/steve/recommend
router.post('/recommend', requireAuth, async (req, res) => {
  try {
    const { snapshot_id, constraints } = req.body;

    const { data: snap } = await supabase
      .from('campaign_overview_snapshots')
      .select('*')
      .eq('id', snapshot_id)
      .single();

    const rec = await findMatches(snap.snapshot, constraints);
    res.json({ recommendations: rec });

  } catch (err) {
    console.error("RECOMMEND ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
