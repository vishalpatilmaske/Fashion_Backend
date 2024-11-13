export const generateSigninEmailHtml = () => `
  <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; max-width: 600px; margin: 0 auto; background-color: #f4f4f4;">
    <div style="background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
      <h2 style="color: #2C3E50; font-size: 24px; text-align: center;">Welcome Back to FashionFlick!</h2>
      <p style="font-size: 16px; line-height: 1.5; text-align: center; color: #555;">Hi there,</p>
      <p style="font-size: 16px; line-height: 1.5; color: #555; text-align: center;">We noticed a new sign-in to your FashionFlick account. If this was you, great! If not, please reset your password immediately.</p>
      <p style="font-size: 16px; line-height: 1.5; text-align: center; color: #555;">Best Regards, <br/> The FashionFlick Team</p>
    </div>
  </div>
  <style>
    @media screen and (max-width: 600px) {
      h2 {
        font-size: 22px !important;
      }
      p {
        font-size: 14px !important;
      }
      .container {
        padding: 10px;
      }
    }
  </style>
`;
