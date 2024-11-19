const { render, cleanup } = require("@marko/testing-library");
const { expect, use } = require("chai");
use(require("chai-dom"));

const example = require("./fixtures/example").default;

describe("browser", () => {
  afterEach(cleanup);

  describe("switch by=*", () => {
    it("entity input equal 'Andromeda' and renders 'Galaxy'", async () => {
      const { container, rerender } = await render(example, {
        entity: "Andromeda",
      });
      expect(container).has.text("Galaxy");
    });

    it("entity input equal 'Earth' matches array options case and renders 'Planet'", async () => {
      const { container, rerender } = await render(example, {
        entity: "Earth",
      });
      expect(container).has.text("Planet");
    });

    it("entity input equal 'Mars' matches array options case and renders 'Planet'", async () => {
      const { container } = await render(example, { entity: "Mars" });
      expect(container).has.text("Planet");
    });

    it("entity input equal 'Sun' catches default case and renders 'Star: Sun'", async () => {
      const { container, rerender } = await render(example, { entity: "Sun" });
      expect(container).has.text("Star: Sun");
    });
  });
});
