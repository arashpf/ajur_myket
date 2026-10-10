// src/lib/analytics/track.js
//
// Fire-and-forget analytics event sender.
//
// Contract with the Laravel endpoint (POST /api/analytics/track):
//   Body: { event_name, platform, anonymous_id, payload }
//   Headers: Authorization: Bearer <id_token> (only if logged in)
//
// Rules:
//   - Never throws.
//   - Never blocks the UI.
//   - Never sends null anonymous_id.
//   - Uses the app's own IP / user-agent (Laravel reads them from the request).
//
// To add a new event: add its name to the ALLOWED_EVENTS set below.
// (Laravel validates too, in StoreAnalyticsEventRequest; this list just
//  catches typos at development time.)

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAnonymousId } from './anonymousId';

const ENDPOINT = 'https://api.ajur.app/api/analytics/track';
const AUTH_TOKEN_KEY = 'id_token';
const TIMEOUT_MS = 5000;

// The 9 events we ship in v1.
const ALLOWED_EVENTS = new Set([
  // Listing
  'listing_view',
  'listing_call',
  'listing_favorite',
  'listing_share',
  // Discovery
  'category_view',
  'city_view',
  'city_select',
  'search',
  'filter_apply',
  // Purchase
  'purchase_attempt',
  'purchase_outcome',
]);

/**
 * Send an analytics event to the backend.
 * Fire-and-forget — do NOT await this in UI code.
 *
 * @param {string} eventName  One of ALLOWED_EVENTS
 * @param {object} payload    Event-specific data
 * @returns {Promise<void>}   Resolves once the request finishes (or fails)
 */
export async function trackEvent(eventName, payload = {}) {
  // Dev-only validation. In prod we let Laravel be the source of truth.
  if (__DEV__ && !ALLOWED_EVENTS.has(eventName)) {
    console.warn(`[analytics] unknown event: ${eventName}`);
    return;
  }

  try {
    const [anonymousId, token] = await Promise.all([
      getAnonymousId(),
      AsyncStorage.getItem(AUTH_TOKEN_KEY).catch(() => null),
    ]);

    await axios.post(
      ENDPOINT,
      {
        event_name: eventName,
        platform: 'android',
        anonymous_id: anonymousId,
        payload,
      },
      {
        timeout: TIMEOUT_MS,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      },
    );

    if (__DEV__) {
      console.log(`[analytics] sent ${eventName}`, payload);
    }
  } catch (err) {
    // Never let analytics crash the app. Log in dev, stay silent in prod.
    if (__DEV__) {
      console.warn(
        `[analytics] failed ${eventName}:`,
        err?.response?.status || err?.message,
      );
    }
  }
}