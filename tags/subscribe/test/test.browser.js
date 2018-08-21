const assert = require("assert");
const EventEmitter = require("events").EventEmitter;
const exampleOn = require("./fixtures/example-on");
const exampleOnce = require("./fixtures/example-once");

describe("browser", () => {
  describe("subscribe on-*", () => {
    it("delegates events from an emitter when subscribed", done => {
      const emitter = new EventEmitter();
      const component = exampleOn
        .renderSync({
          playing: true,
          emitter
        })
        .appendTo(document.body)
        .getComponent();

      emitter.once("pong", (...args) => {
        assert.deepEqual(args, ["a", "b", "c"]);

        component.once("update", () => {
          emitter.once("pong", () => done(new Error("Should not emit event")));
          emitter.emit("ping", "a", "b", "c");
          setTimeout(() => {
            component.once("destroy", () => done());
            component.destroy();
          }, 16);
        });

        component.input.playing = false;
        component.forceUpdate();
      });

      setTimeout(() => {
        emitter.emit("ping", "a", "b", "c");
      }, 0);
    });

    it("stops delegating when destroyed", done => {
      const emitter = new EventEmitter();
      const component = exampleOn
        .renderSync({
          playing: true,
          emitter
        })
        .appendTo(document.body)
        .getComponent();

      emitter.once("pong", (...args) => {
        assert.deepEqual(args, ["a", "b", "c"]);
        emitter.once("pong", () => done(new Error("Should not emit event")));
        component.once("destroy", () => {
          setTimeout(() => {
            emitter.emit("ping", "a", "b", "c");
            setTimeout(() => done(), 16);
          }, 0);
        });
        component.destroy();
      });

      setTimeout(() => {
        emitter.emit("ping", "a", "b", "c");
      }, 0);
    });

    it("stops delegating when a new emitter is set", done => {
      const emitter = new EventEmitter();
      const component = exampleOn
        .renderSync({
          playing: true,
          emitter
        })
        .appendTo(document.body)
        .getComponent();

      emitter.once("pong", (...args) => {
        assert.deepEqual(args, ["a", "b", "c"]);
        component.once("update", () => {
          emitter.once("pong", () => done(new Error("Should not emit event")));
          emitter.emit("ping", "a", "b", "c");
          setTimeout(() => {
            component.once("destroy", () => done());
            component.destroy();
          }, 16);
        });
        component.input.emitter = new EventEmitter();
        component.forceUpdate();
      });

      setTimeout(() => {
        emitter.emit("ping", "a", "b", "c");
      }, 0);
    });
  });

  describe("subscribe once-*", () => {
    it("delegates events from an emitter when subscribed", done => {
      const emitter = new EventEmitter();
      const component = exampleOnce
        .renderSync({
          playing: true,
          emitter
        })
        .appendTo(document.body)
        .getComponent();

      emitter.once("pong", (...args) => {
        assert.deepEqual(args, ["a", "b", "c"]);
        emitter.once("pong", () => done(new Error("Should not emit event")));
        emitter.emit("ping", "a", "b", "c");

        setTimeout(() => {
          component.once("destroy", () => done());
          component.destroy();
        }, 16);
      });

      setTimeout(() => {
        emitter.emit("ping", "a", "b", "c");
      }, 0);
    });
  });
});
