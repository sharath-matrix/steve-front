function ok(res, data={}) {
  return res.status(200).json(data);
}
function created(res, data={}) {
  return res.status(201).json(data);
}
function error(res, status=500, data={}) {
  return res.status(status).json(data);
}
module.exports = { ok, created, error };
