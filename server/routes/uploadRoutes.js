const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const { requireAuth } = require('../middleware/auth');
const { uploadBuffer } = require('../services/storageService');
const { supabase } = require('../db/index');

router.post('/', requireAuth, upload.single("file"), async (req, res) => {
  try {
    const user = req.user;
    if (!req.file) return res.status(400).json({ error: "no_file" });

    const { buffer, originalname, mimetype } = req.file;
    const { filename, publicURL } = await uploadBuffer(
      user.id,
      buffer,
      originalname,
      mimetype
    );

    // Save in file_uploads table if exists:
    try {
      await supabase.from('file_uploads').insert({
        user_id: user.id,
        filename,
        url: publicURL,
        metadata: { originalname, mimetype }
      });
    } catch (err) {
      console.warn("file_uploads table missing or failed.");
    }

    res.status(201).json({ filename, url: publicURL });

  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
