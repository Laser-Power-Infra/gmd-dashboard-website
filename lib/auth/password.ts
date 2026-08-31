import bcrypt from 'bcryptjs';

/**
 * Password hashing helpers.
 *
 * WHY bcrypt:
 *  - Passwords are NEVER stored in plain text. We store only a one-way hash.
 *  - bcrypt automatically generates a unique "salt" per password, so two
 *    users with the same password get different hashes.
 *  - The "cost" (12) makes each hash deliberately slow (~100ms) so that
 *    brute-force attacks become impractical.
 */

const SALT_ROUNDS = 12;

/** Hash a plain-text password. The returned string contains the salt + hash. */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compare a plain-text password against a stored hash.
 * Returns true only if the password matches the hash.
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
