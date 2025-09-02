const functions = require("firebase-functions");
const sendgridApiKey = process.env.SENDGRID_API_KEY;
sgMail.setApiKey(sendgridApiKey);

admin.initializeApp();

sgMail.setApiKey(functions.config().sendgrid.key);

// Send email when a new message arrives
exports.sendEmailNotification = functions.database
  .ref("/messages/{messageId}")
  .onCreate(async (snapshot, context) => {
    const message = snapshot.val();
    const msg = {
      to: "quintessentialprosup@gmail.com", // Your support inbox
      from: "support@quintessentialpromotions.com", // Must be a verified sender in SendGrid
      subject: `New Support Message from ${message.name || "Visitor"}`,
      text: message.text || "",
      html: `
        <p><strong>From:</strong> ${message.name || "Anonymous"} (${message.email || "No email"})</p>
        <p><strong>Message:</strong></p>
        <p>${message.text || ""}</p>
      `
    };
    try {
      await sgMail.send(msg);
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error);
    }
  });
