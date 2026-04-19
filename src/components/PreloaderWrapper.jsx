// components/PreloaderWrapper.js
import { useEffect, useState } from 'react';
import Loader from './Loader';

const waitForImages = () => {
  const images = Array.from(document.images);
  const promises = images.map(img => {
    if (img.complete) return Promise.resolve();
    return new Promise(resolve => {
      img.onload = img.onerror = resolve;
    });
  });
  return Promise.all(promises);
};

const PreloaderWrapper = ({ children }) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const loadAll = async () => {
      if (document.fonts?.ready) await document.fonts.ready;
      await waitForImages();
      setTimeout(() => setReady(true), 1000); // Optional delay
    };

    if (document.readyState === 'complete') {
      loadAll();
    } else {
      window.addEventListener('load', loadAll);
      return () => window.removeEventListener('load', loadAll);
    }
  }, []);

  return ready ? children : <Loader />;
};

export default PreloaderWrapper;
