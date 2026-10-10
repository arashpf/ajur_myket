// src/lib/analytics/anonymousId.js
//
// Persistent anonymous identifier for this install.
// Generated once on first launch, stored in AsyncStorage, reused forever.
// Sent to Laravel as `anonymous_id` on every analytics event.
//
// Why this matters:
//   Every dashboard in AnalyticsQueryService filters on
//   `anonymous_id IS NOT NULL`, so if this returns null, the event is
//   written but invisible to sessions / funnels / active users / etc.

import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

const STORAGE_KEY = 'ajur_anonymous_id';

// In-memory cache so we don't hit AsyncStorage on every event.
let cached = null;

/**
 * Returns the persistent anonymous ID for this install.
 * Never returns null. If storage fails, generates a session-only ID.
 *
 * @returns {Promise<string>}
 */
export async function getAnonymousId() {
  if (cached) return cached;

  try {
    let id = await AsyncStorage.getItem(STORAGE_KEY);

    if (!id) {
      id = String(uuid.v4());
      await AsyncStorage.setItem(STORAGE_KEY, id);
    }

    cached = id;
    return id;
  } catch (err) {
    // Storage is broken (rare). Fall back to a session-only ID so we
    // still send *something* rather than null.
    if (__DEV__) {
      console.warn('[analytics] anonymousId storage failed:', err?.message);
    }
    cached = String(uuid.v4());
    return cached;
  }
}