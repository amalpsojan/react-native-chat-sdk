import { useEffect, useMemo, useRef } from "react";
import type { MessageRepository } from "./MessageRepository";
// import { InMemoryMessageRepository } from "./InMemoryMessageRepository";
import { SyncService } from "@/data/sync/SyncService";
import { WatermelonMessageRepository } from "./WatermelonMessageRepository";

let singletonRepository: MessageRepository | null = null;
const syncService = new SyncService();

export function useMessageRepository(roomId?: string): MessageRepository {
  const repo = useMemo(() => {
    if (singletonRepository) return singletonRepository;
    // singletonRepository = new InMemoryMessageRepository();
    singletonRepository = new WatermelonMessageRepository();
    return singletonRepository;
  }, []);

  const didSyncRef = useRef(false);
  useEffect(() => {
    if (!roomId || didSyncRef.current) return;
    didSyncRef.current = true;
    // initial pull from mock backend into WatermelonDB
    syncService.pull(roomId).catch(() => {
      // ignore errors in mock
    });
  }, [roomId]);

  return repo;
}
