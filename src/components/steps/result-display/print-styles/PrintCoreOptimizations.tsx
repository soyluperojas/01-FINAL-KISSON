
export const getPrintCoreOptimizations = () => `
  /* HIDE IMAGE DISPLAY BOX FROM PRINT */
  .image-display-box,
  .image-display-box * {
    display: none !important;
    visibility: hidden !important;
  }
  
  /* ULTRA AGGRESSIVE WHITE BACKGROUND OVERRIDE */
  * {
    background: white !important;
    background-color: white !important;
    background-image: none !important;
    background-attachment: scroll !important;
    background-repeat: no-repeat !important;
    background-position: 0 0 !important;
    background-size: auto !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }
  
  /* FORCE WHITE ON HTML AND BODY */
  html, body, #root {
    background: white !important;
    background-color: white !important;
    background-image: none !important;
    color: black !important;
  }
  
  /* ENHANCED TEXT OPTIMIZATION FOR PRINT */
  .recipe-content {
    max-height: calc(6in - 1.2in) !important;
    overflow: hidden !important;
    word-wrap: break-word !important;
    overflow-wrap: break-word !important;
    hyphens: auto !important;
    font-size: 6pt !important;
    line-height: 1.0 !important;
    padding: 2px !important;
    margin: 0 !important;
  }
  
  .recipe-content * {
    word-wrap: break-word !important;
    overflow-wrap: break-word !important;
    hyphens: auto !important;
    max-width: 100% !important;
  }
`;
