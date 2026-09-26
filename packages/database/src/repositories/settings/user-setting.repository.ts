import { UserSettingModel, type UserSettingDocument } from '../../models/settings/user-setting.model';
import { userSettingDefaults, type UpdateUserSettingInput } from '../../schemas/settings/user-setting.schema';

export async function getUserSettings(userId: string): Promise<UserSettingDocument | null> {
  return UserSettingModel.findOne({ userId });
}

export async function upsertUserSettings(
  userId: string,
  input: UpdateUserSettingInput,
): Promise<UserSettingDocument> {
  const doc = await UserSettingModel.findOneAndUpdate(
    { userId },
    { $set: input, $setOnInsert: { userId, ...userSettingDefaults } },
    { new: true, upsert: true },
  );
  if (!doc) throw new Error('Failed to save settings');
  return doc;
}
