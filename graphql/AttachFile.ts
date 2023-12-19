import { extendType, floatArg, intArg, nonNull, objectType, stringArg } from "nexus";
import { AttachFile } from "../entities/AttachFile";
import { Context } from "../types/Context";
import { Board } from "../entities/Board";
import { User } from "../entities/User";
import { Binary } from "typeorm";

export const AttachFileType = objectType({
    name: "AttachFile",
    definition(t) {
        t.nonNull.int("id"),
        t.nonNull.string("fileName"),
        t.nonNull.int("fileSize"),
        t.nonNull.string("mimetype"),
        t.nonNull.int("boardId")
    },
});


export const AttachFileQuery = extendType ({
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("attachFiles", {
            type: "AttachFile",
            args: {
                boardId: nonNull(intArg()),
            },
            resolve(_parent, args, context : Context, _info) : Promise<AttachFile[]> {
                const { boardId } = args; 
                return AttachFile.find({where: {boardId}});
            },
        });
    },
});

export const CreateAttachFileMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.nonNull.field("createAttachFile", {
            type: "AttachFile",
            args: {
                fileName: nonNull(stringArg()),
                fileSize: nonNull(intArg()),
                mimetype: nonNull(stringArg()),
                boardId: nonNull(intArg()),
            },
            resolve(_parent, args, context : Context, _info) : Promise<AttachFile> {
                const { fileName, fileSize, mimetype, boardId } = args;
                const { userId } = context;

                if(!userId) {
                    throw new Error("Can't create attachFile without logging in.");
                }
                
                return AttachFile.create({fileName, fileSize, mimetype, boardId}).save();
            },
        });
    },
});