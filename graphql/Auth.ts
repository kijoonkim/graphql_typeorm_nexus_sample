import { extendType, nonNull, objectType, stringArg } from "nexus";
import { Context } from "../types/Context";
import argon2 from "argon2";
import { User } from "../entities/User";
import * as jwt from "jsonwebtoken";

export const AuthType = objectType ({
    name: "Auth",
    definition(t) {
        t.nonNull.string("token"),
        t.nonNull.field("user", {
            type: "User",
        });
    },
});

export const AuthMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.nonNull.field("login", {
            type: "Auth",
            args: {
                userId: nonNull(stringArg()),
                password: nonNull(stringArg()),
            },
            async resolve(_parent, args, context : Context, _info) : Promise<any> {
                const {userId, password} = args;
                const user = await User.findOne({ where: {userId}});

                if(!user) {
                    throw new Error("User not found.");
                }

                const isValid = await argon2.verify(user.password, password);
                if(!isValid) {
                    throw new Error("Invalid creds.");
                }

                const token = jwt.sign({userId: user.id}, process.env.TOKEN_SECRET as jwt.Secret);

                return { user, token };
            }
        });
        t.nonNull.field("register", {
            type: "Auth",
            args: {
                username: nonNull(stringArg()),
                userId: nonNull(stringArg()),
                password: nonNull(stringArg()),
                email: nonNull(stringArg()),
            },
            async resolve(_parent, args, context : Context, _info) : Promise<any> {
                const { username, userId, password, email} = args;
                const hashedPassword = await argon2.hash(password);
                let user;
                let token;
                try {
                    const result = await context.conn
                        .createQueryBuilder()
                        .insert()
                        .into(User)
                        .values({ username, userId, password: hashedPassword, email})
                        .returning("*")
                        .execute();

                    user = result.raw[0];
                    token = jwt.sign({userId: user.id }, process.env.TOKEN_SECRET as jwt.Secret)
                } catch (err) {
                    console.log(err);
                }

                return {user, token};
            }
        });
    }
});