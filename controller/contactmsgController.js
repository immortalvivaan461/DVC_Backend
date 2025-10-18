const ContactMsgModel = require("../model/contact-module");
const nodemailer = require("nodemailer");

exports.NewMsg = async (req, res) => {
    try {
        console.log("📩 Incoming form data:", req.body);

        const msg = await ContactMsgModel.create(req.body);

        // ✉️ Setup transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // 📦 Email details
        const mailOptions = {
            from: `"Deep Vegetables Company" <${process.env.EMAIL_USER}>`,
            to: "iamvivaan461@gmail.com", // your company email
            subject: "New Contact Message from DVC Website",
            html: `
        <h2>New Message from Contact Form</h2>
        <p><b>Name:</b> ${req.body.name}</p>
        <p><b>Email:</b> ${req.body.email}</p>
        <p><b>Contact:</b> ${req.body.contact}</p>
        <p><b>Message:</b><br/>${req.body.message}</p>
      `,
        };

        // 🚀 Send email
        await transporter.sendMail(mailOptions);

        res.status(200).json({
            success: true,
            msg: "Message sent successfully and email delivered.",
            data: msg,
        });
    } catch (error) {
        console.error("❌ Error saving or sending email:", error);
        res.status(500).json({
            success: false,
            msg: error.message || "Unknown error",
        });
    }
};
