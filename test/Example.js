const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const assert = chai.assert;
require("dotenv").config();

chai.use(chaiHttp);

describe("GET requests", function () {
  it("should get the list of all the users", function (done) {
    chai
      .request(process.env.URL)
      .get("/api/users?page=2")
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res.body.data).to.be.an("array");
        expect(res.body.page).to.be.equal(2);
        expect(res.body.lenght).to.be.not.null;
        done();
      });
  });

  it("should get the info of a single user", function (done) {
    chai
      .request(process.env.URL)
      .get("/api/users/2")
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res.body.lenght).to.be.not.null;
        done();
      });
  });

  it("verify if user was not found", function (done) {
    chai
      .request(process.env.URL)
      .get("/api/users/23")
      .end(function (err, res) {
        expect(res).to.have.status(404);
        expect(res.body).to.be.empty;
        done();
      });
  });

  it("verify all the color are displayed", function (done) {
    chai
      .request(process.env.URL)
      .get("/api/unknown")
      .end(function (err, res) {
        expect(res).to.have.status(200);
        assert.lengthOf(res.body.data, 6);
        done();
      });
  });
});

describe("POST requests", function () {
  it("Create a single user", function (done) {
    const name_ = "John";
    const job_ = "Automation";
    chai
      .request(process.env.URL)
      .post("/api/users")
      .send({
        name: name_,
        job: job_,
      })
      .end(function (err, res) {
        expect(res).to.has.status(201);
        expect(res.body.name).to.equal(name_);
        expect(res.body.job).to.equal(job_);
        assert.isString(res.body.id);
        assert.match(res.body.id, /^[0-9]+$/);
        assert.isNotEmpty(res.body.createdAt);
        done();
      });
  });
});

describe("GET requests", function () {
  it("Delayed call", function () {
    this.timeout(6000);
    return new Promise(function (resolve, reject) {
      chai
        .request(process.env.URL)
        .get(process.env.API_PATH || "")
        .end(function (err, res) {
          if (res.status === 200) {
            expect(res.body.data).to.be.an("array");
            expect(res.body.page).to.be.equal(1);
            resolve("resolved");
          } else {
            reject(new Error("Not getting 200 status API response"));
          }
        });
    });
  });
});
