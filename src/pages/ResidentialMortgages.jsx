import React from "react";
import Hero from "../components/Hero";
import CtaSection from "../components/CtaSection";
import QualitySection from "../components/QualitySection";
import NewsletterSection from "../components/NewsletterSection";
import "../css/ProgramPage.css";
import ResidentialLoan from "../assets/residential-loan.webp";
import CtaImg1 from "../assets/palace-1366178.webp";
import CtaImg2 from "../assets/building-img.webp";
import CtaImg3 from "../assets/loan-img.webp";
import CtaImg4 from "../assets/building-img2.webp";
import backgroundImage from "../assets/loan-bg.webp";
import LoanComparison from "../components/LoanComparison";

const TypingText = () => {
  const fullMessageList = [
    ["Residential Mortgages.", "No Broker Fees."],
    ["Own Your Home.", "With Zero Advice Costs."],
    ["No Commission Charges.", "100% Transparent."],
    ["Home Loans, Simplified.", "No Brokerage Added."],
    ["Clear Advice.", "No Middleman Costs."],
    ["Fee-Free Mortgage Support.", "Always Here for You."],
    ["Trusted by Homebuyers.", "Never Charging You."],
    ["Simple Mortgage Advice.", "No Extra Fees."],
    ["Secure Your Home.", "We Charge You Nothing."],
    ["Expert Help.", "No Broker Fee Ever."],
    ["Zero Hidden Fees.", "Just Smart Lending."],
    ["From Offer to Keys.", "No Advice Charges."],
    ["Dedicated to You.", "Not Commissions."]
  ];

  const getRandomMessage = () => {
    const randomIndex = Math.floor(Math.random() * fullMessageList.length);
    return fullMessageList[randomIndex];
  };

  const [currentMessage, setCurrentMessage] = React.useState(getRandomMessage());
  const [displayedText, setDisplayedText] = React.useState(["", ""]);
  const [lineIndex, setLineIndex] = React.useState(0);
  const [charIndex, setCharIndex] = React.useState(0);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [pause, setPause] = React.useState(false);
  const [fontSize, setFontSize] = React.useState(1.5);
  const [maxFontSize, setMaxFontSize] = React.useState(1.5);

  const containerRef = React.useRef(null);
  const lineRefs = [React.useRef(null), React.useRef(null)];

  const updateMaxFontSize = () => {
    const screenWidth = window.innerWidth;
    const maxSize = screenWidth >= 1500 ? 3.0 : 1.5;
    setMaxFontSize(maxSize);
    setFontSize(maxSize);
  };

  const adjustFontSize = () => {
    if (!containerRef.current || !lineRefs[0].current || !lineRefs[1].current) return;
    const containerWidth = containerRef.current.offsetWidth;
    const lineWidths = lineRefs.map((ref) => ref.current.offsetWidth);
    const maxWidth = Math.max(...lineWidths);
    if (maxWidth > containerWidth && fontSize > 1.0) {
      const newFontSize = parseFloat((fontSize - 0.1).toFixed(2));
      setFontSize(newFontSize);
    }
  };

  React.useEffect(() => {
    updateMaxFontSize();
    window.addEventListener("resize", updateMaxFontSize);
    return () => window.removeEventListener("resize", updateMaxFontSize);
  }, []);

  React.useEffect(() => {
    const raf = requestAnimationFrame(() => adjustFontSize());
    return () => cancelAnimationFrame(raf);
  }, [displayedText, fontSize]);

  React.useEffect(() => {
    if (pause) return;

    const currentLineText = currentMessage[lineIndex];
    let timeout;

    if (!isDeleting) {
      if (charIndex <= currentLineText.length) {
        timeout = setTimeout(() => {
          setDisplayedText((prev) => {
            const updated = [...prev];
            updated[lineIndex] = currentLineText.substring(0, charIndex);
            return updated;
          });
          setCharIndex((prev) => prev + 1);
        }, 70);
      }

      if (charIndex > currentLineText.length) {
        if (lineIndex < currentMessage.length - 1) {
          setCharIndex(0);
          setLineIndex((prev) => prev + 1);
        } else {
          setPause(true);
          setTimeout(() => {
            setIsDeleting(true);
            setPause(false);
            setCharIndex(currentLineText.length);
          }, 20000);
        }
      }
    } else {
      if (charIndex >= 0) {
        timeout = setTimeout(() => {
          setDisplayedText((prev) => {
            const updated = [...prev];
            updated[lineIndex] = currentLineText.substring(0, charIndex);
            return updated;
          });
          setCharIndex((prev) => prev - 1);
        }, 50);
      }

      if (charIndex < 0) {
        if (lineIndex > 0) {
          setLineIndex((prev) => prev - 1);
          setCharIndex(currentMessage[lineIndex - 1].length);
        } else {
          setIsDeleting(false);
          setCharIndex(0);
          setLineIndex(0);
          setCurrentMessage(getRandomMessage());
          setFontSize(maxFontSize);
        }
      }
    }

    return () => clearTimeout(timeout);
  }, [charIndex, lineIndex, isDeleting, pause, currentMessage]);

  return (
    <div className="typing-container" ref={containerRef} style={{ fontSize: `${fontSize}rem` }}>
      <div className="typing-line" ref={lineRefs[0]}>
        {displayedText[0]}
        {lineIndex === 0 && <span className="blinking-cursor">|</span>}
      </div>
      <div className="typing-line" ref={lineRefs[1]}>
        {displayedText[1]}
        {lineIndex === 1 && <span className="blinking-cursor">|</span>}
      </div>
    </div>
  );
};

