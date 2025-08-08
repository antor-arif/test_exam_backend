export function getPagination(page = 1, limit = 10) {
  const p = Number(page) > 0 ? Number(page) : 1;
  const l = Number(limit) > 0 ? Number(limit) : 10;
  const skip = (p - 1) * l;
  return { page: p, limit: l, skip };
}
