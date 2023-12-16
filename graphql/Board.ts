import { extendType, floatArg, nonNull, objectType, stringArg } from "nexus";
import { Board } from "../entities/Board";
import { Context } from "../types/Context";
import { User } from "../entities/User";

export const BoardType = objectType({
    name: "Board",
    definition(t) {
        t.nonNull.int("id"),
        t.nonNull.string("title"),
        t.nonNull.string("content"),
        t.nonNull.int("creatorId"),
        t.field("createdBy", {
            type: "User",
            resolve(parent, _args, context: Context, _info) : Promise<User | null> {
                return User.findOne({ where: { id: parent.creatorId}});
            }
        })
    },
});

export const BoardQuery = extendType({
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("boards", {
            type: "Board",
            resolve(_parent, _args, context : Context, _info) : Promise<Board[]> {
                //return Board.find();
                const { conn, userId } = context;
                if(!userId) {
                    throw new Error("Can't create board without logging in.");
                }

                return conn.query("select * from board");
            },
        });
    },
});

export const CreateBoardMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.nonNull.field("createBoard", {
            type: "Board",
            args: {
                title: nonNull(stringArg()),
                content: nonNull(stringArg()),
            },
            resolve(_parent, args, context : Context, _info) : Promise<Board> {
                const { title, content } = args;
                const { userId } = context;

                if(!userId) {
                    throw new Error("Can't create board without logging in.");
                }
                
                return Board.create({title, content, creatorId: userId}).save();
            },
        });
    },
});