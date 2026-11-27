// Deliberately race-prone inventory update for PR-Norms.
type Inventory = { quantity: number };
export async function reserveUnsafe(item: Inventory, count: number, save: (quantity: number) => Promise<void>) {
  if (item.quantity >= count) {
    item.quantity = item.quantity - count;
    await save(item.quantity);
    return true;
  }
  return false;
}
