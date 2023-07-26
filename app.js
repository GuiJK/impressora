const express = require('express');
const printer = require('node-printer');

const app = express();
const PORT = 3000;

function imprimirEtiqueta(printerName, content, callback) {
  const availablePrinters = printer.getPrinters();

  const printerExists = availablePrinters.some((p) => p.name === printerName);

  if (!printerExists) {
    return callback('Printer unavailable');
  }

  printer.printDirect({
    data: content,
    printer: printerName,
    type: 'RAW',
    success: (jobID) => {
      console.log(`Label printed successfully. Job ID: ${jobID}`);
      callback(null, 'Label printed successfully.');
    },
    error: (err) => {
      console.error('Error printing label:', err);
      callback('Error printing label');
    },
  });
}
app.get('/imprimir_etiqueta', (req, res) => {
  const printerName = 'Microsoft Print to PDF';

  const etiqueta = `
    ********** ETIQUETA **********
    Produto: Camiseta
    Tamanho: M
    Preço: R$ 39,90
    *******************************
  `;

  imprimirEtiqueta(printerName, etiqueta, (err, message) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      res.json({ message: message });
    }
  });
});

// Start the server on the specified port
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});