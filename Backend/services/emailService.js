const nodemailer = require('nodemailer');
require('dotenv').config();

// Simple email configuration
const EMAIL_CONFIG = {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
};

// Create transporter
const transporter = nodemailer.createTransport(EMAIL_CONFIG);

// Test transporter connection with better error handling
transporter.verify((error, success) => {
    if (error) {
        console.error('❌ Email transporter error:', error);
        console.error('❌ Check EMAIL_USER and EMAIL_PASS environment variables');
    } else {
        console.log('✅ Email server is ready to send messages');
        console.log('📧 Using email:', process.env.EMAIL_USER);
    }
});

// Simple student signup email function
async function sendStudentWelcomeEmail(studentData, password) {
    const { name, email, collegeName } = studentData;
    
    console.log('📧 Sending welcome email to:', email);
    console.log('📧 Student data:', { name, collegeName });
    
    const emailHTML = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Welcome to VEYG 2025</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0ea5e9, #3b82f6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .password-box { background: #fff3cd; border: 2px solid #ffc107; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center; }
            .password { font-family: monospace; font-size: 18px; font-weight: bold; color: #d63384; }
            .button { display: inline-block; background: #0ea5e9; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; margin: 15px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 Welcome to VEYG 2025!</h1>
                <p>Your account has been created successfully</p>
            </div>
            
            <div class="content">
                <h2>Hello ${name}! 👋</h2>
                <p>Thank you for registering for VEYG 2025. Your account is now ready!</p>
                
                <p><strong>📧 Email:</strong> ${email}</p>
                <p><strong>🏫 College:</strong> ${collegeName}</p>
                <p><strong>📅 Registration Date:</strong> ${new Date().toLocaleDateString()}</p>
                
                <div class="password-box">
                    <h3>🔐 Your Login Password</h3>
                    <p>Your password is:</p>
                    <div class="password">${password}</div>
                    <p><small>⚠️ Please change this password after your first login</small></p>
                </div>
                
                <div style="text-align: center;">
                    <a href="https://veyg-2k25.onrender.com/student-login" class="button">🚀 Login Now</a>
                </div>
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                    <h3>What's Next?</h3>
                    <ul>
                        <li>✅ Login to your account</li>
                        <li>🎮 Register for games and competitions</li>
                        <li>📱 Stay updated with announcements</li>
                        <li>🏆 Enjoy VEYG 2025!</li>
                    </ul>
                </div>
            </div>
            
            <div class="footer">
                <p><strong>VEYG 2025</strong><br>
                Saffrony Institute of Technology</p>
                <p>📧 Support: veyg.notification@gmail.com</p>
                <p><small>This is an automated message. Please do not reply.</small></p>
            </div>
        </div>
    </body>
    </html>
    `;

    const mailOptions = {
        from: '"VEYG 2025" <veyg.notification@gmail.com>',
        to: email,
        subject: '🎉 Welcome to VEYG 2025 - Your Account is Ready!',
        html: emailHTML
    };

    try {
        console.log('📤 Attempting to send email...');
        const result = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent successfully!');
        console.log('📧 Message ID:', result.messageId);
        return { success: true, messageId: result.messageId };
    } catch (error) {
        console.error('❌ Email sending failed:', error.message);
        throw error;
    }
}

module.exports = {
    sendStudentWelcomeEmail
};
