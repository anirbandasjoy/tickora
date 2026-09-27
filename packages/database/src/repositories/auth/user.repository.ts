import mongoose from 'mongoose';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  image: string | null;
}

/**
 * Find a user by their ID from the Better Auth user collection.
 *
 * Better Auth with the MongoDB adapter stores `_id` as a plain string
 * (not an ObjectId), so we query with the raw string value.
 *
 * Uses `mongoose.connection.db` but guards against it being undefined
 * (e.g. during startup or reconnection) by throwing a clear error.
 */
export async function findUserById(userId: string): Promise<UserProfile | null> {
  const db = mongoose.connection.db;
  if (!db) {
    throw new Error(
      'findUserById: mongoose.connection.db is not available. ' +
      'Ensure the database connection is established before calling this function.',
    );
  }

  // Better Auth stores _id as a plain string, not ObjectId.
  const user = await db.collection('user').findOne({ _id: userId as unknown as mongoose.mongo.BSON.ObjectId });
  if (!user) return null;

  return {
    id: String(user._id),
    name: (user.name as string) ?? '',
    email: user.email as string,
    image: (user.image as string | null) ?? null,
  };
}
