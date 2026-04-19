import React from "react";
import HeroHome from "../components/HeroHome";
import CtaSection from "../components/CtaSection";
import QualitySection from "../components/QualitySection";
import ProgramSection from "../components/Program";
import NewsletterSection from "../components/NewsletterSection";
import mainSliderImg from "../assets/mainslider-img.webp";
import CtaImg1 from "../assets/palace-1366178.webp";
import CtaImg2 from "../assets/lending-bg-1.webp";
import CtaImg3 from "../assets/building-img.webp";
import CtaImg4 from "../assets/building-img2.webp";
import backgroundImage from "../assets/palace-1366178.webp";

// ✅ TypingText component with random message + mobile responsiveness
const TypingText = () => {
  const fullMessageList = [
    ["No Hidden Fees.", "No Brokerage Fees."],
    ["100% Transparent.", "100% Fee-Free."],
    ["No Commission Costs.", "No Middlemen Involved."],
    ["We Charge Zero.", "The Lender Pays Us."],
    ["You Pay for Property.", "Not for Advice."],
    ["Zero Broker Charges.", "Zero Surprises."],
    ["Mortgage Advice You Trust.", "With No Added Fees."],
    ["Simple. Straightforward.", "And 100% Fee-Free."],
    ["Expert Advice.", "No Brokerage Costs."],
    ["Smart Finance.", "No Commissions."],
    ["Full Clarity.", "No Broker Fees."],
    ["No Upfront Costs.", "No Broker Fees Ever."],
    ["Lending You Can Trust.", "Fee-Free. Always."],
    ["We Work for You.", "Not a Commission."],
    ["Keep More in Your Pocket.", "We Don’t Charge Fees."]
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
    const maxSize = Math.min(3.0, Math.max(1.0, screenWidth / 450));
    setMaxFontSize(maxSize);
    setFontSize(maxSize); // reset to cap when screen resizes
  };

  React.useEffect(() => {
    updateMaxFontSize(); // initial
    window.addEventListener("resize", updateMaxFontSize);
    return () => window.removeEventListener("resize", updateMaxFontSize);
  }, []);

  const adjustFontSize = () => {
    if (!containerRef.current || !lineRefs[0].current || !lineRefs[1].current) return;

    // Constrain to 35vw to safely fit within the right side of the screen without clipping
    const maxAllowedWidth = window.innerWidth * 0.35; 
    const lineWidths = lineRefs.map((ref) => ref.current.offsetWidth);
    const maxWidth = Math.max(...lineWidths);

    if (maxWidth > maxAllowedWidth && fontSize > 0.8) {
      const newFontSize = parseFloat((fontSize - 0.05).toFixed(2));
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
    top: 55%;
    left: 77%; /* Positioned carefully to avoid right edge overflow */
    transform: translate(-50%, -50%);
    font-weight: 770;
    color: #ffffff;
    z-index: 9;
    pointer-events: none;
    text-align: center;
    line-height: 1.4;
    max-width: 40vw;
    width: max-content;
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

const Home = () => {
  return (
    <>
      <style>{animationStyle}</style>

      <div style={{ position: "relative" }}>
        <HeroHome
          title="For mortgages and loans as individual as you are..."
          subHeading="Flexible, Tailored Finance Solutions for Every Property Journey"
          detail="Need funding for a property purchase, investment, or development? We offer fast, flexible financing—whether you're a first-time buyer or a seasoned investor."
          linkText="Get an Instant Quote Now"
          className="hero-0"
          imageUrl={mainSliderImg}
          id="hero"
        />
        <TypingText />
      </div>

    <ProgramSection/>
    {/* <ApiCall /> */}
     <QualitySection
        preHeader=""
        mainHeading="Quality and Service You Can Rely On"
        description="At UK Lending, we are committed to providing tailored financing solutions that align with your unique property investment goals. Whether you're purchasing at auction, bridging gaps, or developing new projects, our flexible finance options are designed to support your needs. With 24/7 support from experienced advisors, we are here to ensure you have the resources and guidance necessary to succeed. Your financial journey is our priority and we strive to deliver value with every loan we offer."
        backgroundImage={backgroundImage} // Pass dynamic image URL as a prop
      />
      <CtaSection
      ctaDirection="reverse light"
      ctaHeading={
        <>
          Why Choose <br /> UK Lending
        </>
      }
    
      ctaParagraph="We understand that property finance can be complex and each investment journey is unique. That’s why we offer a comprehensive range of solutions tailored to fit your individual needs. Our team of experienced advisors is here to provide guidance and flexibility at every step, ensuring you have the right support to make informed decisions. With us, you’re not just a client—you’re a valued partner in achieving financial success."
      ctaImg1={CtaImg3}
      ctaImg2={CtaImg4}
      altText1="Front Image Description"
      altText2="Back Image Description"
      id="cta-1"
      
    />
      <CtaSection 
      ctaDirection=""
      ctaHeading="About Us"
      ctaParagraph="At UK Lending, we're not just brokers. We are a dedicated team of property finance specialists committed to doing things differently. Our collective experience spans traditional lending, property acquisition, and complex loan fulfilment, enabling us to navigate a wide range of client needs with expertise and care. We believe that securing finance shouldn't come with hidden costs or unnecessary stress. That’s why we operate on a 100% fee-free model, working directly with lenders to secure competitive rates without charging brokerage fees. From first-time buyers to seasoned investors, we tailor every solution with transparency, efficiency and integrity at the core. Our team understands that every property journey is unique. We prioritise clarity and personal service, guiding you from initial enquiry through to funding with no surprises along the way. Whether you're refinancing, purchasing, or facing a time-sensitive transaction, we’re here to provide practical and dependable support. At UK Lending, we’re more than finance experts. We are your partners in progress."
      ctaButtonText="Request a callback"
      ctaButtonUrl="/configure"
      ctaImg1={CtaImg1}
      ctaImg2={CtaImg2}
      altText1="Front Image Description"
      altText2="Back Image Description"
      btnClass="secondry-btn"
      id="cta-2"
      
    />
    <NewsletterSection/>
    </>
  );
};

export default Home;