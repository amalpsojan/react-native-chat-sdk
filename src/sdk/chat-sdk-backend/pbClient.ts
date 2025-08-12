import PocketBase from 'pocketbase';
import RNEventSource from 'react-native-sse';

/**
 * Lightweight PocketBase client wrapper for React Native.
 * - No login/logout here; the app provides a user token via setToken.
 * - Ensures EventSource is polyfilled for realtime.
 */
export class PBClient {
  private pb: PocketBase;

  constructor(baseUrl: string) {
    if (typeof (global as any).EventSource === 'undefined') {
      (global as any).EventSource = RNEventSource as any;
    }
    this.pb = new PocketBase(baseUrl);
  }

  /** Set or clear the current user token (JWT). */
  setToken(token?: string) {
    if (token) {
      this.pb.authStore.save(token, null);
    } else {
      this.pb.authStore.clear();
    }
  }

  /** Best-effort token validation/refresh. Safe to call before protected ops. */
  async ensureAuth(): Promise<void> {
    if (!this.pb.authStore.token) return;
    try {
      await this.pb.collection('users').authRefresh();
    } catch {
      // token invalid/expired; clear so callers can react
      this.pb.authStore.clear();
    }
  }

  get sdk(): PocketBase {
    return this.pb;
  }
}


