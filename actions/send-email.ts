"use server";

import React from "react";
import { Resend } from "resend";
import { render } from "@react-email/render";

export async function sendEmail({ to, subject, react }: { to: string; subject: string; react: React.ReactElement }) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not set");
  }

  const resend = new Resend(apiKey);

  try {
    const html = await render(react);

    const { data, error } = await resend.emails.send({
      from: "Finance App <onboarding@resend.dev>",
      to: "mail4jayanchinthaka@gmail.com",
      subject,
      html,
    });

    if (error) {
      throw new Error(`Resend API error: ${error.message || "Unknown error"}`);
    }

    return { success: true, data };
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
}
