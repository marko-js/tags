const assert = require("assert");
const sinon = require("sinon");
const { render, cleanup } = require("@marko/testing-library");
const EventEmitter = require("events").EventEmitter;
const exampleOn = require("./fixtures/example-on");
const exampleOnce = require("./fixtures/example-once");

describe("browser", () => {
  afterEach(cleanup);

  describe("subscribe on-*", () => {
    it("delegates events from an emitter when subscribed", async () => {
      const emitter = new EventEmitter();
      const { rerender } = await render(exampleOn, {
        playing: true,
        emitter
      });

      const pongSpy = sinon.spy();
      emitter.on("pong", pongSpy);
      emitter.emit("ping", "a", "b", "c");

      assert.ok(pongSpy.calledOnce);
      assert.ok(pongSpy.calledWith("a", "b", "c"));
      pongSpy.resetHistory();

      await rerender({
        playing: false,
        emitter
      });

      emitter.emit("ping", "a", "b", "c");
      assert.ok(pongSpy.notCalled);
    });

    it("stops delegating when destroyed", async () => {
      const emitter = new EventEmitter();

      await render(exampleOn, {
        playing: true,
        emitter
      });

      const pongSpy = sinon.spy();
      emitter.on("pong", pongSpy);
      emitter.emit("ping", "a", "b", "c");

      assert.ok(pongSpy.calledOnce);
      assert.ok(pongSpy.calledWith("a", "b", "c"));
      pongSpy.resetHistory();

      cleanup();

      emitter.emit("ping", "a", "b", "c");
      assert.ok(pongSpy.notCalled);
    });

    it("can swap emitters", async () => {
      const emitter1 = new EventEmitter();
      const emitter2 = new EventEmitter();

      const { rerender } = await render(exampleOn, {
        playing: true,
        emitter: emitter1
      });

      const pongSpy1 = sinon.spy();
      const pongSpy2 = sinon.spy();
      emitter1.on("pong", pongSpy1);
      emitter2.on("pong", pongSpy2);

      emitter1.emit("ping", "a", "b", "c");

      assert.ok(pongSpy1.calledOnce);
      assert.ok(pongSpy1.calledWith("a", "b", "c"));
      assert.ok(pongSpy2.notCalled);
      pongSpy1.resetHistory();

      await rerender({
        playing: true,
        emitter: emitter2
      });

      emitter2.emit("ping", "a", "b", "c");

      assert.ok(pongSpy2.calledOnce);
      assert.ok(pongSpy2.calledWith("a", "b", "c"));
      assert.ok(pongSpy1.notCalled);
    });
  });

  describe("subscribe once-*", () => {
    it("delegates events from an emitter when subscribed", async () => {
      const emitter = new EventEmitter();

      await render(exampleOnce, {
        playing: true,
        emitter
      });

      const pongSpy = sinon.spy();
      emitter.on("pong", pongSpy);
      emitter.emit("ping", "a", "b", "c");

      assert.ok(pongSpy.calledOnce);
      assert.ok(pongSpy.calledWith("a", "b", "c"));
      pongSpy.resetHistory();

      emitter.emit("ping", "a", "b", "c");
      assert.ok(pongSpy.notCalled);
    });
  });
});
