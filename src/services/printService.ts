
export type PrintFormat = 'thermal' | 'a4';

export interface PrintOptions {
  format: PrintFormat;
  elementId: string;
  title: string;
}

export const printService = {
  async printElement({ format, elementId, title }: PrintOptions) {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with ID '${elementId}' not found`);
    }

    // Create print window
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      throw new Error('Unable to open print window. Please check popup settings.');
    }

    // Get print styles based on format
    const printStyles = this.getPrintStyles(format);
    
    // Create HTML content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>${printStyles}</style>
        </head>
        <body>
          ${element.outerHTML}
        </body>
      </html>
    `;

    // Write content and setup print
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();

    // Wait for content to load, then print
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 1000);
  },

  getPrintStyles(format: PrintFormat): string {
    const commonStyles = `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
        color-adjust: exact;
        font-family: 'Courier Prime', 'Courier New', monospace !important;
      }
      
      body {
        background: white !important;
        color: black !important;
        font-family: 'Courier Prime', 'Courier New', monospace !important;
      }
      
      img {
        max-width: 100% !important;
        height: auto !important;
      }
    `;

    switch (format) {
      case 'thermal':
        return `
          ${commonStyles}
          
          @page {
            size: 4in 6in portrait;
            margin: 0;
          }
          
          .thermal-label-print {
            width: 4in !important;
            height: 6in !important;
            overflow: hidden !important;
            font-family: 'Courier Prime', 'Courier New', monospace !important;
          }
        `;
        
      case 'a4':
        return `
          ${commonStyles}
          
          @page {
            size: A4 portrait;
            margin: 15mm;
          }
          
          .a4-cookbook-print {
            width: 100% !important;
            min-height: auto !important;
            max-width: none !important;
            font-family: 'Courier Prime', 'Courier New', monospace !important;
          }
        `;
        
      default:
        return commonStyles;
    }
  }
};
