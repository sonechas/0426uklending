import React, { useState } from "react";
import Hero from "../components/Hero";
import QualitySection from "../components/QualitySection";
import NewsletterSection from "../components/NewsletterSection";
import backgroundImage from "../assets/palace-1366178.webp";
import "../css/FAQs.css";

const faqData = [
  {
    question: "What is UK Lending?",
    answer:
      "UK Lending is a fee-free brokerage service that helps you compare and secure the best mortgage and bridging finance options from trusted lenders. We work directly with lenders so you never pay a penny in broker fees.",
  },
  {
    question: "Do I need to pay for your services?",
    answer:
      "No, our services are 100% free. We do not charge any brokerage fees to our clients — the lender pays us a commission directly, meaning you get expert advice at zero cost to you.",
  },
  {
    question: "What types of loans do you offer?",
    answer:
      "We specialise in bridging finance, residential mortgages, buy-to-let mortgages, commercial mortgages, first-time buyer mortgages, foreign national mortgages, and mortgage protection. Whatever your property goal, we have a solution.",
  },
  {
    question: "How quickly can I get a bridging loan?",
    answer:
      "Typically, bridging loans can be arranged within 3–14 days, depending on your circumstances and the lender's process. In urgent cases we aim to act within 24 hours of your initial enquiry.",
  },
  {
    question: "Will using your service affect my credit score?",
    answer:
      "No — our initial process doesn't affect your credit score. Only when you proceed with a full application to a lender might a hard credit search be conducted, and we'll always inform you before that stage.",
  },
  {
    question: "What is a Fixed Rate Reminder?",
    answer:
      "Our Fixed Rate Reminder service alerts you before your current fixed-rate deal expires so you can remortgage at the right time and avoid being moved onto a higher Standard Variable Rate without warning.",
  },
  {
    question: "Can foreign nationals apply for a UK mortgage?",
    answer:
      "Yes. We specialise in helping non-UK residents and overseas investors navigate the UK mortgage market. We work with lenders experienced in visa-holder and SPV applications across a wide range of nationalities.",
  },
];

// Plus/cross SVG icon
const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeLinecap="round" />
    <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeLinecap="round" />
  </svg>
);

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <Hero
        title="FAQs"
        subHeading="Your Mortgage Questions, Answered"
        detail="From bridging loans to fixed-rate reminders, we've got answers to your most common mortgage and financing questions."
        className="hero-4"
        imageUrl={backgroundImage}
      />

      <section className="faqs-container">
        <p className="faq-section-label">Need to Know</p>
        <h2 className="faq-section-title">Frequently Asked Questions</h2>
        <p className="faq-section-sub">
          Everything you need to know about our services, costs, and the process — answered honestly.
        </p>

        <div className="faq-list" role="list">
          {faqData.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`faq-item${isOpen ? " faq-open" : ""}`}
                role="listitem"
              >
                <button
                  className="faq-question"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                  id={`faq-question-${index}`}
                >
                  <span className="faq-question-text">{item.question}</span>
                  <span className="faq-icon-wrap" aria-hidden="true">
                    <PlusIcon />
                  </span>
                </button>

                {/* Always rendered — CSS grid handles the height transition */}
                <div
                  className="faq-answer-wrap"
                  id={`faq-answer-${index}`}
                  role="region"
                  aria-labelledby={`faq-question-${index}`}
                >
                  <div className="faq-answer-inner">
                    <div className="faq-answer">{item.answer}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <QualitySection
        preHeader="Need More Help?"
        mainHeading="Still Have Questions?"
        description="If your question isn't answered here, don't hesitate to reach out. We're here to make property financing easy, transparent, and stress-free."
        buttonText="Contact Us"
        buttonLink="/configure"
        backgroundImage={backgroundImage}
      />

      <NewsletterSection />
    </>
  );
};

export default FAQs;