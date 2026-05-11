import { useCallback, useMemo, useState } from "react";

import { filterProducts } from "../utils/filterProducts";
import { sortProducts } from "../utils/sortProducts";

export const useCollectionFilters = (products, categories) => {
    const [selectedCategories, setSelectedCategories] = useState(() => new Set());
    const [selectedTypes, setSelectedTypes] = useState(() => new Set());
    const [sortBy, setSortBy] = useState("relevant");


    const toggleInSet = useCallback((setter, value) => {
        setter((prev) => {
            const next = new Set(prev);
            if (next.has(value)) next.delete(value);
            else next.add(value);
            return next;
        });
    }, []);


    const toggleCategory = useCallback(
        (value) => toggleInSet(setSelectedCategories, value),
        []
    );

    const toggleType = useCallback(
        (value) => toggleInSet(setSelectedTypes, value),
        []
    );


    const clearFilters = useCallback(() => {
        setSelectedCategories(new Set());
        setSelectedTypes(new Set());
    }, []);


    const categoryOptions = useMemo(() => {
        // derived from backend
        if (!Array.isArray(categories)) return [];

        return categories
            .filter((c) => c?.isActive)
            .map((c) => ({
                label: typeof c?.name === "string" && c.name
                    ? c.name.charAt(0).toUpperCase() + c.name.slice(1)
                    : "",
                value: c?.slug,
            }))
            .filter((opt) => Boolean(opt.value));
    }, [categories]);

    const typeOptions = useMemo(() => {
        if (!Array.isArray(categories)) return [];

        const subCategoryMap = new Map();

        for (const category of categories) {
            if (!category?.isActive) continue;

            const subCategories = Array.isArray(category.subCategories)
                ? category.subCategories
                : [];

            for (const subCategory of subCategories) {
                if (!subCategory?.isActive) continue;

                const slug = subCategory?.slug;
                if (!slug) continue;

                if (!subCategoryMap.has(slug)) {
                    subCategoryMap.set(slug, {
                        label:
                            typeof subCategory?.name === "string" && subCategory.name
                                ? subCategory.name.charAt(0).toUpperCase() + subCategory.name.slice(1)
                                : "",
                        value: slug,
                    });
                }
            }
        }

        return [...subCategoryMap.values()];
    }, [categories]);


    const filteredProducts = useMemo(() => {
        const list = Array.isArray(products) ? products : [];
        return filterProducts(list, selectedCategories, selectedTypes);
    }, [products, selectedCategories, selectedTypes]);

    const displayedProducts = useMemo(() => {
        return sortProducts(filteredProducts, sortBy);
    }, [filteredProducts, sortBy]);

    return {
        selectedCategories,
        selectedTypes,
        sortBy,
        toggleCategory,
        toggleType,
        setSortBy,
        clearFilters,
        categoryOptions,
        typeOptions,
        filteredProducts,
        displayedProducts,
    };
};

