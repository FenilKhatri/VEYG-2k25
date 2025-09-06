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

// ---------- SERVE RECEIPT HANDLER ----------
function serveReceiptHandler(req, res) {
    try {
        const filename = path.basename(req.params.filename);
        const filePath = path.join(RECEIPTS_DIR, filename);
        if (!fs.existsSync(filePath)) {
            return res.status(404).send("Receipt not found");
        }
        return res.download(filePath, filename, err => {
            if (err && !res.headersSent) {
                console.error("Error sending file:", err);
                return res.status(500).send("Error sending file");
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send("Server error");
    }
}

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

            // Header - Horizontal Layout
            const headerY = doc.y;
            const pageWidth = doc.page.width;
            const margin = 50;
            
            // Create horizontal header with gradient background
            doc.rect(0, headerY, pageWidth, 80).fillAndStroke('#4A90E2', '#0B3D91');
            
            // Left Logo placeholder
            doc.fontSize(10).fillColor("#FFFFFF").text("[College Logo]", margin, headerY + 30, { width: 80, align: "center" });
            
            // Center content - Saffrony Institute of Technology
            const centerStart = margin + 100;
            const centerWidth = pageWidth - 200 - (2 * margin);
            doc.fontSize(24).fillColor("#FFFFFF").text("Saffrony Institute of Technology", centerStart, headerY + 15, { width: centerWidth, align: "center" });
            doc.fontSize(12).fillColor("#FFFFFF").text("📍 Location: Linch, Mehsana", centerStart, headerY + 45, { width: centerWidth, align: "center" });
            doc.fontSize(14).fillColor("#FFFFFF").text("Official Payment Receipt", centerStart, headerY + 62, { width: centerWidth, align: "center" });
            
            // Right Logo placeholder
            doc.fontSize(10).fillColor("#FFFFFF").text("[VEYG Logo]", pageWidth - margin - 80, headerY + 30, { width: 80, align: "center" });
            
            // Reset fill color and move down
            doc.fillColor("#000000");
            doc.y = headerY + 100;

            // Participant
            doc.fontSize(14).fillColor("#000").text("Participant Details", { underline: true });
            doc.fontSize(12).text(`Name: ${participant.name || "-"}`);
            doc.text(`Email: ${participant.email || "-"}`);
            if (participant.phone) doc.text(`Phone: ${participant.phone}`);
            if (participant.college) doc.text(`College: ${participant.college}`);
            doc.moveDown();

            // Game
            doc.fontSize(14).text("Game Details", { underline: true });
            doc.fontSize(12).text(`Game: ${game.name || "-"}`);
            if (game.date) doc.text(`Date: ${game.date}`);
            if (game.venue) doc.text(`Venue: ${game.venue}`);
            doc.moveDown();

            // Registration
            doc.fontSize(14).text("Registration Info", { underline: true });
            doc.fontSize(12).text(`Registration ID: ${registration.id}`);
            doc.text(`Amount: ₹${registration.amount || 0}`);
            doc.text(`Status: ${status === "Confirmed" ? "Confirmed" : "Pending"}`);
            doc.moveDown(1);

            // QR Code
            try {
                const qrPayload = { id: registration.id, name: participant.name, email: participant.email, game: game.name };
                const qrDataUrl = await QRCode.toDataURL(JSON.stringify(qrPayload));
                const qrBase64 = qrDataUrl.split(",")[1];
                const qrBuffer = Buffer.from(qrBase64, "base64");
                doc.image(qrBuffer, (doc.page.width - 110) / 2, doc.y, { width: 110 });
                doc.moveDown(6);
            } catch (err) {
                doc.moveDown(1);
            }

            // Status Message
            if (status === "Confirmed") {
                doc.fontSize(16).fillColor("green").text("✅ Payment Confirmed — You are registered!", { align: "center" });
            } else {
                doc.fontSize(16).fillColor("red").text("⚠️ Please confirm your payment to complete your registration!", { align: "center" });
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

    // No PDF attachment needed for registration confirmation email
    console.log('📄 Sending registration confirmation without PDF attachment');

    // Collect ALL participant emails (team leader + all team members)
    const allParticipantEmails = [];

    // Add team leader email
    if (participant.email) {
        allParticipantEmails.push(participant.email);
    }

    // Add all team member emails
    if (registrationData.teamMembers && Array.isArray(registrationData.teamMembers)) {
        registrationData.teamMembers.forEach(member => {
            if (member.email && !allParticipantEmails.includes(member.email)) {
                allParticipantEmails.push(member.email);
            }
        });
    }

    // Fallback: if no emails found, fail fast
    if (allParticipantEmails.length === 0) {
        console.warn("⚠️ No participant emails found for registration:", registration.id);
        throw new Error("No participant emails found to send confirmation.");
    }

    const mailOptions = {
        from: `"${ORG_NAME}" <${EMAIL_USER}>`,
        to: allParticipantEmails,
        cc: SUPPORT_EMAIL,
        subject: `🎉 Registration Successful - ${game.name}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <h2 style="color: #0B3D91; text-align: center; margin-bottom: 30px;">🎉 Thank You for Registering!</h2>
                    
                    <p style="font-size: 16px; color: #333;">Hi <strong>${participant.name}</strong>,</p>
                    
                    <p style="font-size: 16px; color: #333; line-height: 1.6;">
                        Thank you for registering for <strong>${game.name}</strong> at VEYG 2025! 
                        We're excited to have you participate in this amazing event.
                    </p>
                    
                    <div style="background-color: #f0f8ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0B3D91;">
                        <p style="margin: 0; font-size: 16px;"><strong>Registration ID:</strong> ${registration.id}</p>
                        <p style="margin: 10px 0 0 0; font-size: 16px;"><strong>Game:</strong> ${game.name}</p>
                        <p style="margin: 10px 0 0 0; font-size: 16px;"><strong>Amount:</strong> ₹${registration.amount || 0}</p>
                    </div>
                    
                    <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
                        <h3 style="color: #856404; margin: 0 0 10px 0;">💳 Next Step: Complete Your Payment</h3>
                        <p style="margin: 0; color: #856404; font-size: 16px; line-height: 1.6;">
                            To confirm your seat and complete your registration, please make the payment as soon as possible. 
                            Your registration will be confirmed once payment is received.
                        </p>
                    </div>
                    
                    <p style="font-size: 14px; color: #666; margin-top: 30px;">
                        <strong>Note:</strong> This email has been sent to all team participants.
                    </p>
                    
                    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                        <p style="color: #666; font-size: 14px;">
                            For any queries, contact us at: <a href="mailto:${SUPPORT_EMAIL}" style="color: #0B3D91;">${SUPPORT_EMAIL}</a>
                        </p>
                        <p style="color: #0B3D91; font-weight: bold; margin: 10px 0 0 0;">VEYG 2025 Team</p>
                    </div>
                </div>
            </div>
        `
    };

    const info = await sendMailWithRetry(mailOptions);
    console.log(`📧 Registration email sent to ${allParticipantEmails.length} participants: ${allParticipantEmails.join(', ')} (msgId=${info.messageId})`);
    return info;
}

// ---------- SEND PAYMENT CONFIRMATION EMAIL ----------
async function sendPaymentConfirmationEmail(registrationData) {
    const participant = {
        name: registrationData.teamLeader?.fullName,
        email: registrationData.teamLeader?.email,
        phone: registrationData.teamLeader?.contactNumber,
        college: registrationData.teamLeader?.collegeName
    };
    const game = { name: registrationData.gameName, date: registrationData.gameDay };
    const registration = { id: registrationData.registrationId || registrationData._id, amount: registrationData.totalFee };

    // Generate new PDF with "Confirmed" status and updated header
    console.log('📄 Generating payment confirmation PDF with new header layout...');
    
    try {
        const pdfResult = await generateReceiptPDF(participant, game, registration, "Confirmed");
        const pdfPath = pdfResult.pdfPath;
        
        // Update registration with new PDF path
        registrationData.pdfPath = pdfPath;
        
        console.log('✅ Payment confirmation PDF generated:', pdfPath);
    } catch (pdfError) {
        console.error('❌ Failed to generate payment confirmation PDF:', pdfError);
        throw new Error('Failed to generate payment confirmation receipt.');
    }

    // Collect ALL participant emails (team leader + all team members)
    const allParticipantEmails = [];

    // Add team leader email
    if (participant.email) {
        allParticipantEmails.push(participant.email);
    }

    // Add all team member emails
    if (registrationData.teamMembers && Array.isArray(registrationData.teamMembers)) {
        registrationData.teamMembers.forEach(member => {
            if (member.email && !allParticipantEmails.includes(member.email)) {
                allParticipantEmails.push(member.email);
            }
        });
    }

    if (allParticipantEmails.length === 0) {
        console.warn("⚠️ No participant emails found for payment confirmation:", registration.id);
        throw new Error("No participant emails found to send payment confirmation.");
    }

    const paymentMailOptions = {
        from: `"${ORG_NAME}" <${EMAIL_USER}>`,
        to: allParticipantEmails,
        cc: SUPPORT_EMAIL,
        subject: `✅ Payment Confirmed - ${game.name}`,
        html: `
            <h2>Hi ${participant.name},</h2>
            <p>Your payment has been <b style="color:green;">successfully completed</b>. 🎉</p>
            <p><b>Your original registration receipt is attached to this email.</b></p>
            <p>You can also download the receipt from our website.</p>
            <p>If you have any questions, contact: ${SUPPORT_EMAIL}</p>
        `,
        attachments: [{ filename: path.basename(registrationData.pdfPath), path: registrationData.pdfPath }]
    };

    const info = await sendMailWithRetry(paymentMailOptions);
    console.log(`📧 Payment confirmation email sent to ${allParticipantEmails.length} participants: ${allParticipantEmails.join(', ')} (msgId=${info.messageId})`);
    return info;
}

module.exports = {
    generateReceiptPDF,
    sendRegistrationConfirmationEmail,
    sendPaymentConfirmationEmail,
    serveReceiptHandler
};