import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

interface SessionEntry {
  history: unknown[];
  lastActiveAt: number;
}

@Injectable()
export class SessionMemoryService implements OnModuleDestroy {
  private readonly sessions = new Map<string, SessionEntry>();
  private readonly ttlMs: number;
  private readonly sweepHandle: NodeJS.Timeout;

  constructor(private readonly configService: ConfigService) {
    const ttlMinutes = Number(this.configService.get<string>("SESSION_MEMORY_TTL_MINUTES")) || 30;
    this.ttlMs = ttlMinutes * 60 * 1000;

    this.sweepHandle = setInterval(() => this.sweep(), 5 * 60 * 1000);
    this.sweepHandle.unref?.();
  }

  getHistory<T = unknown>(sessionId: string): T[] {
    const entry = this.sessions.get(sessionId);
    if (!entry) {
      return [];
    }
    if (this.isExpired(entry)) {
      this.sessions.delete(sessionId);
      return [];
    }
    return entry.history as T[];
  }

  setHistory<T = unknown>(sessionId: string, history: T[]) {
    this.sessions.set(sessionId, { history: history as unknown[], lastActiveAt: Date.now() });
  }

  clear(sessionId: string) {
    this.sessions.delete(sessionId);
  }

  private isExpired(entry: SessionEntry): boolean {
    return Date.now() - entry.lastActiveAt > this.ttlMs;
  }

  private sweep() {
    const now = Date.now();
    for (const [sessionId, entry] of this.sessions) {
      if (now - entry.lastActiveAt > this.ttlMs) {
        this.sessions.delete(sessionId);
      }
    }
  }

  onModuleDestroy() {
    clearInterval(this.sweepHandle);
  }
}
