import { ApolloServer, gql } from "apollo-server";
import { schema } from "./schema";
import { Context } from "./types/Context";
import { auth } from "./middlewares/auth";
import typeormConfig from "./typeorm.config";
import "reflect-metadata";

const boot = async () => {
	const conn = await typeormConfig.initialize();

	const server = new ApolloServer({
		schema,
		context: ({req}) : Context => {
			const token = req?.headers?.authorization ?
				auth(req.headers.authorization)
				:
				null;

			return {conn, userId: token?.userId};
		},
	});

	server.listen(5000).then(({url}) => {
		console.log(`listening on ${url}`);
	});
};

boot();
