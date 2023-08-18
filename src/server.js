import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import * as dotenv from "dotenv";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import connectToMongodb from "./db/index.js";
import resolvers from "./graphql/resolvers.js";

dotenv.config();

//connect to mongodb
connectToMongodb();

async function init(){
  const app = express();
  const server = new ApolloServer({
    typeDefs:`
    type URL {
      id: ID!
      originalUrl: String!
      shortCode: String!
      analytics: URLAnalytics
    }
    type UrlResponse {
      originalUrl: String
      shortCode: String
      error: String
    }
    type URLAnalytics {
      clicks: Int
      lastClickedAt: String
    }
    
    type Query {
      urls: [URL]
    }
    
    type Mutation {
      createUrl(originalUrl: String!): UrlResponse
      trackClick(shortCode: String!): Int
    }  
   `,
    resolvers
  });
  
  await server.start();
  
  // Middleware
  app.use(cors({ origin: "*" }));
  app.use(express.json());
  app.use(bodyParser.json());
  app.use(morgan("combined"));
  app.use("/api",expressMiddleware(server));
  
  mongoose.connection.once("open",async () => {
      app.listen(process.env.PORT, ()=>{
        console.log(`🚀 Server ready at http://localhost:3000/api`)
      })    
  });
  
}

init()
