import React from "react";

const LazyImage = ({ src, alt }) => {
  return <img src={src} alt={alt} loading="lazy" style={{ display: "none" }} />;
};

export default LazyImage;
