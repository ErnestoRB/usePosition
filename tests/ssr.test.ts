/**
 * @jest-environment node
 */

import manager from "../src/engine";

describe("Engine SSR ", () => {
  it("should do nothing when typeof window === 'undefined'", () => {
    expect(manager.isBrowser).toBe(false);
  });
});
