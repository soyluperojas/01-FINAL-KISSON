export const usePrintHandlers = (recipeTitle: string) => {
  const handlePrintThermal = () => {
    const labelElement = document.getElementById("thermal-print-area");

    if (!labelElement) {
      alert("No label found to print.");
      return;
    }

    const printWindow = window.open("", "PrintLabel", "width=800,height=600");

    if (!printWindow) {
      alert("Failed to open print window.");
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>${recipeTitle || "Memory Recipe"} - Thermal Label</title>
          <style>
            @media print {
              @page {
                size: 4in 6in portrait;
                margin: 0;
              }

              html, body {
                width: 4in;
                height: 6in;
                margin: 0;
                padding: 0;
                background: white;
                font-family: 'Courier Prime', Courier, monospace;
              }

              #thermal-label-wrapper {
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 0.3in;
                box-sizing: border-box;
              }
            }

            body {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              background: white;
            }

            #thermal-label-wrapper {
              width: 4in;
              height: 6in;
              transform: scale(1);
              transform-origin: top left;
            }
          </style>
        </head>
        <body onload="window.print();">
          <div id="thermal-label-wrapper">
            ${labelElement.outerHTML}
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  const handlePrintA4 = () => {
    // No se usa
  };

  return {
    handlePrintThermal,
    handlePrintA4
  };
};
