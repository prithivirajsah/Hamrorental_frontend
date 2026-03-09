const WISHLIST_KEY = 'wishlist_items';

function readWishlist() {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeWishlist(items) {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
}

export function getWishlistItems() {
  return readWishlist();
}

export function isInWishlist(carId) {
  const id = String(carId);
  return readWishlist().some((item) => String(item.id) === id);
}

export function toggleWishlist(car) {
  const items = readWishlist();
  const id = String(car.id);
  const exists = items.some((item) => String(item.id) === id);

  if (exists) {
    const nextItems = items.filter((item) => String(item.id) !== id);
    writeWishlist(nextItems);
    return { added: false, items: nextItems };
  }

  const itemToSave = {
    id: car.id,
    name: car.name,
    price: car.price,
    image: car.image,
    transmission: car.transmission || '',
    location: car.location || '',
    category: car.category || '',
  };

  const nextItems = [...items, itemToSave];
  writeWishlist(nextItems);
  return { added: true, items: nextItems };
}

export function removeFromWishlist(carId) {
  const id = String(carId);
  const nextItems = readWishlist().filter((item) => String(item.id) !== id);
  writeWishlist(nextItems);
  return nextItems;
}
