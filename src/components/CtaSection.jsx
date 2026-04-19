import React from "react";
import "../css/CtaSection.css";

const CtaSection = ({
  ctaDirection = "",
  ctaHeading,
  ctaParagraph,
  ctaButtonText,
  ctaButtonUrl,
  ctaImg1,
  ctaImg2,
  altText1 = "Front Image",
  altText2 = "Back Image",
  btnClass="primary-btn",
  id
}) => {
  return (
    <section className={`cta-section ${ctaDirection}`} id={`${id}`} >
      <div className="container">
        <div className="cta-inner">
          <div className="cta-col-img">
            <div className="cta-img-wrapper img-front">
              <img src={ctaImg1} alt={altText1} />
            </div>
            <div className="cta-img-wrapper img-back">
              <img src={ctaImg2} alt={altText2} />
            </div>
          </div>
          <div className="cta-col-content">
            <h2 className="secondry-heading">{ctaHeading}</h2>
            <p className="default-text">{ctaParagraph}</p>
            {ctaButtonText && ctaButtonUrl && (
            <a className={`${btnClass}`} href={ctaButtonUrl}>
              {ctaButtonText}
            </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
