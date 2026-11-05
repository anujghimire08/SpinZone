import { Resend } from "resend";
const api = process.env.RESEND_API_KEY;
if (!api) throw new Error("RESEND_API_KEY is missing");


export const resend = new Resend(process.env.api);
