import { error, json } from "@sveltejs/kit";
import { s as scorecards } from "../../../../../chunks/data.js";
const GET = ({ params }) => {
  const row = scorecards.find((r) => r.id === params.id);
  if (!row) throw error(404, `No scorecard found with id ${params.id}`);
  return json(row);
};
export {
  GET
};
