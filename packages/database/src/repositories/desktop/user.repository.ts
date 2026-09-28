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
 * (not a BSON ObjectId), so we query with the raw string value.
 * This function accesses the `user` collection managed by Better Auth
 * directly via the raw Mongoose connection.
 */
export async function findUserById(
  userId: string,
): Promise<UserProfile | null> {
  const db = mongoose.connection.db;
  if (!db) {
    throw new Error(
      'findUserById: mongoose.connection.db is not available. ' +
        'Ensure the database connection is established before calling this.',
    );
  }

  // Better Auth stores _id as a plain string — do NOT wrap in ObjectId.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = await db.collection('user').findOne({ _id: userId as any });
  if (!user) return null;

  return {
    id: String(user._id),
    name: (user.name as string) ?? '',
    email: user.email as string,
    image: (user.image as string | null) ?? null,
  };
}
