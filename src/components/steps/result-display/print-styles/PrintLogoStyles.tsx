
export const getPrintLogoStyles = () => `
  /* Logo positioning for print - LARGER SIZE with padding */
  .logo-container {
    position: absolute !important;
    bottom: 0.1in !important;
    right: 0.1in !important;
    z-index: 10 !important;
    width: 1.2in !important;
    height: 1.2in !important;
    max-width: 1.2in !important;
    max-height: 1.2in !important;
    background: white !important;
    background-color: white !important;
    visibility: visible !important;
    padding: 8px !important;
    border-radius: 4px !important;
  }
  
  .logo-container img {
    width: calc(1.2in - 16px) !important;
    height: calc(1.2in - 16px) !important;
    max-width: calc(1.2in - 16px) !important;
    max-height: calc(1.2in - 16px) !important;
    object-fit: contain !important;
    display: block !important;
    background: white !important;
    background-color: white !important;
    visibility: visible !important;
    opacity: 1 !important;
    -webkit-print-color-adjust: exact !important;
    color-adjust: exact !important;
  }
`;
