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
import { selectCartItems, selectIsAuthenticated, selectServerCart } from "./cartSelectors";

const getServerItemId = (item) =>
  item?._id ?? item?.id ?? item?.itemId ?? item?.productId ?? item?.product ?? null;

export function useCart() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Fetch server cart only when authenticated (server is source of truth)
  useGetCartQuery(undefined, { skip: !isAuthenticated });

  const items = useSelector(selectCartItems);
  const serverCart = useSelector(selectServerCart);

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
      await addServer({ productId, quantity, size, color: product?.color ?? null }).unwrap();
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
      const resolvedProductId =
        productId ?? cartItem?.productId ?? cartItem?.product?._id ?? cartItem?.product ?? null;
      if (!resolvedProductId) {
        throw new Error("productId is required");
      }
      await updateServer({
        itemId,
        productId: resolvedProductId,
        quantity,
        size: size ?? cartItem?.size ?? "",
        color: cartItem?.color,
      }).unwrap();
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

  const summary = useMemo(() => {
    if (isAuthenticated && serverCart) {
      return {
        subtotal: Number(serverCart.subtotal) || 0,
        shipping: Number(serverCart.shipping) || 0,
        tax: Number(serverCart.tax) || 0,
        discount: Number(serverCart.discount) || 0,
        total: Number(serverCart.total) || 0,
      };
    }
    const subtotal = items.reduce((sum, i) => {
      const price = Number(i?.product?.price ?? i?.price) || 0;
      return sum + price * (Number(i?.quantity) || 0);
    }, 0);
    const shipping = items.length ? 10 : 0;
    const tax = 0;
    const discount = 0;
    return { subtotal, shipping, tax, discount, total: subtotal + shipping + tax - discount };
  }, [isAuthenticated, items, serverCart]);

  return { items, count, isAuthenticated, summary, add, setQuantity, remove, clear };
}

