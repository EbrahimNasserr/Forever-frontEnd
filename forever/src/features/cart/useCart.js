import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useAddCartItemMutation,
  useClearCartMutation,
  useGetCartQuery,
  useRemoveCartItemMutation,
  useUpdateCartItemMutation,
} from "./cartApi";
import { addItem, clearCart, removeItem, setItemQuantity } from "./cartSlice";
import { selectCartItems, selectIsAuthenticated } from "./cartSelectors";

const getServerItemId = (item) => item?._id ?? item?.id ?? item?.itemId ?? null;

export function useCart() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Fetch server cart only when authenticated (server is source of truth)
  useGetCartQuery(undefined, { skip: !isAuthenticated });

  const items = useSelector(selectCartItems);

  const [addServer] = useAddCartItemMutation();
  const [updateServer] = useUpdateCartItemMutation();
  const [removeServer] = useRemoveCartItemMutation();
  const [clearServer] = useClearCartMutation();

  const add = useCallback(
    async ({ productId, quantity = 1, size = "", product }) => {
      if (!productId) return;
      if (!isAuthenticated) {
        dispatch(addItem({ productId, quantity, size, product }));
        return;
      }
      await addServer({ productId, quantity, size }).unwrap();
    },
    [addServer, dispatch, isAuthenticated]
  );

  const setQuantity = useCallback(
    async ({ cartItem, productId, size = "", quantity }) => {
      if (!isAuthenticated) {
        dispatch(setItemQuantity({ productId, size, quantity }));
        return;
      }
      const itemId = getServerItemId(cartItem);
      if (!itemId) return;
      await updateServer({ itemId, quantity }).unwrap();
    },
    [dispatch, isAuthenticated, updateServer]
  );

  const remove = useCallback(
    async ({ cartItem, productId, size = "" }) => {
      if (!isAuthenticated) {
        dispatch(removeItem({ productId, size }));
        return;
      }
      const itemId = getServerItemId(cartItem);
      if (!itemId) return;
      await removeServer(itemId).unwrap();
    },
    [dispatch, isAuthenticated, removeServer]
  );

  const clear = useCallback(async () => {
    if (!isAuthenticated) {
      dispatch(clearCart());
      return;
    }
    await clearServer().unwrap();
  }, [clearServer, dispatch, isAuthenticated]);

  const count = useMemo(
    () => items.reduce((sum, i) => sum + (Number(i?.quantity) || 0), 0),
    [items]
  );

  return { items, count, isAuthenticated, add, setQuantity, remove, clear };
}

