/**
 * Mock identity data: the signed-in agronomist and her organization.
 */

export const MOCK_USER = {
  id: "usr-sally",
  email: "sally@crop.app",
  fullName: "Sally Hassan",
  role: "Agronomist",
  organizationId: "org-beheira",
  preferredLanguage: "en",
};

export const MOCK_ORGANIZATION = {
  id: "org-beheira",
  name: { en: "El-Beheira Agricultural Estate", ar: "عزبة البحيرة الزراعية" },
  tier: "standard",
  memberCount: 4,
  farmCount: 1,
  fieldCount: 4,
};
