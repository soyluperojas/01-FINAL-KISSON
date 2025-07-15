
export const getPrintQRStyles = () => `
  /* QR code section styling */
  .qr-code-container {
    text-align: center !important;
    padding: 2px !important;
    background: white !important;
    background-color: white !important;
    margin: 0 !important;
    max-height: 1.2in !important;
    overflow: hidden !important;
    flex-shrink: 0 !important;
    border: none !important;
    border-radius: 0 !important;
  }
  
  .qr-code-container * {
    background: white !important;
    background-color: white !important;
    border: none !important;
  }
  
  .qr-code-container img {
    width: 0.8in !important;
    height: 0.8in !important;
    max-width: 0.8in !important;
    max-height: 0.8in !important;
    margin: 1px auto !important;
    display: block !important;
    background: white !important;
    background-color: white !important;
    border: none !important;
  }
  
  .qr-code-text {
    font-size: 3pt !important;
    margin: 0 !important;
    color: black !important;
    background: white !important;
    background-color: white !important;
    line-height: 1.0 !important;
    text-align: center !important;
    overflow: hidden !important;
    border: none !important;
  }
`;
