const assert = require("assert");

describe("browser", () => {
  describe("rendered in the same component", () => {
    const template = require("./fixtures/same-component");
    const container = document.createElement("div");
    let component;

    beforeEach(() => {
      component = template
        .renderSync({ data: "[provided content]" })
        .appendTo(container)
        .getComponent();
    });

    afterEach(() => component.destroy());

    it("renders properly", () => {
      assert.equal(container.innerText, "[receiver content][provided content]");
    });

    it("updates context on parent rerender", done => {
      component.input = { data: "[provided content updated]" };
      component.once("update", () => {
        assert.equal(
          container.innerText,
          "[receiver content][provided content updated]"
        );
        done();
      });
    });
  });

  describe("rendered in two separate components", () => {
    const template = require("./fixtures/external-components");
    const container = document.createElement("div");
    let component;

    beforeEach(() => {
      component = template
        .renderSync({ data: "[provided content]" })
        .appendTo(container)
        .getComponent();
    });

    afterEach(() => component.destroy());

    it("renders properly", () => {
      assert.equal(
        container.innerText,
        "[example content] [receiver content][provided content]"
      );
    });

    it("updates context on parent rerender", done => {
      component.input = { data: "[provided content updated]" };
      component.once("update", () => {
        setTimeout(() => {
          assert.equal(
            container.innerText,
            "[example content] [receiver content][provided content updated]"
          );
          done();
        });
      });
    });

    it("updates context on receiver rerender", done => {
      const receiver = component.getComponent("receiver");
      receiver.forceUpdate();
      receiver.once("update", () => {
        assert.equal(
          container.innerText,
          "[example content] [receiver content][provided content]"
        );
        done();
      });
    });
  });

  describe("rendered with multiple context components", () => {
    const template = require("./fixtures/multiple-context-components");
    const container = document.createElement("div");
    let component;

    beforeEach(() => {
      component = template
        .renderSync({ data: "[provided content]" })
        .appendTo(container)
        .getComponent();
    });

    afterEach(() => component.destroy());

    it("renders properly", () => {
      assert.equal(
        container.innerText,
        "[example 1 content] [receiver 1 content][provided content] [seperator][example 2 content] [receiver 2 content][provided content]"
      );
    });

    it("updates context on parent rerender", done => {
      component.input = { data: "[provided content updated]" };
      component.once("update", () => {
        setTimeout(() => {
          assert.equal(
            container.innerText,
            "[example 1 content] [receiver 1 content][provided content updated] [seperator][example 2 content] [receiver 2 content][provided content updated]"
          );
          done();
        });
      });
    });

    it("updates context on receiver rerenders", done => {
      const receiver1 = component.getComponent("receiver1");
      const receiver2 = component.getComponent("receiver2");
      receiver1.forceUpdate();
      receiver1.once("update", () => {
        assert.equal(
          container.innerText,
          "[example 1 content] [receiver 1 content][provided content] [seperator][example 2 content] [receiver 2 content][provided content]"
        );

        receiver2.forceUpdate();
        receiver2.once("update", () => {
          assert.equal(
            container.innerText,
            "[example 1 content] [receiver 1 content][provided content] [seperator][example 2 content] [receiver 2 content][provided content]"
          );
          done();
        });
      });
    });
  });

  describe("rendered in two distant components", () => {
    const template = require("./fixtures/distant-components");
    const container = document.createElement("div");
    let component;

    beforeEach(() => {
      component = template
        .renderSync({ data: "[provided content]", show: true })
        .appendTo(container)
        .getComponent();
    });

    afterEach(() => component.destroy());

    it("renders properly", () => {
      assert.equal(
        container.innerText,
        "[example content] [receiver content][provided content]"
      );
    });

    it("updates context on parent rerender", done => {
      component.input = { data: "[provided content updated]", show: true };
      component.once("update", () => {
        setTimeout(() => {
          assert.equal(
            container.innerText,
            "[example content] [receiver content][provided content updated]"
          );
          done();
        });
      });
    });

    it("updates context on middle rerender", done => {
      const middle = component.getComponent("middle");
      middle.forceUpdate();
      middle.once("update", () => {
        assert.equal(
          container.innerText,
          "[example content] [receiver content][provided content]"
        );
        done();
      });
    });

    it("updates preserves context when middle ancestors conditionally display", done => {
      const middle = component.getComponent("middle");
      middle.input = { show: false };
      middle.once("update", () => {
        assert.equal(container.innerText.trim(), "[example content]");

        middle.input = { show: true };
        middle.once("update", () => {
          assert.equal(
            container.innerText,
            "[example content] [receiver content][provided content]"
          );
          done();
        });
      });
    });

    it("updates context on receiver rerender", done => {
      const receiver = component
        .getComponent("middle")
        .getComponent("receiver");
      receiver.forceUpdate();
      receiver.once("update", () => {
        assert.equal(
          container.innerText,
          "[example content] [receiver content][provided content]"
        );
        done();
      });
    });
  });

  describe("rendered with spread attribute context data", () => {
    const template = require("./fixtures/spread-context-data");
    const container = document.createElement("div");
    let component;

    beforeEach(() => {
      component = template
        .renderSync({ a: 1, b: 2 })
        .appendTo(container)
        .getComponent();
    });

    afterEach(() => component.destroy());

    it("renders properly", () => {
      assert.equal(container.innerText, '{"a":1,"b":2}');
    });

    it("updates context on parent rerender", done => {
      component.input = { a: 1, c: 3 };
      component.once("update", () => {
        assert.equal(container.innerText, '{"a":1,"c":3}');
        done();
      });
    });
  });

  describe("rendered with event handlers", () => {
    const template = require("./fixtures/event-handler");
    const container = document.createElement("div");
    let component;

    before(() => document.body.appendChild(container));

    beforeEach(() => {
      component = template
        .renderSync({ data: "[provided content]" })
        .appendTo(container)
        .getComponent();
    });

    afterEach(() => component.destroy());
    after(() => document.body.removeChild(container));

    it("renders properly", () => {
      assert.equal(container.innerText, "[receiver content][provided content]");
    });

    it("updates context on parent rerender", done => {
      component.input = { data: "[provided content updated]" };
      component.once("update", () => {
        assert.equal(
          container.innerText,
          "[receiver content][provided content updated]"
        );
        done();
      });
    });

    it("forwards events to the parent context", done => {
      const btn = container.querySelector(".test-button");
      btn.click();

      setTimeout(() => {
        btn.click();
        setTimeout(() => {
          assert.equal(component.callCount, 2);
          done();
        }, 100);
      }, 100);
    });
  });
});
