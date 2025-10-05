import { NODE_ENV, SENDER_EMAIL } from "../constants/getEnv";
import resend from "../constants/resendConfig";

type sendEMailParameterType = {
  to: string;
  subject: string;
  text?: string;
  html: string;
};

const getFromEmail = () =>
  NODE_ENV === "development" ? "onboarding@resend.dev" : SENDER_EMAIL;
const getToEmail = (email: string) =>
  NODE_ENV === "development" ? "delivered@resend.dev" : email;

const sendEmail = async ({ to, subject, text, html }: sendEMailParameterType) =>
  await resend.emails.send({
    from: getFromEmail(),
    to: getToEmail(to),
    text,
    subject,
    html,
  });

export default sendEmail;
