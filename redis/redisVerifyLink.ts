import {
  fiveMinutesFromNowInSeconds,
  tenMinutesFromNowInSeconds,
} from "../src/utils/date";
import { getVerifyLinkKey } from "../src/utils/getRedisKey";
import initializedRedisClient from "./connection";

export const storeVerificationLink = async (
  verifyLinkId: string,
  userId: string
) => {
  const client = await initializedRedisClient();
  const key = getVerifyLinkKey(userId);
  const ttl = tenMinutesFromNowInSeconds();
  const value = {
    userId,
    verifyLinkId,
    verified: "false",
  };
  await client.hSet(key, value);
  await client.expire(key, ttl);
};

export const getSpecificRedisVerifyField = async (
  userId: string,
  field: string
) => {
  const client = await initializedRedisClient();
  const key = getVerifyLinkKey(userId);
  const value = await client.hGet(key, field);
  return value;
};
export const setVerifyTrue = async (userId: string) => {
  const client = await initializedRedisClient();
  const key = getVerifyLinkKey(userId);
  const ttl = fiveMinutesFromNowInSeconds();
  await client.hSet(key, "verified", "true");
  await client.expire(key, ttl);
};
export const removeVerificationLink = async (userId: string) => {
  const client = await initializedRedisClient();
  const key = getVerifyLinkKey(userId);
  await client.del(key);
};
export const getRedisVerifyField = async (userId: string) => {
  const client = await initializedRedisClient();
  const key = getVerifyLinkKey(userId);
  const value = await client.hGetAll(key);
  if (Object.keys(value).length === 0) {
    return null;
  }
  return value;
};
