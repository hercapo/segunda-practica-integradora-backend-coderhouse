import passport from "passport";
import local from "passport-local";
import userService from "../dao/models/users.manager.js";
import { createHash, validatePassword } from "../utils.js";
import GitHubStrategy from "passport-github2";
// let url = "http://http://localhost:8080/sessions/githubcallback"

const LocalStrategy = local.Strategy;
const initializePassport = () => {
    passport.use(
        "register",
        new LocalStrategy(
            {
                usernameField: "email",
                passReqToCallback: true,
            },
            async (req, username, password, done) => {
                const { first_name, last_name, email, age } = req.body;
                try {
                    let user = await userService.findOne({ email: username });
                    if (user) return done(null, false);
                    const newUser = {
                        first_name,
                        last_name,
                        email,
                        age,
                        password: createHash(password),
                    };
                    user = await userService.create(newUser);
                    return done(null, user);
                } catch (error) {
                    return done({ message: "Error creating user" });
                }
            }
        )
    );

    passport.use(
        "login",
        new LocalStrategy(
            { usernameField: "email" },
            async (username, password, done) => {
                try {
                    const user = await userService.findOne({ email: username })//.populate("Carts", userService) //aca!!!;
                    if (!user)
                        return done(null, false, { message: "User not found" });
                    if (!validatePassword(user, password))
                        return done(null, false);
                    return done(null, user);
                } catch (error) {
                    return done({ message: "Error logging in" });
                }
            }
        )
    );

    passport.use(
        "github",
        new GitHubStrategy(
            {
                clientID: "Iv1.827f68d0ed74f990",
                clientSecret: "5df96c88fe5ab66b92926813503665418c942c0e",
                callbackURL:
                    "http://localhost:8080/sessions/githubcallback",
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    console.log(profile);
                    let user = await userService.findOne({
                        email: profile._json.email,
                    });
                    if (user) return done(null, user);
                    const newUser = {
                        first_name: profile._json.name,
                        githubProfile: profile._json.html_url,
                        last_name: "",
                        email: profile._json.email,
                        age: 18,
                        password: "",
                    };
                    user = userService.create(newUser);
                    return done(null, false);
                } catch (error) {
                    return done({message: "Error creating user."});
                }
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (_id, done) => {
        try {
            const user = await userService.findOne({ _id });
            return done(null, user);
        } catch {
            return done({ message: "Error deserializing user" });
        }
    });
};

export default initializePassport;
