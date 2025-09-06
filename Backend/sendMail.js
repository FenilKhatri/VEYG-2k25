require("dotenv").config();
const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");

// ---------- CONFIG ----------
const EMAIL_USER = process.env.EMAIL_USER || "veyg.notification@gmail.com";
const EMAIL_PASS = process.env.EMAIL_PASS || "gmsuduskeqjiqinf";
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || "veyg.notification@gmail.com";
const ORG_NAME = process.env.ORG_NAME || "VEYG 2025";
const RECEIPTS_DIR = path.join(__dirname, "receipts");
if (!fs.existsSync(RECEIPTS_DIR)) fs.mkdirSync(RECEIPTS_DIR, { recursive: true });

// ---------- TRANSPORTER ----------
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user: EMAIL_USER, pass: EMAIL_PASS },
    tls: { rejectUnauthorized: false }
});

transporter.verify().then(() => {
    console.log("✅ Mail transporter verified.");
}).catch(err => {
    console.error("⚠️ Mail transporter verification failed:", err.message);
});

// ---------- GENERATE RECEIPT ID ----------
const generateReceiptId = () => `VEYG-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 900 + 100)}`;

// ---------- GENERATE PDF ----------
async function generateReceiptPDF(participant, game, registration, status = "Pending") {
    return new Promise(async (resolve, reject) => {
        try {
            registration.id = registration.id || generateReceiptId();
            registration.paymentStatus = status === "Confirmed" ? "Confirmed" : "Pending";

            const filename = `receipt_${registration.id}_${registration.paymentStatus}_${Date.now()}.pdf`;
            const pdfPath = path.join(RECEIPTS_DIR, filename);

            const doc = new PDFDocument({ size: "A4", margin: 50 });
            const stream = fs.createWriteStream(pdfPath);
            doc.pipe(stream);

            // Header - Horizontal Layout with Logos
            const headerY = doc.y;
            const pageWidth = doc.page.width - 100; // Account for margins
            const logoSize = 60;
            const centerX = doc.page.width / 2;
            
            // Left: College Logo placeholder
            doc.fontSize(10).fillColor("#666").text("[College Logo]", 50, headerY + 20, { width: logoSize, align: "center" });
            
            // Center: Organization Name
            doc.fontSize(20).fillColor("#0B3D91").text(ORG_NAME, centerX - 100, headerY, { width: 200, align: "center" });
            doc.fontSize(12).fillColor("#333").text("Registration Receipt", centerX - 100, headerY + 25, { width: 200, align: "center" });
            
            // Right: VEYG Logo placeholder
            doc.fontSize(10).fillColor("#666").text("[VEYG Logo]", doc.page.width - 50 - logoSize, headerY + 20, { width: logoSize, align: "center" });
            
            doc.moveDown(4);

            // Participant
            doc.fontSize(14).fillColor("#000").text("Participant Details", { underline: true });
            doc.fontSize(12).text(`Name: ${participant.name || "-"}`);
            doc.text(`Email: ${participant.email || "-"}`);
            if (participant.phone) doc.text(`Phone: ${participant.phone}`);
            if (participant.college) doc.text(`College: ${participant.college}`);
            doc.moveDown();

            // Game
            doc.fontSize(14).text("Game Details", { underline: true });
            doc.fontSize(12).text(`Game: ${game.name}`);
            if (game.date) doc.text(`Date: ${game.date}`);
            if (game.venue) doc.text(`Venue: ${game.venue}`);
            doc.moveDown();

            // Registration
            doc.fontSize(14).text("Registration Info", { underline: true });
            doc.fontSize(12).text(`Registration ID: ${registration.id}`);
            doc.text(`Amount: ₹${registration.amount}`);
            doc.text(`Status: ${registration.paymentStatus}`);
            doc.moveDown(1);

            // QR Code
            try {
                const qrPayload = { id: registration.id, name: participant.name, email: participant.email, game: game.name };
                const qrDataUrl = await QRCode.toDataURL(JSON.stringify(qrPayload));
                const qrBase64 = qrDataUrl.split(",")[1];
                const qrBuffer = Buffer.from(qrBase64, "base64");
                doc.image(qrBuffer, (doc.page.width - 110) / 2, doc.y, { width: 110 });
                doc.moveDown(6);
            } catch {
                doc.moveDown(1);
            }

            // Status Message
            if (registration.paymentStatus === "Pending") {
                doc.fontSize(16).fillColor("red").text("⚠️ Please confirm your payment to complete your registration!", { align: "center" });
            } else {
                doc.fontSize(16).fillColor("green").text("✅ Payment Confirmed — You are registered!", { align: "center" });
            }

            doc.end();

            stream.on("finish", () => resolve({ pdfPath, registration }));
            stream.on("error", reject);
        } catch (err) {
            reject(err);
        }
    });
}

