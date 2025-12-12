/**
 * Placeholder LLM service for Steve AI.
 * Later this will call ChatGPT API using your meta prompt.
 */

async function generateReplyPlaceholder(messages, user) {
  const lastUserMsg = messages.filter(m => m.role === 'user').slice(-1)[0]?.content || "";

  const reply =
    `Thanks! You said: "${lastUserMsg}". Let's continue. Can you tell me ` +
    `your preferred target location (city or area)?`;

  return {
    reply,
    snapshot: null
  };
}

async function extractSnapshotPlaceholder(messages) {
  const lastUserMsg = messages.filter(m => m.role === 'user').slice(-1)[0]?.content || "";

  return {
    campaign_objective: lastUserMsg,
    business_type: null,
    target_city: null,
    target_audience: null,
    budget: null,
    preferred_media_types: null,
    key_strategy_points: []
  };
}

module.exports = {
  generateReplyPlaceholder,
  extractSnapshotPlaceholder
};
