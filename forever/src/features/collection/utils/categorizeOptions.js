import { capitalize } from "./capitalize";

export const getCategoryOptions = (categories) => {
    if (!Array.isArray(categories)) return [];

    return categories
        .filter((c) => c?.isActive)
        .map((c) => ({
            label: capitalize(c?.name),
            value: c?.slug,
        }))
        .filter((opt) => Boolean(opt.value));
};

