---
title: "Связаться с нами"
description: "Свяжитесь с Global Commerce Council для запросов, поддержки или возможностей партнёрства"
---

## Свяжитесь с нами

Мы будем рады услышать вас. Если у вас есть вопрос о наших услугах, вам нужна поддержка или вы хотите изучить возможности партнёрства, наша команда готова помочь.

### Контактная информация

**Email**: info@globalcommercecouncil.com  
**Часы работы**: Понедельник — Пятница, 9:00 – 18:00 EST

### Отправьте нам сообщение

<form name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field" class="contact-form">
  <input type="hidden" name="form-name" value="contact">
  <p style="display: none;">
    <label>Не заполняйте это поле: <input name="bot-field"></label>
  </p>
  
  <div class="mb-3">
    <label for="name" class="form-label">Имя *</label>
    <input type="text" class="form-control" id="name" name="name" required>
  </div>
  
  <div class="mb-3">
    <label for="email" class="form-label">Email *</label>
    <input type="email" class="form-control" id="email" name="email" required>
  </div>
  
  <div class="mb-3">
    <label for="company" class="form-label">Компания</label>
    <input type="text" class="form-control" id="company" name="company">
  </div>
  
  <div class="mb-3">
    <label for="subject" class="form-label">Тема *</label>
    <select class="form-select" id="subject" name="subject" required>
      <option value="">Выберите...</option>
      <option value="general">Общий запрос</option>
      <option value="supplier">Заявка поставщика</option>
      <option value="buyer">Запрос покупателя</option>
      <option value="partnership">Возможность партнёрства</option>
      <option value="support">Техническая поддержка</option>
      <option value="other">Другое</option>
    </select>
  </div>
  
  <div class="mb-3">
    <label for="message" class="form-label">Сообщение *</label>
    <textarea class="form-control" id="message" name="message" rows="5" required></textarea>
  </div>
  
  <button type="submit" class="btn btn-primary btn-lg">Отправить сообщение</button>
</form>