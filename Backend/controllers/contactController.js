const Contact = require('../models/Contact')
const nodemailer = require('nodemailer')
require('dotenv').config()

// Send contact form notification email to admin
const sendContactNotificationEmail = async (contactData) => {
  try {
    console.log('📧 Setting up email transporter for admin notification...');
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verify transporter configuration
    console.log('📧 Verifying email transporter...');
    await transporter.verify();
    console.log('✅ Email transporter verified successfully');

    const mailOptions = {
      from: `"VEYG 2025 Contact Form" <${process.env.EMAIL_USER}>`,
      to: 'veyg.notification@gmail.com', // Hardcoded to ensure delivery
      subject: `New Contact Form Submission - ${contactData.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #007bff 0%, #0056b3 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">New Contact Form Submission</h1>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-top: 0;">Contact Details</h2>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 10px 0;"><strong>Name:</strong> ${contactData.username}</p>
              <p style="margin: 10px 0;"><strong>Email:</strong> ${contactData.email}</p>
              <p style="margin: 10px 0;"><strong>Subject:</strong> ${contactData.subject}</p>
              <p style="margin: 10px 0;"><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
            </div>
            
            <h3 style="color: #333; margin-top: 30px;">Message:</h3>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #007bff;">
              <p style="margin: 0; line-height: 1.6; white-space: pre-wrap;">${contactData.message}</p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="color: #666; font-size: 14px; margin: 0;">
              This is an automated notification from the VEYG 2025 contact form.
              Please respond to the user at: <a href="mailto:${contactData.email}" style="color: #007bff;">${contactData.email}</a>
            </p>
          </div>
        </div>
      `,
    };

    console.log('📧 Sending admin notification email...');
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Admin notification email sent successfully');
    console.log('Email result:', result.messageId);
  } catch (error) {
    console.error('❌ Error sending contact notification email:', error);
    console.error('Error details:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
    throw error; // Re-throw to be caught by the calling function
  }
};

// Send auto-reply email to user
const sendAutoReplyEmail = async (contactData) => {
  try {
    console.log('📧 Setting up email transporter for user auto-reply...');
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verify transporter configuration
    await transporter.verify();
    console.log('✅ User email transporter verified successfully');

    const mailOptions = {
      from: `"VEYG 2025 Team" <${process.env.EMAIL_USER}>`,
      to: contactData.email,
      subject: 'Thank you for contacting VEYG 2025!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Thank You!</h1>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-top: 0;">Hello ${contactData.username}!</h2>
            
            <p style="color: #555; line-height: 1.6; font-size: 16px;">
              Thank you for reaching out to us! We have received your message and our team will review it shortly.
            </p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">What happens next?</h3>
              <ul style="color: #555; line-height: 1.6;">
                <li>Our team will review your message within 24 hours</li>
                <li>You'll receive a personalized response from our support team</li>
                <li>For urgent matters, you can also reach us at ${process.env.SUPPORT_EMAIL || 'veyg.notification@gmail.com'}</li>
              </ul>
            </div>
            
            <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; border-left: 4px solid #2196f3; margin: 20px 0;">
              <h4 style="color: #1976d2; margin-top: 0;">Your Message Summary:</h4>
              <p style="color: #555; margin: 0; font-style: italic;">"${contactData.message.substring(0, 150)}${contactData.message.length > 150 ? '...' : ''}"</p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="color: #888; font-size: 14px; text-align: center;">
              Best regards,<br>
              <strong>VEYG 2025 Team</strong><br>
              <a href="mailto:${process.env.SUPPORT_EMAIL || 'veyg.notification@gmail.com'}" style="color: #28a745;">${process.env.SUPPORT_EMAIL || 'veyg.notification@gmail.com'}</a>
            </p>
          </div>
        </div>
      `,
    };

    console.log('📧 Sending user auto-reply email...');
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ User auto-reply email sent successfully');
    console.log('Email result:', result.messageId);
  } catch (error) {
    console.error('❌ Error sending auto-reply email:', error);
    console.error('Error details:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
    throw error; // Re-throw to be caught by the calling function
  }
};

// Handle contact form submission
const submitContactForm = async (req, res) => {
  try {
    const { username, email, subject, message } = req.body;

    // Validate required fields
    if (!username || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Validate message length
    if (message.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Message must be at least 10 characters long'
      });
    }

    // Create new contact entry
    const contact = new Contact({
      username: username.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim()
    });

    await contact.save();

    console.log('✅ Contact form submission saved to database');

    // Send notification email to admin (non-blocking)
    setImmediate(async () => {
      try {
        console.log('📧 Attempting to send contact notification email to admin...');
        await sendContactNotificationEmail(contact);
        console.log('✅ Contact notification email sent to admin successfully');
      } catch (error) {
        console.error('❌ Error sending contact notification email:', error);
        console.error('Error details:', error.message);
      }
    });

    // Send auto-reply email to user (non-blocking)
    setImmediate(async () => {
      try {
        console.log('📧 Attempting to send auto-reply email to user...');
        await sendAutoReplyEmail(contact);
        console.log('✅ Auto-reply email sent to user successfully');
      } catch (error) {
        console.error('❌ Error sending auto-reply email:', error);
        console.error('Error details:', error.message);
      }
    });

    res.status(200).json({
      success: true,
      message: 'Message sent successfully! We\'ll get back to you soon.'
    });

  } catch (error) {
    console.error('Contact form submission error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: errors.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to process message. Please try again later.'
    });
  }
};

// Get all contact form submissions (admin only)
const getAllContacts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    
    const query = {};
    if (status && ['pending', 'read', 'replied'].includes(status)) {
      query.status = status;
    }

    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Contact.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        contacts,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });

  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contacts'
    });
  }
};

// Update contact status (admin only)
const updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    if (!['pending', 'read', 'replied'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const contact = await Contact.findByIdAndUpdate(
      id,
      { status, adminNotes },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.status(200).json({
      success: true,
      data: contact
    });

  } catch (error) {
    console.error('Update contact status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update contact status'
    });
  }
};

module.exports = {
  submitContactForm,
  getAllContacts,
  updateContactStatus
};
