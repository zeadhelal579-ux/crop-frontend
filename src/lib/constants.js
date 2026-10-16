/**
 * Small shared constants (enumerations the UI needs in more than one place).
 */

/** The six crops covered by the training dataset and the field form. */
export const CROP_TYPES = ["tomato", "pepper", "cucumber", "citrus", "peach", "fig"];

/** Roles whose users see the "New Field" action (the backend enforces the real rule). */
export const FIELD_MANAGER_ROLES = ["OrgAdmin", "Farmer", "Agronomist", "PlatformAdmin"];
