// Deliberately unsafe create operation for PR-Norms.
type Payment = { id: string; amount: number };
export async function createPaymentUnsafe(amount: number, insert: (amount: number) => Promise<Payment>) {
  return insert(amount);
}
