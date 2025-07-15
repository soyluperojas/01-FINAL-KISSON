
export const getPrintRecipeStyles = () => `
  /* Recipe content styling */
  .recipe-content {
    font-size: 6pt !important;
    line-height: 1.0 !important;
    padding: 2px !important;
    background: white !important;
    background-color: white !important;
    overflow: hidden !important;
    height: 100% !important;
    color: black !important;
    border: none !important;
    border-radius: 0 !important;
  }
  
  .recipe-content * {
    font-size: 6pt !important;
    line-height: 1.0 !important;
    margin: 1px 0 !important;
    padding: 0 !important;
    max-width: 100% !important;
    word-wrap: break-word !important;
    overflow-wrap: break-word !important;
    color: black !important;
    background: white !important;
    background-color: white !important;
    border: none !important;
  }
  
  .recipe-content h2, 
  .recipe-content h3 {
    font-weight: bold !important;
    margin: 2px 0 1px 0 !important;
    color: black !important;
    background: white !important;
    background-color: white !important;
    font-size: 6pt !important;
    border: none !important;
  }
  
  .recipe-content ul, 
  .recipe-content ol {
    margin: 1px 0 !important;
    padding-left: 8px !important;
    color: black !important;
    background: white !important;
    background-color: white !important;
    border: none !important;
  }
  
  .recipe-content li {
    margin: 0 !important;
    padding: 0 !important;
    line-height: 1.0 !important;
    color: black !important;
    background: white !important;
    background-color: white !important;
    border: none !important;
  }
  
  .recipe-content p {
    margin: 1px 0 !important;
    padding: 0 !important;
    color: black !important;
    background: white !important;
    background-color: white !important;
    border: none !important;
  }
  
  /* Ensure NO "Title:" prefix is added anywhere */
  .recipe-title::before {
    content: none !important;
  }
  
  .recipe-title h1::before {
    content: none !important;
  }
`;
