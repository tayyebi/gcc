/**
 * Contact form handler — Cloudflare Pages Function
 *
 * Requires a `send_email` binding named `SEND_EMAIL` configured in
 * Cloudflare Dashboard → Pages → gcc → Settings → Functions → Bindings
 *
 * Required binding: Send Email
 *   Name: SEND_EMAIL
 *   Allowed destination addresses: info@globalcommercecouncil.com
 *
 * The `from` address (noreply@globalcommercecouncil.com) must be
 * configured in Cloudflare Dashboard → Email → Email Routing.
 */

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const formData = await request.formData();
    const name = formData.get('name')?.trim();
    const email = formData.get('email')?.trim();
    const company = formData.get('company')?.trim() || '';
    const subject = formData.get('subject')?.trim();
    const message = formData.get('message')?.trim();
    const botField = formData.get('bot-field');

    // Honeypot — silently succeed if bot filled it
    if (botField) {
      return Response.json({ success: true });
    }

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return Response.json(
        { error: 'Please fill in all required fields.' },
        { status: 400 }
      );
    }

    // Subject label mapping
    var subjectLabels = {
      general: 'General Inquiry',
      supplier: 'Supplier Application',
      buyer: 'Buyer Inquiry',
      partnership: 'Partnership Opportunity',
      support: 'Technical Support',
      other: 'Other'
    };
    var subjectLabel = subjectLabels[subject] || subject;

    // Build HTML email
    var html = [
      '<h2>New Contact Form Submission</h2>',
      '<table style="border-collapse:collapse;width:100%;max-width:600px">',
      '<tr><td style="padding:8px;font-weight:700;border-bottom:1px solid #eee;width:100px">Name</td><td style="padding:8px;border-bottom:1px solid #eee">', esc(name), '</td></tr>',
      '<tr><td style="padding:8px;font-weight:700;border-bottom:1px solid #eee">Email</td><td style="padding:8px;border-bottom:1px solid #eee">', esc(email), '</td></tr>',
      '<tr><td style="padding:8px;font-weight:700;border-bottom:1px solid #eee">Company</td><td style="padding:8px;border-bottom:1px solid #eee">', esc(company) || '—', '</td></tr>',
      '<tr><td style="padding:8px;font-weight:700;border-bottom:1px solid #eee">Subject</td><td style="padding:8px;border-bottom:1px solid #eee">', esc(subjectLabel), '</td></tr>',
      '</table>',
      '<h3 style="margin-top:24px">Message</h3>',
      '<p style="white-space:pre-wrap">', esc(message), '</p>',
      '<hr style="margin-top:32px">',
      '<p style="font-size:12px;color:#888">Sent via globalcommercecouncil.com contact form</p>'
    ].join('');

    await env.SEND_EMAIL.send({
      from: {
        name: 'GCC Contact Form',
        address: 'noreply@globalcommercecouncil.com'
      },
      to: [{ address: 'info@globalcommercecouncil.com' }],
      subject: '[GCC Contact] ' + subjectLabel + ': ' + name,
      html: html
    });

    return Response.json({ success: true });
  } catch (err) {
    return Response.json(
      { error: 'Something went wrong. Please try again or email us directly at info@globalcommercecouncil.com.' },
      { status: 500 }
    );
  }
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
