import { type Task } from "wasp/entities";
import { HttpError } from "wasp/server";
import { type SendEmailWithImage } from "wasp/server/operations";
import fetch from "node-fetch";

type SendEmailArgs = {
  email: string;
  imageData: string;
};

export const sendEmailWithImage: SendEmailWithImage<
  SendEmailArgs,
  void
> = async ({ email, imageData }, context) => {
  const base64ImageData = imageData.split(",")[1]; // Remove the data:image/png;base64, part if present

  const requestBody = {
    from: { email: "hey@anxiouslove.me" },
    to: [{ email }],
    subject: "Emotional Summary",
    html: `
      <img src='cid:emotion_plot.png' alt='Emotion Plot'/>
      <p>p.s. The making of this product took 100+ hours, if you find this useful and continue offering high-quality emotional support for free, please pledge €5 from <a href="https://buy.stripe.com/4gwaFhf3Hc3T1he3cc">this link</a>.</p>
      <p>Thx✌🏽 
      -Utku</p>️
    `,
    attachments: [
      {
        filename: "emotion_plot.png",
        content: base64ImageData,
        disposition: "inline",
        content_id: "emotion_plot.png",
      },
    ],
  };


  const response = await fetch("https://api.mailersend.com/v1/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
      Authorization:
        `Bearer ${process.env.MAILERSEND_BEARER_KEY}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const responseBody = await response.text();
    console.log("Response Status:", response.status);
    console.log("Response Body:", responseBody);
    throw new HttpError(
      response.status,
      `Failed to send email: ${responseBody}`
    );
  }
};
