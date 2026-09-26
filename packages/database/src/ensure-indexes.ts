import { DesktopDeviceModel } from "./models/desktop/desktop-device.model";
import { DesktopSessionModel } from "./models/desktop/desktop-session.model";
import { DesktopAuthRequestModel } from "./models/desktop/desktop-auth-request.model";
import { ProjectModel } from "./models/project/project.model";
import { WorkSessionModel } from "./models/work/work-session.model";
import { ActivityEventModel } from "./models/work/activity-event.model";
import { UserSettingModel } from "./models/settings/user-setting.model";
import { ApiKeyModel } from "./models/api/api-key.model";

const REGISTERED_MODELS = [
  DesktopDeviceModel,
  DesktopSessionModel,
  DesktopAuthRequestModel,
  ProjectModel,
  WorkSessionModel,
  ActivityEventModel,
  UserSettingModel,
  ApiKeyModel,
];

export async function ensureDatabaseIndexes(): Promise<string[]> {
  const created: string[] = [];
  for (const m of REGISTERED_MODELS) {
    await m.createIndexes();
    created.push(m.collection.name);
  }
  return created;
}
