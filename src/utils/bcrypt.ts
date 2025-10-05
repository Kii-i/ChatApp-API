import bcrypt from "bcrypt";

export const hashPassword = async (password: string) =>
  await bcrypt.hash(password, 10);
export const comparePassword = async (hashedPass: string, plainPass: string) =>
  await bcrypt.compare(plainPass, hashedPass).catch(() => false);
