import BadRequestError from "../errors/badRequest.error";

const getEnv = (value: string, defaultValue?: string): string => {
  const key = process.env[value] || defaultValue;
  if (key === undefined) {
    throw new BadRequestError(`invalid or missing key: ${key}`);
  }
  return key;
};

export const JWT_ACCESS_SECRET = getEnv("JWT_ACCESS_SECRET");
export const JWT_REFRESH_SECRET = getEnv("JWT_REFRESH_SECRET");
export const NODE_ENV = getEnv("NODE_ENV");
export const REDIS_HOST_NAME = getEnv("REDIS_HOST_NAME");
export const REDIS_PASSWORD = getEnv("REDIS_PASSWORD");
export const REDIS_PORT = getEnv("REDIS_PORT");
export const RESEND_API_KEY = getEnv("RESEND_API_KEY");
export const SENDER_EMAIL = getEnv("SENDER_EMAIL");
export const BASE_URL = getEnv("BASE_URL");
