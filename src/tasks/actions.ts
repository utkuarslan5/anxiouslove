import { HttpError } from "wasp/server";
import { type SendEmailWithImage, type AddChatGroupId } from "wasp/server/operations";
import axios from "axios";

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

  try {
    const response = await axios.post(
      "https://api.mailersend.com/v1/email",
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          Authorization: `Bearer ${process.env.MAILERSEND_BEARER_KEY}`,
        },
      }
    );
  } catch (error: any) {
    console.log("Response Status:", error.response.status);
    console.log("Response Body:", error.response.data);
    throw new HttpError(
      error.response.status,
      `Failed to send email: ${error.response.data}`
    );
  }
};
type AddChatGroupIdArgs = {
  chatGroupId: string;
};
export const addChatGroupId: AddChatGroupId<AddChatGroupIdArgs, void> = async (
  { chatGroupId },
  context
) => {
  const user = context.user;
  if (!user) {
    throw new HttpError(404, "User not found");
  }

  await context.entities.User.update({
    where: { id: user.id },
    data: { chatGroupId: chatGroupId },
  });
};
