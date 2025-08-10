import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { upsertPushToken } from './pocketbase';

export async function registerForPushNotificationsAsync(userId: string, deviceId: string) {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    return null;
  }
  const projectId = Constants?.expoConfig?.extra?.eas?.projectId || Constants?.easConfig?.projectId;
  const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
  await upsertPushToken(userId, deviceId, token);
  return token;
} 