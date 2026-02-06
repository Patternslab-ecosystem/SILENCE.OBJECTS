import type { SilenceEvent, EventHandler, EventMap } from "./types";

type EventKey = keyof EventMap;

/**
 * Typed event bus for inter-module communication.
 * All events are defined in EventMap (@silence/contracts).
 */
export class EventBus {
  private handlers = new Map<string, Set<EventHandler<unknown>>>();

  on<K extends EventKey>(type: K, handler: EventHandler<EventMap[K]>): () => void {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set());
    }
    this.handlers.get(type)!.add(handler as EventHandler<unknown>);
    return () => this.off(type, handler);
  }

  off<K extends EventKey>(type: K, handler: EventHandler<EventMap[K]>): void {
    this.handlers.get(type)?.delete(handler as EventHandler<unknown>);
  }

  async emit<K extends EventKey>(type: K, payload: EventMap[K], source: string): Promise<void> {
    const event: SilenceEvent<EventMap[K]> = {
      type,
      payload,
      timestamp: Date.now(),
      source,
    };
    const handlers = this.handlers.get(type);
    if (!handlers) return;
    await Promise.all(
      Array.from(handlers).map((handler) =>
        (handler as EventHandler<EventMap[K]>)(event)
      )
    );
  }
}
