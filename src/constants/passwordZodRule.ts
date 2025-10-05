import z from "zod";

const passwordRule = z
  .string()
  .trim()
  .min(8, "Must be at least 8 characters long")
  .regex(/[A-Z]/, "Must contain at least one uppercase letter")
  .regex(/[0-9]/, "Must contain at least one number")
  .regex(/[a-z]/, "Must contain at least one lowercase letter")
  .regex(/[@#$%&*!]/, "Must contain at least one special character ");

export default passwordRule;
