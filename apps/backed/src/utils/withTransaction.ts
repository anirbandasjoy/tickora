import mongoose, { type ClientSession } from 'mongoose';
import { config } from '../config/env';

export async function withTransaction<T>(
  fn: (session: ClientSession | undefined) => Promise<T>
): Promise<T> {
  if (!config.DB_TRANSACTIONS) return fn(undefined);
  const session = await mongoose.startSession();
  try {
    let result!: T;
    await session.withTransaction(async () => {
      result = await fn(session);
    });
    return result;
  } catch (err) {
    // Standalone MongoDB (no replica set) throws on transactions.
    // Fall back to non-transactional execution so desktop auth still works in dev.
    const message = err instanceof Error ? err.message : String(err);
    if (
      message.includes('Transaction numbers') ||
      message.includes('replica set') ||
      message.includes('transactions are not supported') ||
      message.includes('Transaction') ||
      (err as any)?.code === 20 ||
      (err as any)?.codeName === 'IllegalOperation'
    ) {
      return fn(undefined);
    }
    throw err;
  } finally {
    await session.endSession();
  }
}
