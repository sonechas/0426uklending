import React, { useState, useEffect, lazy, Suspense } from "react";
import "../css/Hero.css";
import { Link as ScrollLink } from "react-scroll";

// Lazy load images
const LazyImage = lazy(() => import("./LazyImage"));

const Hero = ({ id, title, subHeading, detail, linkText, linkHref, className, imageUrl }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => setImageLoaded(true);
  }, [imageUrl]);

  return (
    <div
      id={id}
      className={`banner ${className}`}
      style={{
        background: imageLoaded
        ? `linear-gradient(to bottom right, rgba(0, 0, 0, 0.859) 10%, rgba(0, 0, 0, 0.197) 100%), url(${imageUrl}) no-repeat center / cover`
        : "linear-gradient(to bottom right, rgba(0, 0, 0, 0.859) 10%, rgba(0, 0, 0, 0.197) 100%)",
      }}
    >
      <div className="container">
        <div className="banner-left">
          <h1>{title}</h1>
          <span className="sub-heading">{subHeading}</span>
          <p className="banner-detail">{detail}</p>
            {linkText}
        </div>
      </div>
      
      {/* Lazy Load Image */}
      <Suspense fallback={<div style={{ height: "100px" }} />}>
        <LazyImage src={imageUrl} alt={title} />
      </Suspense>
    </div>
  );
};

export default Hero;