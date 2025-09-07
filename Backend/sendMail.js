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

// ---------- SEND EMAIL WITH RETRY AND TIMEOUT ----------
async function sendMailWithRetry(mailOptions, retries = 3, timeoutMs = 30000) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            // Create a timeout promise
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error(`Email sending timeout after ${timeoutMs}ms`)), timeoutMs);
            });
            
            // Race between email sending and timeout
            return await Promise.race([
                transporter.sendMail(mailOptions),
                timeoutPromise
            ]);
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

    // Collect ALL participant emails with enhanced validation
    const allParticipantEmails = new Set(); // Use Set to automatically handle duplicates
    const participantDetails = []; // Store participant details for logging

    // Add team leader email
    if (participant.email && participant.email.trim()) {
        const cleanEmail = participant.email.trim().toLowerCase();
        allParticipantEmails.add(cleanEmail);
        participantDetails.push({
            name: participant.name,
            email: cleanEmail,
            role: 'Team Leader'
        });
    }

    // Add all team member emails with enhanced validation
    if (registrationData.teamMembers && Array.isArray(registrationData.teamMembers)) {
        registrationData.teamMembers.forEach((member, index) => {
            if (member.email && member.email.trim()) {
                const cleanEmail = member.email.trim().toLowerCase();
                if (!allParticipantEmails.has(cleanEmail)) {
                    allParticipantEmails.add(cleanEmail);
                    participantDetails.push({
                        name: member.fullName || `Team Member ${index + 1}`,
                        email: cleanEmail,
                        role: 'Team Member'
                    });
                }
            } else {
                console.warn('⚠️ Team member missing email:', member.fullName || `Member ${index + 1}`);
            }
        });
    }

    // Convert Set back to Array
    const emailList = Array.from(allParticipantEmails);

    // Fallback: if no emails found, fail fast
    if (emailList.length === 0) {
        console.error("❌ No valid participant emails found for registration:", registration.id);
        console.error("Registration data:", JSON.stringify(registrationData, null, 2));
        throw new Error("No valid participant emails found to send confirmation.");
    }


    const mailOptions = {
        from: `"${ORG_NAME}" <${EMAIL_USER}>`,
        to: emailList,
        cc: ['veyg.notification@gmail.com', SUPPORT_EMAIL].filter(Boolean), // Add both notification email and support email
        subject: `🎉 Registration Successful - ${game.name}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <h2 style="color: #0B3D91; text-align: center; margin-bottom: 30px;">🎉 Thank You for Registering!</h2>
                    
                    <p style="font-size: 16px; color: #333;">Hi <strong>${participant.name}</strong>,</p>
                    
                    <p style="font-size: 16px; color: #333; line-height: 1.6;">
                        Thank you for registering for <strong>${game.name}</strong> at VEYG 2025! Download your receipt from official website. 
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
                            To confirm your seat and complete your registration, please make the payment as soon as possible by showing your registered id. 
                            Your registration will be confirmed once payment is received.
                        </p>
                    </div>
                    
                    <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
                        <h3 style="color: #856404; margin: 0 0 10px 0;">👥 All Team Participants</h3>
                        <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.6;">
                            This registration confirmation has been sent to all ${emailList.length} team participants:
                        </p>
                        <ul style="margin: 10px 0 0 20px; color: #856404; font-size: 14px;">
                            ${participantDetails.map(p => `<li><strong>${p.name}</strong> (${p.role}) - ${p.email}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <p style="font-size: 14px; color: #666; margin-top: 30px;">
                        <strong>Note:</strong> This registration confirmation has been sent to all team participants and copied to veyg.notification@gmail.com for record keeping.
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

    try {
        const info = await sendMailWithRetry(mailOptions);
        console.log(`✅ Registration confirmation email sent successfully!`);
        return info;
    } catch (emailError) {
        console.error('❌ Failed to send registration confirmation email:', emailError);
        throw new Error(`Failed to send registration confirmation email: ${emailError.message}`);
    }
}

