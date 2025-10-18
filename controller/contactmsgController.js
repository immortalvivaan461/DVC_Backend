const ContactMsgModel = require("../model/contact-module");
const nodemailer = require("nodemailer");

exports.NewMsg = async (req, res) => {
    try {
        console.log("📩 Incoming form data:", req.body);

        const msg = await ContactMsgModel.create(req.body);

        // Respond immediately to avoid timeout
        res.status(200).json({
            success: true,
            msg: "Message received successfully. Email will be sent shortly.",
            data: msg,
        });

        // ✉️ Send email asynchronously
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"Deep Vegetables Company" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            subject: "New Contact Message from DVC Website",
            html: `
                <h2>New Message from Contact Form</h2>
                <p><b>Name:</b> ${req.body.name}</p>
                <p><b>Email:</b> ${req.body.email}</p>
                <p><b>Contact:</b> ${req.body.contact}</p>
                <p><b>Message:</b><br/>${req.body.message}</p>
            `,
        };

        transporter.sendMail(mailOptions)
            .then(() => console.log("✅ Email sent successfully"))
            .catch(err => console.error("❌ Email sending error:", err));

    } catch (error) {
        console.error("❌ Error saving message:", error);
        res.status(500).json({
            success: false,
            msg: error.message || "Unknown error",
        });
    }
};
