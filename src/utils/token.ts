import {
  accessTokenAndOptions,
  AccessTokenPayload,
  genToken,
  refreshTokenAndOptions,
  RefreshTokenPayload,
} from "./jwt";

type TokenType = (
  accessPayload: AccessTokenPayload,
  refreshPayload: RefreshTokenPayload
) => {
  accessToken: string;
  refreshToken: string;
};
const token: TokenType = (payload) => {
  const accessToken = genToken(payload);
  const refreshToken = genToken(payload, refreshTokenAndOptions);
  return { accessToken, refreshToken };
};
export default token;
