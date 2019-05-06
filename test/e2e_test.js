const chai = require("chai");
const chaiHttp = require("chai-http");
const express = require("express");

const expressRouting = require("../index");

// Configure chai
chai.use(chaiHttp);
chai.should();

describe("expressRouting", function() {

  it("with basic routes", function(done) {
    const app = express();

    async function home(req, res) {
      res.send({"what": "isthat"});
    }

    const routes = {
      "get /": home
    };

    expressRouting(app, routes);

    chai.request(app)
      .get('/')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.what.should.equals("isthat");
        done();
      });
  })

  it("with child routes", function(done) {
    const app = express();

    async function home(req, res) {
      res.send({"what": "isthat"});
    }

    async function myAll(req, res, next) {

      res.set("my-special-field", "testtt");

      next();
    }

    async function homeAdmin(req, res) {
      res.send({"what": "isthatadmin"});
    }

    const routes = {
      "get /": home,
      "get *": myAll,
      "admin": {
        "get /": homeAdmin
      }
    };

    expressRouting(app, routes);

    chai.request(app)
      .get('/admin/')
      .end((err, res) => {
        res.headers["my-special-field"].should.equals("testtt");
        res.should.have.status(200);
        res.body.what.should.equals("isthatadmin");
        done();
      });
  })

})
