import PocketBase from 'pocketbase';
import RNEventSource from 'react-native-sse';

/**
 * Lightweight PocketBase client wrapper for React Native.
 * - No login/logout here; the app provides a user token via setToken.
 * - Ensures EventSource is polyfilled for realtime.
 */
export class PBClient {
  private pb: PocketBase;
  private refreshing?: Promise<void>;

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
    if (!this.pb.authStore.token) {
      console.warn('[pb-client] no token in authStore');
      return;
    }
    // If record is missing, force a refresh to populate it
    if (!this.pb.authStore.record) {
      try {
        await this.pb.collection('users').authRefresh();
        console.log('[pb-client] token refresh (populate record) OK');
      } catch (e) {
        console.error('[pb-client] token refresh failed (populate record)', e);
      }
      // Continue to validity check below
    }
    // Skip if token still valid and record present
    if (this.pb.authStore.isValid && this.pb.authStore.record) return;
    // Coalesce concurrent refresh calls
    if (this.refreshing) return this.refreshing;
    this.refreshing = (async () => {
      try {
        await this.pb.collection('users').authRefresh();
        console.log('[pb-client] token refresh OK');
      } catch (e) {
        console.error('[pb-client] token refresh failed', e);
        // Do NOT clear token here; allow callers to retry or handle 401s gracefully
      }
    })();
    try {
      await this.refreshing;
    } finally {
      this.refreshing = undefined;
    }
  }

  get sdk(): PocketBase {
    return this.pb;
  }
}


