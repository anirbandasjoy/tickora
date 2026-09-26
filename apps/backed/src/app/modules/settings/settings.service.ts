import {
  getUserSettings,
  upsertUserSettings,
  userSettingDefaults,
  type UpdateUserSettingInput,
} from '@repo/database';

export async function getMine(userId: string) {
  const doc = await getUserSettings(userId);
  return doc ?? { userId, ...userSettingDefaults };
}

export async function updateMine(userId: string, input: UpdateUserSettingInput) {
  return upsertUserSettings(userId, input);
}
