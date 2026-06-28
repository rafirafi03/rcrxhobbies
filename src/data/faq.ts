export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export const faqs: FAQItem[] = [
  {
    id: "order",
    question: "How do I place an order?",
    answer:
      "Browse our shop, add items to your cart, and complete checkout. Orders are confirmed via WhatsApp — our team will share payment details and delivery updates with you directly.",
  },
  {
    id: "whatsapp",
    question: "Can I order directly on WhatsApp?",
    answer:
      "Yes. Tap any WhatsApp button on the site or message us with the product name or SKU. We can help you choose the right RC model and confirm stock before you order.",
  },
  {
    id: "shipping",
    question: "Do you deliver across India?",
    answer:
      "We ship RC cars, parts, and accessories across India. Delivery time and shipping cost depend on your location and order size — we confirm everything on WhatsApp before dispatch.",
  },
  {
    id: "payment",
    question: "What payment methods do you accept?",
    answer:
      "We accept UPI, bank transfer, and other common payment options shared at checkout. There is no card payment gateway on the website — payment is arranged directly with our team.",
  },
  {
    id: "beginners",
    question: "Which RC car is best for beginners?",
    answer:
      "Mini RC and ready-to-run on-road or off-road models are great starting points. Message us with your budget and whether you prefer indoor or outdoor use — we will recommend the best fit.",
  },
];
