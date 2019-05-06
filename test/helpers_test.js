const expect = require('expect.js');
const helpers = require("../lib");

describe("helpers", function() {
  describe('methodToRouterFunctionName', function() {
    it("with get", async function() {
      expect(helpers.methodToRouterFunctionName("get")).to.equal("get");
    })

    it("with GET", async function() {
      expect(helpers.methodToRouterFunctionName("GET")).to.equal("get");
    })

    it("with post", async function() {
      expect(helpers.methodToRouterFunctionName("post")).to.equal("post");
    })

    it("with put", async function() {
      expect(helpers.methodToRouterFunctionName("put")).to.equal("put");
    })

    it("with patch", async function() {
      expect(helpers.methodToRouterFunctionName("patch")).to.equal("patch");
    })

    it("with delete", async function() {
      expect(helpers.methodToRouterFunctionName("delete")).to.equal("delete");
    })
  })

  describe('decodeRoute', function() {
    it("with get /regular", async function() {
      const r = helpers.decodeRoute("get /regular");
      expect(r.path).to.equal("/regular");
      expect(r.method).to.equal("get");
    })

    it("with post *", async function() {
      const r = helpers.decodeRoute("post *");
      expect(r.path).to.equal("*");
      expect(r.method).to.equal("post");
    })

    it("with * /endpoint", async function() {
      const r = helpers.decodeRoute("* /endpoint");
      expect(r.path).to.equal("/endpoint");
      expect(r.method).to.equal("all");
    })
  })
})
