import initializedRedisClient from "./connection";
import { getOtpKey } from "../src/utils/getRedisKey";
import {
  fiveMinutesFromNowInSeconds,
  tenMinutesFromNowInSeconds,
} from "../src/utils/date";
import AuthError from "../src/errors/AuthError.error";

export const storeOtp = async (otp: string, otpId: string, userId: string) => {
  const client = await initializedRedisClient();
  const key = getOtpKey(otpId);
  const ttl = tenMinutesFromNowInSeconds();
  const value = {
    userId,
    otp,
    verified: "false",
  };
  await client.hSet(key, value);
  await client.expire(key, ttl);
};

export const getRedisOtp = async (otpId: string) => {
  const client = await initializedRedisClient();
  const key = getOtpKey(otpId);
  const redisOtp = await client.hGet(key, "otp");
  if (!redisOtp) throw new AuthError("Otp expired");
  return redisOtp;
};

export const verifyOtp = async (otpId: string) => {
  const client = await initializedRedisClient();
  const key = getOtpKey(otpId);
  const ttl = fiveMinutesFromNowInSeconds();
  await client.hSet(key, "verified", "true");
  await client.expire(key, ttl);
};

export const removeOtp = async (otpId: string) => {
  const client = await initializedRedisClient();
  const key = getOtpKey(otpId);
  await client.del(key);
};

export const getOtpOptions = async (otpId: string) => {
  const client = await initializedRedisClient();
  const key = getOtpKey(otpId);
  const redisOtpData = await client.hGetAll(key);
  return { ...redisOtpData };
};
