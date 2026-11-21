export const getChipColor = (value) => {
  if (value?.startsWith("Low")) return "low";
  if (value?.startsWith("Medium")) return "medium";
  if (value?.startsWith("High")) return "high";

  return "neutral";
};
