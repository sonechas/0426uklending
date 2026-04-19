import React from "react";
import Hero from "../components/Hero";
import CtaSection from "../components/CtaSection";
import QualitySection from "../components/QualitySection";
import NewsletterSection from "../components/NewsletterSection";
import buyIt from "../assets/buy-it.webp";
import CtaImg1 from "../assets/palace-1366178.webp";
import CtaImg2 from "../assets/buy-let-cta.webp";
import CtaImg3 from "../assets/buy-to-let-cta.webp";
import CtaImg4 from "../assets/building-img2.webp";
import backgroundImage from "../assets/palace-1366178.webp";
import LoanComparison from "../components/LoanComparison";

// ✅ TypingText component for Buy to Let page
const TypingText = () => {
  const fullMessageList = [
    ["Buy to Let Finance.", "No Broker Fees."],
    ["Invest with Confidence.", "We Charge No Fees."],
    ["Landlord Support.", "100% Fee-Free."],
    ["Maximise Returns.", "No Brokerage Fees"],
    ["No Brokerage Charges.", "Just Smart Lending."],
    ["Grow Your Portfolio.", "Without any Brokerage Fees."],
    ["We Work for You.", "Without any Brokerage Fees"],
    ["Rental Investment?", "We've Got You – Fee-Free."],
    ["Dedicated to Landlords.", "Fee-Free"],
    ["No Surprises.", "No Brokerage Fees"],
    ["Zero Broker Fees.", "100% Clarity."],
    ["More Profit to You.", "No Brokerage Fees."],
    ["Let Property, Not Fees.", "We Don’t Take a Penny."],
    ["Smart Buy-to-Let Advice.", "No Brokerage Fees."],
    ["Own More. Pay Less.", "No Brokerage Fees."]
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
    updateMaxFontSize(); // initial check
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
          setFontSize(maxFontSize); // reset font size on new message
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
const BuytoLet = () => {
  return (
    <>
      <style>{animationStyle}</style>

      <div style={{ position: "relative" }}>
        <Hero
          title="Buy to Let – Investing in Rental Income"
          subHeading="Empowering Landlords with Flexible Finance Options"
          detail="Get competitive rates and expert support to help maximize your investment potential with our Buy to Let financing."
          className="hero-4"
          imageUrl={buyIt}
        />
        <TypingText />
      </div>

        <LoanComparison id="loan-comparison" comparetText="Buy-to-let Mortgage" />
        <QualitySection
          preHeader="Supporting Your Investment Goals"
          mainHeading="Tailored Solutions for Buy to Let Success"
          description="Our Buy to Let financing is designed for property investors seeking to generate rental income. With flexible options and expert support, we make financing straightforward so you can focus on maximizing your returns. Whether you're a new landlord or expanding your portfolio, we’re here to guide you through every step."
          backgroundImage={backgroundImage} // Pass dynamic image URL as a prop
        />
        <CtaSection
          ctaDirection="reverse light"
          ctaHeading="Why Choose Our Buy to Let Financing?"
          ctaParagraph="Navigating property investments can be complex, but with our Buy to Let solutions, you gain access to tailored, reliable financing. Our advisors offer personalized guidance to help you make the most of your investments, ensuring you have the flexibility to adapt as your portfolio grows. Experience seamless support at every stage."
          ctaImg1={CtaImg3}
          ctaImg2={CtaImg4}
          altText1="Investment Support"
          altText2="Flexible Financing Options"
        />
        <CtaSection 
          ctaDirection=""
          ctaHeading="Our Commitment to Landlords"
          ctaParagraph="At UK Lending, we believe in empowering landlords to achieve their investment goals with confidence. Our approach to Buy to Let financing centers on transparency and dedication. We’re here to offer the resources and expertise needed to support your property investment journey, one milestone at a time."
          ctaImg1={CtaImg1}
          ctaImg2={CtaImg2}
          altText1="Our Commitment"
          altText2="Partnering with Investors"
          btnClass="secondry-btn"
        />
        <NewsletterSection/>
      </>
    );
  };

  export default BuytoLet;
