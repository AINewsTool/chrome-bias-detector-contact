// api/send-email.js
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, reason, message } = req.body;

  if (!name || !email || !reason || !message) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const msg = {
    to: "truscope.help@gmail.com",      // Your inbox
    from: "support@truscope.app",       // Verified in SendGrid
    replyTo: email,
    subject: `Contact Form: ${reason} from ${name}`,
    html: `
      <p><strong>From:</strong> ${name} (${email})</p>
      <p><strong>Reason:</strong> ${reason}</p>
      <hr>
      <p>${message.replace(/\n/g, "<br>")}</p>
    `,
  };

  try {
    await sgMail.send(msg);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("SendGrid error:", err);
    res.status(500).json({ error: err.message });
  }
}
