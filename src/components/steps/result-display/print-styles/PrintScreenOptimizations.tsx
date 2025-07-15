
export const getPrintScreenOptimizations = () => `
  /* Hide image display box from print on screen */
  .image-display-box {
    display: block !important;
  }
  
  /* Ensure recipe content has proper word wrapping and doesn't overflow */
  .recipe-content {
    font-size: 6pt !important;
    line-height: 1.0 !important;
    color: #000 !important;
    background: white !important;
    padding: 2px !important;
    overflow: hidden !important;
    word-wrap: break-word !important;
    overflow-wrap: break-word !important;
    hyphens: auto !important;
  }
  
  .recipe-content * {
    font-size: 6pt !important;
    line-height: 1.0 !important;
    margin: 1px 0 !important;
    padding: 0 !important;
    color: #000 !important;
    background: white !important;
    word-wrap: break-word !important;
    overflow-wrap: break-word !important;
  }
  
  /* Ensure text elements are properly sized for screen preview */
  .recipe-title,
  .recipe-title *,
  .recipe-title h1 {
    font-size: 9pt !important;
    line-height: 1.0 !important;
    color: #000 !important;
    margin: 0 !important;
    padding: 2px 0 !important;
    text-align: center !important;
    font-weight: bold !important;
    max-height: 0.35in !important;
    overflow: hidden !important;
    background: white !important;
    background-color: white !important;
  }
  
  .memory-description {
    font-size: 6pt !important;
    line-height: 1.0 !important;
    color: #333 !important;
    max-height: 0.5in !important;
    overflow: hidden !important;
    margin-bottom: 4px !important;
    background: white !important;
  }
  
  .qr-code-container {
    background: white !important;
    padding: 2px !important;
    text-align: center !important;
    max-height: 1.0in !important;
  }
  
  .qr-code-text {
    font-size: 4pt !important;
    line-height: 1.0 !important;
    color: #666 !important;
    margin: 1px 0 !important;
    background: white !important;
  }
`;