const animationStyle = `
  .typing-container {
    position: absolute;
    top: 50%;
    left: 80%;
    transform: translate(-50%, -50%);
    font-weight: 770;
    color: #ffffff;
    z-index: 9;
    pointer-events: none;
    text-align: center;
    line-height: 1.4;
    max-width: 40vw;
  }

  .typing-line {
    white-space: nowrap;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .blinking-cursor {
    font-weight: 100;
    font-size: 1em;
    color: white;
    animation: blink 1s infinite;
    margin-left: 5px;
  }

  @keyframes blink {
    0% { opacity: 1; }
    50% { opacity: 0; }
    100% { opacity: 1; }
  }

  @media screen and (max-width: 1149px) {
    .typing-container {
      display: none;
    }
  }
`;

const ResidentialMortgages = () => {
  return (
    <>
      <style>{animationStyle}</style>

      <div style={{ position: "relative" }}>
        <Hero
          title="Residential Mortgages – Secure Your Dream Home"
          subHeading="Your Path to Homeownership Starts Here"
          detail="With Residential Mortgages, experience a seamless journey to securing the perfect home, with guidance every step of the way."
          className="hero-1"
          imageUrl={ResidentialLoan}
          id="hero"
        />
        <TypingText />
      </div>
        <LoanComparison id="loan-comparison" comparetText="Residential Mortgages" />
     <QualitySection
        preHeader="Reliable Mortgage Solutions"
        mainHeading="Finance Tailored for Homebuyers"
        description="At The Mortgage Group, we provide mortgage solutions to make homeownership a reality. Whether you're a first-time buyer, refinancing, or upgrading, our tailored plans fit your financial goals. With 24/7 access to experts, we're here to simplify the mortgage process. Our mission is to support your journey to homeownership with the resources, flexibility and guidance you deserve."
        backgroundImage={backgroundImage}
      />
      <CtaSection
      ctaDirection="reverse light"
      ctaHeading="Why Choose Our Mortgage Services"
      ctaParagraph="We know that buying a home is one of the most significant investments in your life. That's why we offer a variety of mortgage solutions to suit diverse needs. Our advisors provide dedicated support, helping you make informed decisions with confidence. With us, you’re not just getting a mortgage; you're securing a foundation for your future."
      ctaImg1={CtaImg3}
      ctaImg2={CtaImg4}
      altText1="Front Image Description"
      altText2="Back Image Description"
      id="cta-1"
    />
      <CtaSection 
      ctaDirection=""
      ctaHeading="Our Story"
      ctaParagraph="We are committed to helping you achieve homeownership with mortgage solutions that cater to individual needs. With expertise, transparency and a client-centered approach, we’re here to guide you through the complexities of securing a mortgage. At The Mortgage Group, we're more than just a lender; we're your trusted partner on the journey to a home you can call your own."
      ctaImg1={CtaImg1}
      ctaImg2={CtaImg2}
      altText1="Front Image Description"
      altText2="Back Image Description"
      btnClass="secondry-btn"
      id="cta-2"
    />
    <NewsletterSection id="newsletter"/>
    </>
  );
};

export default ResidentialMortgages;
