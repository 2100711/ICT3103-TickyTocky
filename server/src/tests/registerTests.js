import { resolve } from "path";
import { register } from "../controls/auth.js";
import { UserModel } from "../models/Users.js";
import { expect } from "chai";
import sinon from "sinon";

describe("Unit Test for /auth", () => {
  describe("Testing /register", () => {
    let findOneStub;

    before(() => {
      // Stub the userExists function
      findOneStub = sinon.stub(UserModel, "findOne");
    });

    after(() => {
      // RRestore UserModel.findOne to its original behavior
      findOneStub.restore();
    });

    it("Test 1 - should return 409 and an error message for an existing user", async () => {
      // Stub userExists to simulate an existing user
      findOneStub.resolves({});

      const req = {
        body: {
          f_name: "John",
          l_name: "Doe",
          email: "johndoe@gmail.com",
          password: "Password123!",
        },
      };

      const res = {
        status: (code) => {
          expect(code).to.equal(409);
          return {
            json: (data) => {
              expect(data.success).to.be.false;
              expect(data.error).to.equal(
                "User already exist, please login instead."
              );
            },
          };
        },
      };

      await register(req, res);
    });

    it("Test 2 - should return 401 and an error message for missing CSRF token", async () => {
      // Stub userExists to simulate a new user (no existing user)
      findOneStub.resolves(null);

      const req = {
        body: {
          f_name: "John",
          l_name: "Doe",
          email: "johndoe@gmail.com",
          password: "Password123!",
        },
        session: {
          user: { email: null },
          save: () => {},
          csrfToken: null,
        },
        cookies: {
          CSRFToken: null,
        },
      };

      const res = {
        status: (code) => {
          expect(code).to.equal(401);
          return {
            json: (data) => {
              expect(data.success).to.be.false;
              expect(data.message).to.equal("Token has not been provided.");
            },
          };
        },
      };

      await register(req, res);
    });

    // TODO: Make this test pass
    it("Test 3 - should return 201 and success message for successful registration", async () => {
      // Stub userExists to simulate a new user (no existing user)
      findOneStub.resolves(null);

      const req = {
        body: {
          f_name: "John",
          l_name: "Doe",
          email: "johndoe@gmail.com",
          password: "Password123!",
        },
        session: {
          user: { email: null },
          save: () => {},
          csrfToken: "test",
        },
        cookies: {
          CSRFToken: "test",
        },
      };

      const res = {
        status: (code) => {
          expect(code).to.equal(201);
          return {
            json: (data) => {
              expect(data.success).to.be.true;
              expect(data.message).to.equal("User registered successfully.");
            },
          };
        },
      };

      await register(req, res);
    });
  });
});
