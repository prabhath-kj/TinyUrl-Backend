import express from "express";
import http from "http";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import helmet from "helmet";
import morgan from "morgan";
import * as dotenv from "dotenv";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { graphql } from "graphql";
import connectToMongodb from "./db/index.js";

dotenv.config();

//connect to mongodb
connectToMongodb();

const app = express();
const httpServer = http.createServer(app);

const server = new ApolloServer({
  typeDefs: `
    type Query{
      hello:String
    }
  `,
  resolvers: {
    Query: {
      hello: () => "hey iam here",
    },
  },
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(bodyParser.json());
app.use(helmet());
app.use(morgan("combined"));

app.use("/api",expressMiddleware(server));

mongoose.connection.once("open",async () => {
 await new Promise((resolve) =>
    httpServer.listen({ port: process.env.PORT }, resolve)

  );
  console.log(`🚀 Server ready at http://localhost:3000/`)
});
