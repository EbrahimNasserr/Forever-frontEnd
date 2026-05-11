import { capitalize } from "./capitalize";

export const extractSubCategories = (categories) => {
    if (!Array.isArray(categories)) return [];

    const subCategoryMap = new Map();

    for (const category of categories) {
        if (!category?.isActive) continue;

        const subCategories = Array.isArray(category.subCategories)
            ? category.subCategories
            : [];

        for (const subCategory of subCategories) {
            if (!subCategory?.isActive) continue;

            const slug = subCategory.slug;
            if (!slug) continue;

            if (!subCategoryMap.has(slug)) {
                subCategoryMap.set(slug, {
                    label: capitalize(subCategory.name),
                    value: slug,
                });
            }
        }
    }

    return [...subCategoryMap.values()];
};

