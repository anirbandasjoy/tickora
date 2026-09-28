import mongoose, { Types } from 'mongoose';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  image: string | null;
}

/**
 * Find a user by their ID from the Better Auth user collection.
 *
 * Better Auth's `session.user.id` is the hex string of the document's
 * `_id`, but the MongoDB adapter stores `_id` as a BSON ObjectId.
 * A plain-string `{ _id: userId }` query never matches an ObjectId,
 * so we try ObjectId first and fall back to the raw string for
 * forward/backward compatibility.
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const queries: any[] = [];
  if (Types.ObjectId.isValid(userId)) {
    try {
      queries.push({ _id: new Types.ObjectId(userId) });
    } catch {
      // Ignore malformed ObjectId strings; fall through to raw string.
    }
  }
  queries.push({ _id: userId as any });

  let user = null;
  for (const filter of queries) {
    // eslint-disable-next-line no-await-in-loop
    user = await db.collection('user').findOne(filter);
    if (user) break;
  }
  if (!user) return null;

  return {
    id: String(user._id),
    name: (user.name as string) ?? '',
    email: user.email as string,
    image: (user.image as string | null) ?? null,
  };
}
