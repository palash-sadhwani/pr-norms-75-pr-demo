// Deliberately unprotected endpoint example for PR-Norms.
export async function sendVerificationCode(
  phone: string,
  send: (phone: string) => Promise<void>,
): Promise<void> {
  await send(phone);
}
