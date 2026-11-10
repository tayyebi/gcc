---
title: "Contact Us"
description: "Get in touch with Global Commerce Council for inquiries, support, or partnership opportunities"
---

## Get in Touch

We'd love to hear from you. Whether you have a question about our services, need support, or want to explore partnership opportunities, our team is here to help.

### Contact Information

**Email**: info@globalcommercecouncil.com  
**Hours**: Monday - Friday, 9:00 AM - 6:00 PM EST

### Send Us a Message

<form id="contactForm" class="contact-form" novalidate>
  <p style="display: none;">
    <label>Don't fill this out: <input name="bot-field" autocomplete="off" tabindex="-1"></label>
  </p>

  <div class="mb-3">
    <label for="name" class="form-label">Name *</label>
    <input type="text" class="form-control" id="name" name="name" required>
  </div>

  <div class="mb-3">
    <label for="email" class="form-label">Email *</label>
    <input type="email" class="form-control" id="email" name="email" required>
  </div>

  <div class="mb-3">
    <label for="company" class="form-label">Company</label>
    <input type="text" class="form-control" id="company" name="company">
  </div>

  <div class="mb-3">
    <label for="subject" class="form-label">Subject *</label>
    <select class="form-select" id="subject" name="subject" required>
      <option value="">Choose...</option>
      <option value="general">General Inquiry</option>
      <option value="supplier">Supplier Application</option>
      <option value="buyer">Buyer Inquiry</option>
      <option value="partnership">Partnership Opportunity</option>
      <option value="support">Technical Support</option>
      <option value="other">Other</option>
    </select>
  </div>

  <div class="mb-3">
    <label for="message" class="form-label">Message *</label>
    <textarea class="form-control" id="message" name="message" rows="5" required></textarea>
  </div>
  <button type="submit" class="btn btn-primary btn-lg" id="contactSubmitBtn">Send Message</button>
  <div id="contactFeedback" class="mt-3" aria-live="polite"></div>
</form>