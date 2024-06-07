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
    subject: "Call Summary",
    html: `
      <p>
        hey, just so you know, this is pretty experimental.<br>
        the real charts are interactive.<br>
        and personalised for you.<br>
        just have a look.<br>
        if you want to find root causes of your anxiety,<br>
        we'll have a link to join our early access programme down below.
      </p>
      <img src='cid:emotion_plot.png' alt='Emotion Plot'/>
      <p>
        if you like this,<br>
        <a href="https://tally.so/r/mVZR5N">join our tribe </a><br>
        innovating to eradicate their anxiety and<br>
        show up in life fully.<br>
        if you have a friend or family member struggling with anxiety,<br>
        why not share this with them?<br>
        also, <a href="mailto:utkuvonarslan@gmail.com?subject=Eli%20-%20Emotional%20AI%20Feedback">send your testimonial</a>,<br>
        that also really helps.
      </p>
      <p>thx✌<br> 
        -utku
      </p>



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
