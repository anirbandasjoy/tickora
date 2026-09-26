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
  } finally {
    await session.endSession();
  }
}
