import { getDevice, getProject } from '@repo/database';

export async function assertTimerTarget(userId: string, projectId: string, deviceId: string) {
  const project = await getProject(projectId, userId);
  if (!project) return { error: 'Project not found' as const };
  if (project.isArchived) return { error: 'Project is archived' as const };
  if (!project.timerEnabled) return { error: 'Timer disabled for this project' as const };
  const device = await getDevice(deviceId, userId);
  if (!device || !device.isActive || device.revokedAt) return { error: 'Device revoked' as const };
  return { project, device };
}
