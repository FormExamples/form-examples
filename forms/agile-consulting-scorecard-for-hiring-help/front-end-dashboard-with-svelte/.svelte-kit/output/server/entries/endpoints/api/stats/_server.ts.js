import { json } from "@sveltejs/kit";
import { s as scorecards } from "../../../../chunks/data.js";
const GET = () => {
  const byBand = { low: 0, borderline: 0, medium: 0, high: 0 };
  const bySector = {};
  const bySize = {};
  const flagCountByCategory = {};
  let flagCount = 0;
  let sumScore = 0;
  for (const r of scorecards) {
    byBand[r.computedBand] += 1;
    bySector[r.sector] = (bySector[r.sector] ?? 0) + 1;
    bySize[r.sizeBand] = (bySize[r.sizeBand] ?? 0) + 1;
    sumScore += r.scoreTotal;
    for (const f of r.flags) {
      flagCount += 1;
      flagCountByCategory[f.category] = (flagCountByCategory[f.category] ?? 0) + 1;
    }
  }
  const total = scorecards.length;
  return json({
    total,
    byBand,
    bySector: Object.fromEntries(Object.entries(bySector).sort(([a], [b]) => a.localeCompare(b))),
    bySize: Object.fromEntries(Object.entries(bySize).sort(([a], [b]) => a.localeCompare(b))),
    flagCount,
    flagCountByCategory: Object.fromEntries(
      Object.entries(flagCountByCategory).sort(([a], [b]) => a.localeCompare(b))
    ),
    averageScore: total === 0 ? 0 : sumScore / total
  });
};
export {
  GET
};
