export const generateEmailHtml = (userName = "") => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    /* Global Styling */
    body {
      font-family: Arial, sans-serif;
      background-color: #f3f4f6;
      margin: 0;
      padding: 0;
    }
    /* Responsive Design */
    @media only screen and (max-width: 600px) {
      .email-container {
        width: 95% !important;
        padding: 20px !important;
      }
      .header, .content, .footer {
        padding: 15px !important;
      }
      .button {
        padding: 12px 20px !important;
        font-size: 16px !important;
      }
      h2 {
        font-size: 24px !important;
      }
      p, h3 {
        font-size: 15px !important;
      }
    }
  </style>
</head>
<body>
  <div class="email-container" style="
      font-family: Arial, sans-serif;
      background-color: #f9fafb;
      padding: 30px;
      border-radius: 8px;
      border: 1px solid #e1e4e8;
      max-width: 600px;
      margin: auto;
    ">
    <!-- Header Section -->
    <div class="header" style="
        background-color: #2c2828;
        padding: 20px;
        border-radius: 8px;
        text-align: center;
      ">
      <h2 style="color: #ffffff; font-size: 26px; margin: 0;">
        Welcome to FashionFlick!
      </h2>
    </div>
    <!-- Content Section -->
    <div class="content" style="
        padding: 25px;
        background-color: #ffffff;
        border-radius: 8px;
        margin-top: 20px;
        text-align: center;
      ">
      <h3 style="color: #4caf50; font-size: 20px; margin-bottom: 10px;">
        Hello, ${userName || "Fashion Lover"}!
      </h3>
      <p style="color: #333; font-size: 16px; line-height: 1.6; margin-top: 0;">
        Thank you for signing up for <strong>FashionFlick</strong>! We’re thrilled to have you in our fashion-forward community. FashionFlick is your destination for the latest trends, exclusive offers, and personalized style advice.
      </p>
      <p style="color: #333; font-size: 16px; line-height: 1.6;">
        Our goal is to make you feel amazing with every purchase. If you have any questions or need assistance, our support team is here for you!
      </p>
      <p style="
          color: #4caf50;
          font-size: 16px;
          font-weight: bold;
          margin-top: 20px;
        ">
        Happy Shopping,<br />
        The FashionFlick Team
      </p>
      <div style="text-align: center; margin-top: 20px;">
        <a href="https://fashionflickshop.netlify.app" class="button" style="
            display: inline-block;
            background-color: #4caf50;
            color: #ffffff;
            text-decoration: none;
            padding: 12px 30px;
            border-radius: 5px;
            font-size: 16px;
            font-weight: bold;
          ">
          Start Shopping Now
        </a>
      </div>
    </div>
    <!-- Footer Section -->
    <div class="footer" style="
        text-align: center;
        padding-top: 15px;
        color: #888;
        font-size: 12px;
        line-height: 1.4;
        margin-top: 20px;
      ">
      <p style="margin: 0;">© 2024 FashionFlick. All Rights Reserved.</p>
      <p style="margin: 0;">
        <a href="https://fashionflickshop.netlify.app" style="color: #4caf50; text-decoration: none;">
          fashionflickshop.netlify.app
        </a>
      </p>
    </div>
  </div>
</body>
</html>
`;
