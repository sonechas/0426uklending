import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Suppress the benign "ResizeObserver loop" warning that CRA surfaces as an
// error overlay. This is a browser paint-timing quirk — not a real bug.
const _origOnError = window.onerror;
window.onerror = function (msg, src, line, col, err) {
  if (typeof msg === 'string' && msg.includes('ResizeObserver loop')) {
    return true; // swallow — don't propagate to the CRA overlay
  }
  return _origOnError ? _origOnError(msg, src, line, col, err) : false;
};

// Same for the error event listener path that CRA uses
window.addEventListener('error', (e) => {
  if (e.message && e.message.includes('ResizeObserver loop')) {
    e.stopImmediatePropagation();
  }
}, true);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
