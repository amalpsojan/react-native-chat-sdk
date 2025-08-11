import { useMemo } from "react";
import { InMemoryMessageRepository } from "./InMemoryMessageRepository";
import type { MessageRepository } from "./MessageRepository";

let singletonRepository: MessageRepository | null = null;

export function useMessageRepository(): MessageRepository {
  return useMemo(() => {
    if (singletonRepository) return singletonRepository;
    singletonRepository = new InMemoryMessageRepository();
    return singletonRepository;
  }, []);
}
