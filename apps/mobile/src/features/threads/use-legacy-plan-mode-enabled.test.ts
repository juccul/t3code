import { describe, expect, it } from "@effect/vitest";

import {
  resolveLegacyPlanModeEnabled,
  resolvePendingTaskInteractionMode,
} from "./legacy-plan-mode";

describe("resolveLegacyPlanModeEnabled", () => {
  it("stays off until the explicit legacy preference has loaded", () => {
    expect(resolveLegacyPlanModeEnabled({ loaded: false, preference: true })).toBe(false);
    expect(resolveLegacyPlanModeEnabled({ loaded: true, preference: undefined })).toBe(false);
    expect(resolveLegacyPlanModeEnabled({ loaded: true, preference: false })).toBe(false);
  });

  it("enables plan mode only for an explicit loaded opt-in", () => {
    expect(resolveLegacyPlanModeEnabled({ loaded: true, preference: true })).toBe(true);
  });

  it("preserves a queued plan task while the preference is still loading", () => {
    expect(
      resolvePendingTaskInteractionMode({
        preferenceLoaded: false,
        planModeEnabled: false,
        draftInteractionMode: "plan",
        queuedInteractionMode: "plan",
      }),
    ).toBe("plan");
  });

  it("forces build mode once the disabled preference has loaded", () => {
    expect(
      resolvePendingTaskInteractionMode({
        preferenceLoaded: true,
        planModeEnabled: false,
        draftInteractionMode: "plan",
        queuedInteractionMode: "plan",
      }),
    ).toBe("default");
  });

  it("keeps a fresh draft in build mode while the preference is loading", () => {
    expect(
      resolvePendingTaskInteractionMode({
        preferenceLoaded: false,
        planModeEnabled: false,
        draftInteractionMode: "plan",
        queuedInteractionMode: undefined,
      }),
    ).toBe("default");
  });
});
