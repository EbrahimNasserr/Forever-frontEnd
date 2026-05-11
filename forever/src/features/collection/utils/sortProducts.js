export const sortProducts = (products, sortBy) => {
    if (!Array.isArray(products) || products.length === 0) return [];

    if (sortBy === "relevant") return products;

    const next = [...products];
    next.sort((a, b) => {
        const pa = a?.price ?? 0;
        const pb = b?.price ?? 0;

        if (sortBy === "price-asc") return pa - pb;
        if (sortBy === "price-desc") return pb - pa;
        return 0;
    });

    return next;
};

