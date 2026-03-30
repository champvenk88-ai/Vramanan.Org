// app/api/contact/route.js — Agent 4: Lead Capture
import { addLead } from "@/lib/db";

export async function POST(request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return Response.json({ error: "Name, email, and message are required" }, { status: 400 });
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: "Invalid email address" }, { status: 400 });
    }

    // Store lead
    const lead = addLead({ name, email, message, source: "contact_form" });

    console.log(`[Lead Capture] New lead: ${name} (${email})`);

    return Response.json({
      success: true,
      message: "Thank you! V Ramanan will get back to you within 24 hours.",
      leadId: lead.id,
    });
  } catch (err) {
    console.error("[Contact API] Error:", err);
    return Response.json({ error: "Something went wrong. Please email Champvenk88@gmail.com directly." }, { status: 500 });
  }
}
