const express = require('express');
const printer = require('node-printer');

const app = express();
const PORT = 3000; // Choose the desired port for your API

// Route to print the label
app.get('/imprimir_etiqueta', (req, res) => {
  const printerName = 'Microsoft Print to PDF'; // Replace with your printer's name

  // Get a list of available printers
  const availablePrinters = printer.getPrinters();

  // Check if the printer is available
  const printerExists = availablePrinters.some((p) => p.name === printerName);

  if (!printerExists) {
    return res.status(500).json({ error: 'Printer unavailable.' });
  }

  // Define the content of the label to be printed (replace as needed)
  const etiqueta = `
    ********** ETIQUETA **********
    Produto: Camiseta
    Tamanho: M
    Preço: R$ 39,90
    *******************************
  `;

  // Send the content to the printer
  const jobFromBuffer = printer.printDirect({
    data: etiqueta,
    printer: printerName,
    type: 'RAW',
    success: (jobID) => {
      console.log(`Label printed successfully. Job ID: ${jobID}`);
      res.json({ message: 'Label printed successfully.' });
    },
    error: (err) => {
      console.error('Error printing label:', err);
      res.status(500).json({ error: 'Error printing label.' });
    },
  });

  console.log('Printing job info:', jobFromBuffer);
});

// Start the server on the specified port
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});