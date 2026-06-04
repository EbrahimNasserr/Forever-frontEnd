import { useCallback, useEffect, useMemo, useState } from "react";
import { useGetProductReviewsQuery } from "./reviewsApi";

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_SORT = "newest";

export const useReviewFilters = (productId) => {
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState(DEFAULT_SORT);
    const [rating, setRating] = useState(null);

    useEffect(() => {
        setPage(1);
    }, [productId, sort, rating]);

    const queryArg = useMemo(
        () => ({
            productId,
            page,
            limit: DEFAULT_PAGE_SIZE,
            sort,
            rating,
        }),
        [productId, page, sort, rating],
    );

    const query = useGetProductReviewsQuery(queryArg, {
        skip: !productId,
    });

    const handleSetRating = useCallback((value) => {
        setPage(1);
        setRating(value);
    }, []);

    const handleSetSort = useCallback((value) => {
        setPage(1);
        setSort(value);
    }, []);

    return {
        ...query,
        page,
        setPage,
        sort,
        setSort: handleSetSort,
        rating,
        setRating: handleSetRating,
        limit: DEFAULT_PAGE_SIZE,
    };
};
