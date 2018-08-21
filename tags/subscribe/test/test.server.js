const assert = require("assert");
const cheerio = require("cheerio");
const template = require("../");

describe("server", () => {
  it("does not render anything", () => {
    const content = "content";
    return template.render({ renderBody }).then(html => {
      const $ = cheerio.load(`<html><head></head><body>${html}</body></html>`);
      const body = $("body");
      stripComments(body);
      assert.equal(body.html(), "");
    });

    function renderBody(out) {
      out.write(content);
    }
  });
});

function stripComments(el) {
  el.contents()
    .filter(isComment)
    .remove();
}

function isComment() {
  return this.type === "comment";
}
