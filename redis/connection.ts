import { createClient, RedisClientType } from "redis";
import {
  REDIS_HOST_NAME,
  REDIS_PASSWORD,
  REDIS_PORT,
} from "../src/constants/getEnv";

let client: RedisClientType | null = null;
const initializedRedisClient = async () => {
  if (!client) {
    const REDIS_URL = `redis://:${REDIS_PASSWORD}@${REDIS_HOST_NAME}:${REDIS_PORT}`;
    client = createClient({
      url: REDIS_URL,
    });
    client.on("error", (error) => console.log("Redis client error", error));
    client.on("connect", () => console.log("Redis client connected"));
    await client.connect();
  }
  return client;
};

export default initializedRedisClient;
