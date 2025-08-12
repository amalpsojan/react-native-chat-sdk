import { RestClient } from "./http";

type Room = {
  room: {
    collectionId: string;
    collectionName: string;
    id: string;
    title: string;
  };
  created: boolean;
};

export async function createRoom(title: string): Promise<Room> {
  const { data } = await RestClient.post<Room>("/createRoom", {
    title,
  });

  return data;
}
