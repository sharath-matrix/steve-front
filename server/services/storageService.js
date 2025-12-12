const { supabase } = require('../db/index');
const BUCKET = "creative-assets";

async function uploadBuffer(userId, buffer, originalName, mimeType) {
  const filename = `${userId}/${Date.now()}_${originalName}`;

  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(filename, buffer, {
    contentType: mimeType,
    upsert: true
  });
  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filename);

  return {
    filename,
    publicURL: data.publicUrl
  };
}

module.exports = { uploadBuffer, BUCKET };
