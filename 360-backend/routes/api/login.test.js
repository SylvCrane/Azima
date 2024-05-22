const request = require('supertest');
const app = require("../../index.js");
const dot = require("dotenv");
dot.config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../../models/UserDetails");

describe('POST /login', () => {
    beforeAll(async () => {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
        }
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await User.deleteMany({});

        // Create a user before each test - THEN can login
        const hashedPassword = await bcrypt.hash("password", 10); // make sure to encrypt password
        await User.create({
            firstName: "firstName",
            lastName: "lastName",
            email: "existingemail@example.com",
            password: hashedPassword,
            bio: "testing bio",
            company: "companyTest",
            location: "locationTest",
            profileImage: "profileImageUrlTest"
        });
    });

    describe("given an email and password", () => {
        test("should respond with a 200 status code", async () => {
            const response = await request(app).post("/api/login").send({
                email: "existingemail@example.com",
                password: "password"
            });

            expect(response.statusCode).toBe(200);
            expect(response.body.status).toBe("ok");
            expect(response.body.user.email).toBe("existingemail@example.com");
        });
    });

    // When user logs in with a non existant email in Azima
    describe("given an email is not registered", () => {
        test("should respond with a 400 status code", async () => {
            const response = await request(app).post("/api/login").send({
                email: "nonexistingemail@example.com",
                password: "password"
            });

            expect(response.statusCode).toBe(400);
            //expect(response.body.user.email).toBe("nonexistingemail@example.com"); // removed because email is not be expected to be defined
            expect(response.body.status).toBe("error");
            expect(response.body.error).toBe("email_not_found"); // Refer to error message in login.js
        });
    });


    // When user logs in with existing email, but password is incorrect
    describe("given an email is not registered", () => {
        test("should respond with a 400 status code", async () => {
            const response = await request(app).post("/api/login").send({
                email: "existingemail@example.com",
                password: "incorrectpassword"
            });

            expect(response.statusCode).toBe(400);
            expect(response.body.status).toBe("error");
            expect(response.body.error).toBe("incorrect_password"); // Refer to error message in login.js
        });
    });
});