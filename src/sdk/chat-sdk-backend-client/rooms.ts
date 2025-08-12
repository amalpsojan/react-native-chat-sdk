import type { PBClient } from './pbClient';

export type Room = { id: string; title: string };

type ListResponse<T> = {
  page: number;
  perPage: number;
  totalItems: number;
  items: T[];
};

export async function listRooms(pb: PBClient, page = 1, perPage = 50): Promise<Room[]> {
  await pb.ensureAuth();
  // newest first
  const { items } = await pb.sdk.collection('rooms').getList<Room>(page, perPage, {
    sort: '-createdAtMs',
  }) as unknown as ListResponse<Room>;
  return items;
}


