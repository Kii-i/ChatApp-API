export const getRefreshKey = (userId: string) => `refreshToken:user:${userId}`;
export const getOtpKey = (otpId: string) => `otp:id:${otpId}`;
export const getVerifyLinkKey = (userId: string) => `verifyLink:user:${userId}`;
