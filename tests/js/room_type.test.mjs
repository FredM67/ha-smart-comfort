// The room form's type (_setRoomType): stored when the user changes it, living space included, so that discovery,
// which suggests a type only to the rooms without one, keeps the choice; left as it was otherwise.
// Run by tests/test_frontend.py (pytest), or directly: node --test tests/js/
import assert from "node:assert/strict";
import { test } from "node:test";

globalThis.window = globalThis;
globalThis.HTMLElement = class {
  attachShadow() {
    this.shadowRoot = {};
    return this.shadowRoot;
  }
};
const registry = new Map();
globalThis.customElements = { get: (name) => registry.get(name), define: (name, cls) => registry.set(name, cls) };
globalThis.document = { createElement: () => ({}), querySelector: () => null };

await import("../../custom_components/smart_comfort/frontend/smart-comfort-panel.js");
const Panel = customElements.get("smart-comfort-panel");

test("an unchanged type is left as it was", () => {
  const panel = new Panel();
  const untyped = { name: "Cave" };
  panel._setRoomType(untyped, "living_space");
  assert.equal("type" in untyped, false);
  const annex = { name: "Cave", type: "annex" };
  panel._setRoomType(annex, "annex");
  assert.equal(annex.type, "annex");
});

test("a changed type is stored, living space included", () => {
  const panel = new Panel();
  const room = { name: "Cave", type: "annex" };
  panel._setRoomType(room, "living_space");
  assert.equal(room.type, "living_space");
  const other = { name: "Garage" };
  panel._setRoomType(other, "annex");
  assert.equal(other.type, "annex");
});
