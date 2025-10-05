import z from "zod";

export const AcceptRejectSchema = z.preprocess(
  (value) => (typeof value === "string" ? value.toLowerCase() : value),
  z.enum(["accepted", "rejected"])
);
