const { supabase } = require('../db/index');

async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.replace("Bearer ", "");

    if (!token) return res.status(401).json({ error: 'missing_token' });

    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) {
      return res.status(401).json({ error: 'invalid_token' });
    }

    req.user = data.user;
    next();
  } catch (err) {
    console.error("Auth error:", err);
    res.status(500).json({ error: 'auth_failure' });
  }
}

module.exports = { requireAuth };
