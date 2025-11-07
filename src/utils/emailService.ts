// src\utils\emailService.ts
export async function sendEmailNotification({
  to,
  subject,
  message,
}: {
  to: string;
  subject: string;
  message: string;
}) {
  console.log("📨 Sending email through Supabase Function...");

  try {
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
           "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          to,
          subject,
          html: message, // html handling
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Failed to send email via Supabase:", errorText);
    } else {
      console.log("✅ Email request sent to Supabase function");
    }
  } catch (err) {
    console.error("❌ Error calling Supabase function:", err);
  }
}