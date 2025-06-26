const sinon = require("sinon");
const chai = require("chai");
const expect = chai.expect;

const { getCoursById } = require("../controllers/cours.controller");
const Cours = require("../models/cours/cours.model");

describe("getCoursById", () => {
  let req, res, statusStub, jsonStub;

  beforeEach(() => {
    req = { params: { id: "abc123" } };
    jsonStub = sinon.stub();
    statusStub = sinon.stub().returns({ json: jsonStub });

    res = {
      status: statusStub,
      json: jsonStub,
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  it("doit retourner le cours s'il est trouvé", async () => {
    const fakeCours = { _id: "abc123", name: "Cours Test" };
    sinon.stub(Cours, "findById").resolves(fakeCours);

    await getCoursById(req, res);

    expect(statusStub.calledWith(200)).to.be.true;
    expect(jsonStub.calledWith(fakeCours)).to.be.true;
  });
});