// ---------- SEND EMAIL WITH RETRY ----------
async function sendMailWithRetry(mailOptions, retries = 3) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            return await transporter.sendMail(mailOptions);
        } catch (err) {
            console.warn(`⚠️ Attempt ${attempt} failed: ${err.message}`);
            if (attempt === retries) throw err;
            await new Promise(res => setTimeout(res, 1000 * attempt));
        }
    }
}

// ---------- SEND REGISTRATION EMAIL ----------
async function sendRegistrationConfirmationEmail(registrationData) {
    const participant = {
        name: registrationData.teamLeader?.fullName,
        email: registrationData.teamLeader?.email,
        phone: registrationData.teamLeader?.contactNumber,
        college: registrationData.teamLeader?.collegeName
    };
    const game = { name: registrationData.gameName, date: registrationData.gameDay, venue: "VEYG 2025 Venue" };
    const registration = { id: registrationData.registrationId || registrationData._id, amount: registrationData.totalFee };

    const { pdfPath } = await generateReceiptPDF(participant, game, registration, "Pending");

    const mailOptions = {
        from: `"${ORG_NAME}" <${EMAIL_USER}>`,
        to: participant.email,
        cc: SUPPORT_EMAIL,
        subject: `🎫 Registration Received - ${game.name}`,
        html: `
            <h2>Hi ${participant.name},</h2>
            <p>Thank you for registering for <b>${game.name}</b>.</p>
            <p><b>Registration ID:</b> ${registration.id}</p>
            <p style="color:red;"><b>Payment Pending</b></p>
            <p>Please confirm your payment to complete registration.</p>
        `,
        attachments: [{ filename: path.basename(pdfPath), path: pdfPath }]
    };

    await sendMailWithRetry(mailOptions);
    console.log(`📧 Registration email sent to ${participant.email}`);
}

// ---------- SEND PAYMENT CONFIRMATION EMAIL ----------
async function sendPaymentConfirmationEmail(registrationData) {
    const participant = {
        name: registrationData.teamLeader?.fullName,
        email: registrationData.teamLeader?.email,
        phone: registrationData.teamLeader?.contactNumber,
        college: registrationData.teamLeader?.collegeName
    };
    const game = { name: registrationData.gameName, date: registrationData.gameDay, venue: "VEYG 2025 Venue" };
    const registration = { id: registrationData.registrationId || registrationData._id, amount: registrationData.totalFee };

    const { pdfPath } = await generateReceiptPDF(participant, game, registration, "Confirmed");

    // Create array of all participant emails (team leader + team members)
    const allParticipantEmails = [participant.email];
    
    // Add team member emails if they exist
    if (registrationData.teamMembers && Array.isArray(registrationData.teamMembers)) {
        registrationData.teamMembers.forEach(member => {
            if (member.email && member.email !== participant.email) {
                allParticipantEmails.push(member.email);
            }
        });
    }

    const mailOptions = {
        from: `"${ORG_NAME}" <${EMAIL_USER}>`,
        to: allParticipantEmails,
        cc: SUPPORT_EMAIL,
        subject: `✅ Payment Confirmed - ${game.name}`,
        html: `
            <h2>Hi ${participant.name},</h2>
            <p>Your payment has been <b style="color:green;">successfully completed</b>.</p>
            <p>🎉 You are successfully registered!</p>
            <p><b>After completing the payment, please go to the Registered Games tab and download your official receipt.</b></p>
            <p>Visit our website and navigate to the Registered Games section to access your official receipt in PDF format.</p>
        `
    };

    const info = await sendMailWithRetry(mailOptions);
    console.log(`📧 Payment confirmation email sent to ${participant.email} (msgId=${info.messageId})`);
}

module.exports = {
    sendRegistrationConfirmationEmail,
    sendPaymentConfirmationEmail
};