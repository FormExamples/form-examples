const match = (param) => {
  const n = Number(param);
  return Number.isInteger(n) && n >= 1 && n <= 15;
};
export {
  match
};
