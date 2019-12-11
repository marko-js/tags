const sinon = require("sinon");
const { render, cleanup } = require("@marko/testing-library");
const { expect, use } = require("chai");
use(require("chai-dom"));
use(require("sinon-chai"));

const effect = require("./fixtures/effect.marko");
const mount = require("./fixtures/mount.marko");

describe("browser", () => {
  afterEach(cleanup);

  describe("effect", () => {
    it("fires on mount & cleans up", async () => {
      const spy = sinon.spy();
      await render(effect, {
        fn: spy,
        message: "foo"
      });

      expect(spy).calledOnceWith("applied foo");

      spy.resetHistory();
      await cleanup();

      expect(spy).calledOnceWith("cleaned foo");
    });

    it("fires & cleans up on updates", async () => {
      const spy = sinon.spy();
      const { rerender } = await render(effect, {
        fn: spy,
        message: "foo"
      });

      expect(spy).calledOnceWith("applied foo");

      spy.resetHistory();
      await rerender({
        fn: spy,
        message: "bar"
      });

      expect(spy).callCount(2);
      expect(spy).calledWith("cleaned foo");
      expect(spy).calledWith("applied bar");

      spy.resetHistory();
      await cleanup();

      expect(spy).calledOnceWith("cleaned bar");
    });

    it("does not fire on irrelevant updates", async () => {
      const spy = sinon.spy();
      const { rerender } = await render(effect, {
        fn: spy,
        message: "foo",
        count: 0
      });

      expect(spy).calledOnceWith("applied foo");

      spy.resetHistory();
      await rerender({
        fn: spy,
        message: "foo",
        count: 1
      });

      expect(spy).callCount(0);

      spy.resetHistory();
      await cleanup();

      expect(spy).calledOnceWith("cleaned foo");
    });
  });

  describe("mount", () => {
    it("fires on mount & cleans up", async () => {
      const spy = sinon.spy();
      await render(mount, {
        fn: spy,
        message: "foo"
      });

      expect(spy).calledOnceWith("applied foo");

      spy.resetHistory();
      await cleanup();

      expect(spy).calledOnceWith("cleaned foo");
    });

    it("does not fire on updates", async () => {
      const spy = sinon.spy();
      const { rerender } = await render(mount, {
        fn: spy,
        message: "foo"
      });

      expect(spy).calledOnceWith("applied foo");

      spy.resetHistory();
      await rerender({
        fn: spy,
        message: "bar"
      });

      expect(spy).callCount(0);

      spy.resetHistory();
      await cleanup();

      expect(spy).calledOnceWith("cleaned foo");
    });
  });
});
