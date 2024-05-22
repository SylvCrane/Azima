const request = require('supertest');
const app = require("../../index.js");
const dot = require("dotenv");
dot.config().parsed; 
const mongoose = require("mongoose");
const mongodb = process.env.MONGODB_URI;
const User = require("../../models/UserDetails.js");
const bcrypt = require("bcryptjs");

describe('POST /signup', () => {
    beforeAll(async () => {
        // Ensure the MongoDB connection is established
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(mongodb, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
        }
    });

    afterAll(async () => {
        // Disconnect from the test database
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        // Clear the user collection before each test
        await User.deleteMany({});
    });

    describe("given a first name, last name, email, and password", () => {
        test("should respond with a 200 status code", async () => {
            const response = await request(app).post("/api/signup").send({
                firstName: "firstName",
                lastName: "lastName",
                email: "email@example.com",
                password: "password"
            });
            expect(response.statusCode).toBe(200);
            expect(response.body.status).toBe("ok");
            expect(response.body.message).toBe("User successfully registered.");
            expect(response.body.user.email).toBe("email@example.com");
        });
    });


    describe("given the email is already registered", () => {
        beforeEach(async () => {
            // Create a user before testing duplicate email
            await User.create({
                firstName: "firstName",
                lastName: "lastName",
                email: "existing@example.com",
                password: "password"
            });
        });

        test("should respond with a 400 status code", async () => {
            const response = await request(app).post("/api/signup").send({
                firstName: "firstName",
                lastName: "lastName",
                email: "existing@example.com",
                password: "password"
            });

            expect(response.statusCode).toBe(400);
            expect(response.body.status).toBe("error");
            expect(response.body.error).toBe("Email is already registered. Login instead");
        });
    });

});
