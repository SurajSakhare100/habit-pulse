export const getVerifyEmailTemplate = ({ name, verifyUrl }: { name: string, verifyUrl: string }) => {
    return `
      <div style="font-family: sans-serif; line-height: 1.5">
        <h2>Hello ${name},</h2>
        <p>Thank you for signing up for <strong>HabitPulse</strong>! Please verify your email address by clicking the button below:</p>
        <a href="${verifyUrl}" style="display:inline-block;background:#6366f1;color:white;padding:10px 20px;border-radius:5px;text-decoration:none">Verify Email</a>
        <p>If you didn’t create this account, you can safely ignore this email.</p>
        <p>— HabitPulse Team</p>
      </div>
    `;
  };
  