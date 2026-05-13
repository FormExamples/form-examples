function bandToRecommendation(band) {
  switch (band) {
    case "low":
      return "do-not-hire-yet";
    case "borderline":
      return "do-homework-first";
    case "medium":
      return "do-homework-first";
    case "high":
      return "trial-engagement";
  }
}
const RECOMMENDATION_COPY = {
  low: "Don't hire agile help yet — focus on internal operations first.",
  borderline: "Borderline — do your agile homework first; revisit in ~3 months.",
  medium: "Do your agile homework first; revisit the scorecard in ~3 months.",
  high: "Likely ready — trial an engagement and review in ~3 months."
};
export {
  RECOMMENDATION_COPY as R,
  bandToRecommendation as b
};
