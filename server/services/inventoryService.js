const { supabase } = require('../db/index');

async function findMatches(snapshot, constraints = {}) {
  const preferredMedia = constraints.preferred_media || snapshot.preferred_media_types || [];
  const city = constraints.locality?.city || snapshot.target_city;
  const locality = constraints.locality?.locality || snapshot.target_locality;

  let query = supabase.from('inventory').select('*').limit(50);

  if (preferredMedia.length) query = query.in('type', preferredMedia);
  if (locality) query = query.ilike('location', `%${locality}%`);
  else if (city) query = query.ilike('location', `%${city}%`);

  const { data, error } = await query;
  if (error) {
    console.error("Inventory query failed:", error);
    return [];
  }

  return data.map(i => ({
    inventory_id: i.id,
    type: i.type,
    location: i.location,
    price_estimate: i.price || null,
    estimated_impressions: i.estimated_impressions || null
  }));
}

module.exports = { findMatches };
