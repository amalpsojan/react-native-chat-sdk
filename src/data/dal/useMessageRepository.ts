import { useMemo } from "react";
import type { MessageRepository } from "./MessageRepository";
// import { InMemoryMessageRepository } from "./InMemoryMessageRepository";
import { WatermelonMessageRepository } from "./WatermelonMessageRepository";

let singletonRepository: MessageRepository | null = null;

export function useMessageRepository(): MessageRepository {
  return useMemo(() => {
    if (singletonRepository) return singletonRepository;
    // singletonRepository = new InMemoryMessageRepository();
    singletonRepository = new WatermelonMessageRepository();
    return singletonRepository;
  }, []);
}
