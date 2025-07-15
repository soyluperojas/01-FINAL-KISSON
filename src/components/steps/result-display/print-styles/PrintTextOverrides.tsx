
export const getPrintTextOverrides = () => `
  /* RECIPE TITLE - FORCE BLACK TEXT */
  .recipe-title,
  .recipe-title *,
  .recipe-title h1 {
    font-size: 9pt !important;
    font-weight: bold !important;
    margin: 0 !important;
    padding: 2px 0 !important;
    color: black !important;
    background: white !important;
    background-color: white !important;
    text-align: center !important;
    line-height: 1.0 !important;
    max-height: 0.35in !important;
    overflow: hidden !important;
    flex-shrink: 0 !important;
    border: none !important;
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
  }
  
  /* Memory description styling */
  .memory-description {
    font-size: 6pt !important;
    font-style: italic !important;
    margin: 0 0 4px 0 !important;
    padding: 2px !important;
    color: black !important;
    background: white !important;
    background-color: white !important;
    line-height: 1.0 !important;
    overflow: hidden !important;
    flex-shrink: 0 !important;
    max-height: 0.5in !important;
    border: none !important;
  }
  
  .memory-description * {
    color: black !important;
    background: white !important;
    background-color: white !important;
    border: none !important;
  }
  
  /* Force all text to be black */
  [class*="text-"] {
    color: black !important;
    background: white !important;
    background-color: white !important;
  }
`;
