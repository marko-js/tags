const sinon = require("sinon");
const { render, cleanup, fireEvent } = require("@marko/testing-library");
const { expect, use } = require("chai");
use(require("chai-dom"));
use(require("sinon-chai"));

const simpleState = require("./fixtures/simple").default;

describe("browser", () => {
  afterEach(cleanup);

  describe("State update", () => {
    it("Updates simple state", async () => {
      const { rerender, queryByText, getByText } = await render(simpleState);
    });
  });
});
