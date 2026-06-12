---
title: "المنتجات"
description: "تصفح جميع المنتجات المتاحة للاستيراد والتصدير عبر مركز التجارة العالمية الخليجي"
---

# جميع المنتجات

تصفح مجموعتنا الشاملة من المنتجات عالية الجودة المتاحة للاستيراد والتصدير. جميع منتجاتنا مطابقة للمواصفات العالمية ومتوفرة بكميات تجارية.

## تصفية حسب الفئة

{% for category in site.categories %}
### [{{ category.title }}]({{ category.url }})
{{ category.description }}
{% endfor %}

## قائمة المنتجات

{% for product in site.products %}
### [{{ product.title }}]({{ product.url }})
- **الدرجة**: {{ product.grade }}
- **المنشأ**: {{ product.origin }}
- **التعبئة**: {{ product.packaging }}
{{ product.description }}
{% endfor %}
