import puppeteer from 'puppeteer';

export async function convertHTMLToPDF(
  htmlContent: string,
  pdfFilePath: string,
  margins = { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' }
) {
  const browser = await puppeteer.launch({});

  const page = await browser.newPage();
  await page.setContent(htmlContent);
  await page.pdf({ path: pdfFilePath, format: 'A4', margin: margins });
  await browser.close();
}
