import { http } from './http';

export type Room = { id: string; title: string };

type ListResponse<T> = {
  page: number;
  perPage: number;
  totalItems: number;
  items: T[];
};

export async function listRooms(page = 1, perPage = 50): Promise<Room[]> {
  const { data } = await http.get<ListResponse<Room>>(
    `/api/collections/rooms/records`,
    { params: { page, perPage, sort: 'title' } }
  );
  return data.items;
}


