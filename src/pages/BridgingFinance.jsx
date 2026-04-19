import React from "react";
import Hero from "../components/Hero";
import CtaSection from "../components/CtaSection";
import QualitySection from "../components/QualitySection";
import NewsletterSection from "../components/NewsletterSection";
import "../css/ProgramPage.css";
import bridgeImg from "../assets/bridge-img.webp";
import CtaImg1 from "../assets/palace-1366178.webp";
import CtaImg2 from "../assets/lending-bg-1.webp";
import CtaImg3 from "../assets/building-img.webp";
import CtaImg4 from "../assets/building-img2.webp";
import backgroundImage from "../assets/palace-1366178.webp";
import LoanComparison from "../components/LoanComparison";

const TypingText = () => {
  const fullMessageList = [
    ["Fast Bridging Loans.", "Zero Broker Fees."],
    ["Bridging Made Simple.", "No Hidden Charges."],
    ["Short-Term Finance.", "With 0% Commission."],
    ["Urgent Property Deals?", "No Brokerage Fees"],
    ["Bridging Loans, Fast.", "0 Brokerage Fees"],
    ["Auction Finance Experts.", "No Brokerage Fees."],
    ["Speed. Flexibility.", "100% Transparent."],
    ["Bridging Loans in Days.", "No Fees. No Fuss."],
    ["Bridge Gaps Instantly.", "We Don’t Take a Cut."],
    ["Short-Term Loans.", "Zero Surprise Charges."],
    ["Bridge with Confidence.", "without any Brokerage Fees."],
    ["Bridging You Trust.", "100% Fee-Free."]
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

  React.useEffect(() => {
    updateMaxFontSize();
    window.addEventListener("resize", updateMaxFontSize);
    return () => window.removeEventListener("resize", updateMaxFontSize);
  }, []);

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

const BridgingFinance = () => {
  return (
    <>
      <style>{animationStyle}</style>

      <div style={{ position: "relative" }}>
        <Hero
          title="Bridging Finance – Short-Term Solutions"
          subHeading="Immediate Funds When You Need Them Most"
          detail="Perfect for property investors needing fast liquidity, our Bridging Finance offers low fees and short-term flexibility."
          className="hero-2"
          imageUrl={bridgeImg}
          id="hero"
        />
        <TypingText />
      </div>
      <LoanComparison id="loan-comparison" comparetText="Compare Bridging Loans" />
      <QualitySection
        preHeader="Tailored to Meet Urgent Needs"
        mainHeading="Flexible Financing for Immediate Property Needs"
        description="Our Bridging Finance solution is crafted for property investors requiring fast, flexible capital. Whether you’re managing auction purchases, closing a sale, or refinancing, our team offers support at every stage. With transparent terms and a focus on quick processing, we ensure you have the capital you need to bridge gaps effectively."
        backgroundImage={backgroundImage} // Pass dynamic image URL as a prop
      />
      <CtaSection
        ctaDirection="reverse light"
        ctaHeading="Why Choose Bridging Finance with Us?"
        ctaParagraph="Our bridging finance solution is designed for speed and flexibility, offering a straightforward approach to meeting short-term funding gaps. We understand the complexities of property transactions and are committed to providing quick, reliable support. With competitive rates and personalized service, we make financing as smooth and efficient as possible."
        ctaImg1={CtaImg3}
        ctaImg2={CtaImg4}
        altText1="Property Investment Support"
        altText2="Seamless Financing Process"
        id="cta-1"
      />
      <CtaSection 
        ctaDirection=""
        ctaHeading="Our Approach"
        ctaParagraph="With an emphasis on partnership, we offer bridging loans that adapt to your unique requirements. Our focus on speed and efficiency means we prioritize fast decisions and flexible solutions that fit your immediate property goals. Bridging Finance at UK Lending is more than a loan; it’s a bridge to your next opportunity."
        ctaImg1={CtaImg1}
        ctaImg2={CtaImg2}
        altText1="Bridging Opportunities"
        altText2="Flexible Lending"
        btnClass="secondry-btn"
        id="cta-2"
      />
      <NewsletterSection/>
    </>
  );
};

export default BridgingFinance;
