import Collection from "../components/collection/Collection.jsx";

/**
 * Collection page wrapper.
 * Receives wishlist state and overlay handlers from App-level so that
 * ProductItem can show the heart button and quick-view eye on the
 * collection page, matching the Home page behaviour.
 */
const CollectionPage = ({ wishlistIds, onToggleWishlist, onQuickView }) => {
  return (
    <main>
      <Collection
        wishlistIds={wishlistIds}
        onToggleWishlist={onToggleWishlist}
        onQuickView={onQuickView}
      />
    </main>
  );
};

export default CollectionPage;
