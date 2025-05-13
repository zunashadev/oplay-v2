export default {
  mounted(el, binding) {
    el.addEventListener('click', () => {
      const selector = binding.value;
      const printElement = document.querySelector(selector);

      if (!printElement) {
        console.error(`Elemen dengan selector "${selector}" tidak ditemukan.`);
        return;
      }

      const printWindow = window.open('', '', 'width=800,height=600');

      // ! TEMP
      // <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"

      // Buat dokumen dasar
      printWindow.document.open();
      printWindow.document.write(`
        <html>
          <head>
            <title>Print</title>
            <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
            <style>
              @media print {
                body {
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                }
              }
              body {
                padding: 2rem;
                font-family: sans-serif;
              }
            </style>
          </head>
          <body>
            ${printElement.innerHTML}
          </body>
        </html>
      `);
      printWindow.document.close();

      // Tunggu sampai semua stylesheet termuat
      printWindow.onload = function () {
        // Tambahkan delay kecil agar CSS benar-benar ter-render
        printWindow.document.addEventListener('DOMContentLoaded', () => {
          printWindow.focus();
          printWindow.print();
          printWindow.close();
        });
      };
    });
  },
};