// ---------- SEND PAYMENT CONFIRMATION EMAIL ----------
async function sendPaymentConfirmationEmail(registrationData) {
    const participant = {
        name: registrationData.teamLeader?.fullName || 'Participant',
        email: registrationData.teamLeader?.email,
        phone: registrationData.teamLeader?.contactNumber,
        college: registrationData.teamLeader?.collegeName || 'Unknown College'
    };
    const game = { name: registrationData.gameName, date: registrationData.gameDay, venue: "VEYG 2025 Venue" };
    const registration = { id: registrationData.registrationId || registrationData._id, amount: registrationData.totalFee };

    // Collect ALL participant emails with enhanced validation
    const allParticipantEmails = new Set(); // Use Set to automatically handle duplicates
    const participantDetails = []; // Store participant details for logging

    // Add team leader email
    if (participant.email && participant.email.trim()) {
        const cleanEmail = participant.email.trim().toLowerCase();
        allParticipantEmails.add(cleanEmail);
        participantDetails.push({
            name: participant.name,
            email: cleanEmail,
            role: 'Team Leader'
        });
    }

    // Add all team member emails with enhanced validation
    if (registrationData.teamMembers && Array.isArray(registrationData.teamMembers)) {
        registrationData.teamMembers.forEach((member, index) => {
            if (member.email && member.email.trim()) {
                const cleanEmail = member.email.trim().toLowerCase();
                if (!allParticipantEmails.has(cleanEmail)) {
                    allParticipantEmails.add(cleanEmail);
                    participantDetails.push({
                        name: member.fullName || `Team Member ${index + 1}`,
                        email: cleanEmail,
                        role: 'Team Member'
                    });
                }
            } else {
                console.warn('⚠️ Team member missing email:', member.fullName || `Member ${index + 1}`);
            }
        });
    }

    // Convert Set back to Array
    const emailList = Array.from(allParticipantEmails);

    if (emailList.length === 0) {
        throw new Error("No valid participant emails found to send payment confirmation.");
    }


    const paymentMailOptions = {
        from: `"${ORG_NAME}" <${EMAIL_USER}>`,
        to: emailList,
        cc: ['veyg.notification@gmail.com', SUPPORT_EMAIL].filter(Boolean), // Add both notification email and support email
        subject: `✅ Payment Confirmed - ${game.name}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <h2 style="color: #28a745; text-align: center; margin-bottom: 30px;">✅ Payment Confirmed!</h2>
                    
                    <p style="font-size: 16px; color: #333;">Hi <strong>${participant.name}</strong>,</p>
                    
                    <p style="font-size: 16px; color: #333; line-height: 1.6;">
                        Great news! Your payment for <strong>${game.name}</strong> has been <strong style="color: #28a745;">successfully confirmed</strong>. 🎉
                        Your registration is now complete and your seat is secured!
                    </p>
                    
                    <div style="background-color: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
                        <p style="margin: 0; font-size: 16px;"><strong>Registration ID:</strong> ${registration.id}</p>
                        <p style="margin: 10px 0 0 0; font-size: 16px;"><strong>Game:</strong> ${game.name}</p>
                        <p style="margin: 10px 0 0 0; font-size: 16px;"><strong>Amount Paid:</strong> ₹${registration.amount || 0}</p>
                        <p style="margin: 10px 0 0 0; font-size: 16px;"><strong>Status:</strong> <span style="color: #28a745; font-weight: bold;">CONFIRMED</span></p>
                    </div>
                    
                    <div style="background-color: #cce7ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #007bff;">
                        <h3 style="color: #0056b3; margin: 0 0 10px 0;">📄 Download Your Receipt</h3>
                        <p style="margin: 0; color: #0056b3; font-size: 16px; line-height: 1.6;">
                            Please download your official receipt from the VEYG 2025 website. Login to your account and visit your registrations page to download your confirmed receipt.
                        </p>
                        <div style="text-align: center; margin-top: 15px;">
                            <a href="https://veyg-2k25-frontend.onrender.com/" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                                🌐 Visit VEYG Website
                            </a>
                        </div>
                    </div>
                    
                    <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
                        <h3 style="color: #856404; margin: 0 0 10px 0;">👥 All Team Participants</h3>
                        <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.6;">
                            This confirmation email has been sent to all ${emailList.length} team participants:
                        </p>
                        <ul style="margin: 10px 0 0 20px; color: #856404; font-size: 14px;">
                            ${participantDetails.map(p => `<li><strong>${p.name}</strong> (${p.role}) - ${p.email}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <p style="font-size: 14px; color: #666; margin-top: 30px;">
                        <strong>Note:</strong> This confirmation email has been sent to all team participants and copied to veyg.notification@gmail.com for record keeping.
                    </p>
                    
                    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                        <p style="color: #666; font-size: 14px;">
                            For any queries, contact us at: <a href="mailto:${SUPPORT_EMAIL}" style="color: #007bff;">${SUPPORT_EMAIL}</a>
                        </p>
                        <p style="color: #007bff; font-weight: bold; margin: 10px 0 0 0;">VEYG 2025 Team</p>
                    </div>
                </div>
            </div>
        `
    };

    try {
        const info = await sendMailWithRetry(paymentMailOptions);
        return info;
    } catch (emailError) {
        throw new Error(`Failed to send payment confirmation email: ${emailError.message}`);
    }
}

module.exports = {
    generateReceiptPDF,
    sendRegistrationConfirmationEmail,
    sendPaymentConfirmationEmail,
    serveReceiptHandler
};