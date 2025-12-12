const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { supabase } = require('../db/index');

// POST /api/campaigns/create
router.post('/create', requireAuth, async (req, res) => {
  try {
    const user = req.user;
    const { conversation_id, draft, launch } = req.body;

    const { data, error } = await supabase
      .from('campaign_drafts')
      .insert({
        user_id: user.id,
        conversation_id,
        draft,
        status: launch ? "requested" : "draft"
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      campaign_draft_id: data.id,
      status: data.status
    });

  } catch (err) {
    console.error("CAMPAIGN CREATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
