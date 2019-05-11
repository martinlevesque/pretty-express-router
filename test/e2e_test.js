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

  it("with middlewares at the context level", function(done) {
    const app = express();

    async function home(req, res) {
      res.send({"what": "isthat"});
    }

    async function middleware1(req, res, next) {
      res.set("middleware1", "11");
      next();
    }

    async function middleware2(req, res, next) {
      res.set("middleware2", "22");
      next();
    }

    async function middlewareAdmin(req, res, next) {
      res.set("middlewareadmin", "admin");
      next();
    }

    async function homeAdmin(req, res) {
      res.send({"what": "isthatadmin"});
    }

    const routes = {
      "middlewares": [middleware1, middleware2],
      "get /": home,
      "admin": {
        "middlewares": [middlewareAdmin],
        "get /": homeAdmin
      }
    };

    expressRouting(app, routes);

    chai.request(app)
      .get('/')
      .end((err, res) => {
        res.headers["middleware1"].should.equals("11");
        res.headers["middleware2"].should.equals("22");
        res.should.have.status(200);

        chai.request(app)
          .get('/admin/')
          .end((err, res) => {
            res.headers["middleware1"].should.equals("11");
            res.headers["middleware2"].should.equals("22");
            res.headers["middlewareadmin"].should.equals("admin");
            res.should.have.status(200);
            res.body.what.should.equals("isthatadmin");
            done();
          })
      });
  });

  it("with middlewares at the route level", function(done) {
    const app = express();

    async function home(req, res) {
      res.send({"what": "isthat"});
    }

    async function middleware1(req, res, next) {
      res.set("middleware1", "11");
      next();
    }

    async function middlewareAdmin(req, res, next) {
      res.set("middlewareadmin", "admin");
      next();
    }

    async function homeAdmin(req, res) {
      res.send({"what": "isthatadmin"});
    }

    const routes = {
      "get /": { handler: home, middlewares: [middleware1] },
      "admin": {
        "get /": { handler: homeAdmin, middlewares: [middlewareAdmin] }
      }
    };

    expressRouting(app, routes);

    chai.request(app)
      .get('/')
      .end((err, res) => {
        res.headers["middleware1"].should.equals("11");
        res.should.have.status(200);

        chai.request(app)
          .get('/admin/')
          .end((err, res) => {
            res.headers["middlewareadmin"].should.equals("admin");
            res.should.have.status(200);
            res.body.what.should.equals("isthatadmin");
            done();
          })
      });
  });

});
