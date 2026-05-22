const prerender = false;
const load = ({ params }) => {
  return { step: Number(params.step) };
};
export {
  load,
  prerender
};
