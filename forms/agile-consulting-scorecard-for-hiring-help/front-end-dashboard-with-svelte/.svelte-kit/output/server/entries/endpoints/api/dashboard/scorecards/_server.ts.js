import { json } from "@sveltejs/kit";
import { s as scorecards } from "../../../../../chunks/data.js";
const GET = () => {
  const body = {
    items: scorecards,
    total: scorecards.length
  };
  return json(body);
};
export {
  GET
};
