export const filterProducts = (products, selectedCategories, selectedTypes) => {
    if (!Array.isArray(products) || products.length === 0) return [];

    return products.filter((p) => {
        const matchCategory =
            selectedCategories.size === 0 || selectedCategories.has(p?.category);

        const matchType =
            selectedTypes.size === 0 || selectedTypes.has(p?.subCategory);

        return matchCategory && matchType;
    });
};

