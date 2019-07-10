const sinon = require("sinon");
const { render, cleanup } = require("@marko/testing-library");
const { expect, use } = require("chai");
use(require("chai-dom"));
use(require("sinon-chai"));

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

      expect(pongSpy).calledOnceWith("a", "b", "c");
      pongSpy.resetHistory();

      await rerender({
        playing: false,
        emitter
      });

      emitter.emit("ping", "a", "b", "c");
      expect(pongSpy).not.called;
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

      expect(pongSpy).calledOnceWith("a", "b", "c");
      pongSpy.resetHistory();

      cleanup();

      emitter.emit("ping", "a", "b", "c");
      expect(pongSpy).not.called;
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

      expect(pongSpy1).calledOnceWith("a", "b", "c");
      expect(pongSpy2).not.called;
      pongSpy1.resetHistory();

      await rerender({
        playing: true,
        emitter: emitter2
      });

      emitter2.emit("ping", "a", "b", "c");

      expect(pongSpy1).not.called;
      expect(pongSpy2).calledOnceWith("a", "b", "c");
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

      expect(pongSpy).calledOnceWith("a", "b", "c");
      pongSpy.resetHistory();

      emitter.emit("ping", "a", "b", "c");
      expect(pongSpy).not.called;
    });
  });
});
