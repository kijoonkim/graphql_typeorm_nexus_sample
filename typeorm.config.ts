import { DataSource } from "typeorm";
import dotenv from "dotenv";
import {Board} from "./entities/Board";
import {AttachFile} from "./entities/AttachFile";
import {User} from "./entities/User";

dotenv.config();

export default new DataSource({
    type: "postgres",
    url: process.env.CONNECTION_STRING,
    entities: [Board, AttachFile, User],
    synchronize: true,
    logging: true,
});
