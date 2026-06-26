import express from "express";
import cors from "cors";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "./generated/prisma/client.ts";
import router from "./app/routes/index.js";

const databaseUrl = new URL(process.env.DATABASE_URL);

const adapter = new PrismaMariaDb({
  host: databaseUrl.hostname,
  port: Number(databaseUrl.port || 3306),
  user: databaseUrl.username,
  password: decodeURIComponent(databaseUrl.password),
  database: databaseUrl.pathname.replace("/", ""),
});

export const prisma = new PrismaClient({ adapter });

prisma.$connect()
  .then(() => console.log("Database connected..."))
  .catch((err) => console.log(err));

const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:8080" }));

app.use("/api", router);

export default app;
