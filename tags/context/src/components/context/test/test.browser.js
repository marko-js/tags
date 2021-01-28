const { getComponentForEl } = require("marko/components");
const { render, cleanup, fireEvent } = require("@marko/testing-library");
const { expect, use } = require("chai");
use(require("chai-dom"));

afterEach(cleanup);

describe("browser", () => {
  describe("rendered in the same component", () => {
    const template = require("./fixtures/same-component").default;
    let container, rerender;

    beforeEach(
      async () =>
        ({ container, rerender } = await render(template, {
          data: "[provided content]",
        }))
    );

    it("renders properly", () => {
      expect(container).has.text("[receiver content][provided content]");
    });

    it("updates context on parent rerender", async () => {
      await rerender({ data: "[provided content updated]" });
      expect(container).has.text(
        "[receiver content][provided content updated]"
      );
    });
  });

  describe("rendered in the same component without any provided context", () => {
    const template = require("./fixtures/context-not-provided-same-component")
      .default;
    let container;

    beforeEach(async () => ({ container } = await render(template, {})));

    it("renders properly", () => {
      expect(container).has.text("[receiver content][provided nothing]");
    });
  });

  describe("rendered in two separate components", () => {
    const template = require("./fixtures/external-components").default;
    let container, rerender, component;

    beforeEach(async () => {
      ({ container, rerender, getByTestId } = await render(template, {
        data: "[provided content]",
      }));
      component = getComponentForEl(getByTestId("root"));
    });

    it("renders properly", () => {
      expect(container).has.text(
        "[example content] [receiver content][provided content]"
      );
    });

    it("updates context on parent rerender", async () => {
      await rerender({ data: "[provided content updated]" });
      expect(container).has.text(
        "[example content] [receiver content][provided content updated]"
      );
    });

    it("updates context on receiver rerender", () => {
      const receiver = component.getComponent("receiver");
      receiver.forceUpdate();
      receiver.update();
      expect(container).has.text(
        "[example content] [receiver content][provided content]"
      );
    });
  });

  describe("rendered in two separate components with from as a constructor", () => {
    const template = require("./fixtures/external-components-from-as-constructor")
      .default;
    let container, rerender, component;

    beforeEach(async () => {
      ({ container, rerender, getByTestId } = await render(template, {
        data: "[provided content]",
      }));
      component = getComponentForEl(getByTestId("root"));
    });

    it("renders properly", () => {
      expect(container).has.text(
        "[example content] [receiver content][provided content]"
      );
    });

    it("updates context on parent rerender", async () => {
      await rerender({ data: "[provided content updated]" });
      expect(container).has.text(
        "[example content] [receiver content][provided content updated]"
      );
    });

    it("updates context on receiver rerender", () => {
      const receiver = component.getComponent("receiver");
      receiver.forceUpdate();
      receiver.update();
      expect(container).has.text(
        "[example content] [receiver content][provided content]"
      );
    });
  });

  describe("rendered with multiple context components", () => {
    const template = require("./fixtures/multiple-context-components").default;
    let container, rerender, component;

    beforeEach(async () => {
      ({ container, rerender, getByTestId } = await render(template, {
        data: "[provided content]",
      }));
      component = getComponentForEl(getByTestId("root"));
    });

    it("renders properly", () => {
      expect(container).has.text(
        "[example 1 content] [receiver 1 content][provided content] [seperator] [example 2 content] [receiver 2 content][provided content]"
      );
    });

    it("updates context on parent rerender", async () => {
      await rerender({ data: "[provided content updated]" });
      expect(container).has.text(
        "[example 1 content] [receiver 1 content][provided content updated] [seperator] [example 2 content] [receiver 2 content][provided content updated]"
      );
    });

    it("updates context on receiver rerender", () => {
      const receiver1 = component.getComponent("receiver1");
      const receiver2 = component.getComponent("receiver2");
      receiver1.forceUpdate();
      receiver1.update();
      expect(container).has.text(
        container.innerText,
        "[example 1 content] [receiver 1 content][provided content] [seperator] [example 2 content] [receiver 2 content][provided content]"
      );

      receiver2.forceUpdate();
      receiver2.update();
      expect(container).has.text(
        container.innerText,
        "[example 1 content] [receiver 1 content][provided content] [seperator] [example 2 content] [receiver 2 content][provided content]"
      );
    });
  });

  describe("rendered in two distant components", () => {
    const template = require("./fixtures/distant-components").default;
    let container, rerender, component;

    beforeEach(async () => {
      ({ container, rerender, getByTestId } = await render(template, {
        data: "[provided content]",
        show: true,
      }));
      component = getComponentForEl(getByTestId("root"));
    });

    it("renders properly", () => {
      expect(container).has.text(
        "[example content] [receiver content][provided content]"
      );
    });

    it("updates context on parent rerender", async () => {
      await rerender({ data: "[provided content updated]", show: true });
      expect(container).has.text(
        "[example content] [receiver content][provided content updated]"
      );
    });

    it("updates context on middle rerender", (done) => {
      const middle = component.getComponent("middle");
      middle.forceUpdate();
      middle.once("update", () => {
        expect(container).has.text(
          "[example content] [receiver content][provided content]"
        );
        done();
      });
    });

    it("updates preserves context when middle ancestors conditionally display", (done) => {
      const middle = component.getComponent("middle");
      middle.input = { show: false };
      middle.once("update", () => {
        expect(container).has.text("[example content] ");

        middle.input = { show: true };
        middle.once("update", () => {
          expect(container).has.text(
            "[example content] [receiver content][provided content]"
          );
          done();
        });
      });
    });

    it("updates context on receiver rerender", (done) => {
      const receiver = component
        .getComponent("middle")
        .getComponent("receiver");
      receiver.forceUpdate();
      receiver.once("update", () => {
        expect(container).has.text(
          "[example content] [receiver content][provided content]"
        );
        done();
      });
    });
  });

  describe("rendered with spread attribute context data", () => {
    const template = require("./fixtures/spread-context-data").default;
    let container, rerender;

    beforeEach(
      async () =>
        ({ container, rerender } = await render(template, { a: 1, b: 2 }))
    );

    it("renders properly", () => {
      expect(container).has.text('{"a":1,"b":2}');
    });

    it("updates context on parent rerender", async () => {
      await rerender({ a: 1, c: 3 });
      expect(container).has.text('{"a":1,"c":3}');
    });
  });

  describe("rendered with event handlers", () => {
    const template = require("./fixtures/event-handler").default;
    let container, rerender, getByText;

    beforeEach(
      async () =>
        ({ container, rerender, getByText } = await render(template, {
          data: "[provided content]",
        }))
    );

    it("renders properly", () => {
      expect(container).has.text(
        "[receiver content][provided content]Increment Count: 0"
      );
    });

    it("updates context on parent rerender", async () => {
      await rerender({ data: "[provided content updated]" });
      expect(container).has.text(
        "[receiver content][provided content updated]Increment Count: 0"
      );
    });

    it("forwards events to the parent context", async () => {
      const incrementButton = getByText("Increment");
      fireEvent.click(incrementButton);

      await rerender({ data: "[provided content updated]" });
      expect(container).has.text(
        "[receiver content][provided content updated]Increment Count: 1"
      );

      fireEvent.click(incrementButton);
      fireEvent.click(incrementButton);
      await rerender({ data: "[provided content updated again]" });
      expect(container).has.text(
        "[receiver content][provided content updated again]Increment Count: 3"
      );
    });
  });
});
