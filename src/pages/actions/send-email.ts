import type { APIRoute } from "astro";
import { sendEmail } from "../../utils/email.ts";

export const prerender = false;

export const POST: APIRoute = async ({ request, redirect }) => {
  // Get the form data submitted by the user on the home page
  const formData = await request.formData();
  const name = formData.get("name") as string | null;
  const email = formData.get("email") as string | null;
  const message = formData.get("message") as string | null;

  // Throw an error if we're missing any of the needed fields.
  if (!name || !email || !message) {
    throw new Error(`Missing required fields: ${name}, ${email}, ${message}`);
  }

  // Try to send the email using a `sendEmail` function we'll create next. Throw
  // an error if it fails.
  try {
    const html = `<div>${message}</div>`;
    console.log({ name, email, html });
    await sendEmail({ name, email, html });
  } catch (error) {
    throw new Error("Failed to send email");
  }

  return new Response(JSON.stringify({ success: true, message }), { status: 200 });
  // Redirect the user to a success page after the email is sent.
  // return redirect("/success");
};