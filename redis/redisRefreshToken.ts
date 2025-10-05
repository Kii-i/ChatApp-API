import initializedRedisClient from "./connection";
import AuthError from "../src/errors/AuthError.error";
import { thirtyDaysFromNowInSeconds } from "../src/utils/date";
import { getRefreshKey } from "../src/utils/getRedisKey";
import { removeOtp } from "./redisOtp";
type StoreRefreshToken = (
  refreshToken: string,
  userId: string
) => Promise<void>;
type getRefreshTokenType = (userId: string) => Promise<string>;

export const storeRefreshToken: StoreRefreshToken = async (
  refreshToken,
  userId
) => {
  const client = await initializedRedisClient();
  const key = getRefreshKey(userId);
  const ttl = thirtyDaysFromNowInSeconds();
  await client.setEx(key, ttl, refreshToken);
};

export const getRefreshToken: getRefreshTokenType = async (userId) => {
  const client = await initializedRedisClient();
  const key = getRefreshKey(userId);
  const refreshToken = await client.get(key);
  if (!refreshToken)
    throw new AuthError("Access denied: refresh token not found");
  return refreshToken;
};

export const removeRefreshToken = async (userId: string) => {
  const client = await initializedRedisClient();
  const key = getRefreshKey(userId);
  await client.del(key);
};
