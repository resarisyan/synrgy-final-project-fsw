import puppeteer from 'puppeteer';
import chromium from '@sparticuz/chromium';
import fs from 'fs';
export async function convertHTMLToPDF(
  htmlContent: string,
  pdfFilePath: string,
  margins = { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' }
) {
  const executablePath = await chromium.executablePath();
  if (!fs.existsSync(executablePath)) {
    throw new Error(`Chromium executable not found at path: ${executablePath}`);
  }
  const browser = await puppeteer.launch({
    ignoreDefaultArgs: ['--disable-extensions'],
    defaultViewport: chromium.defaultViewport,
    executablePath: executablePath,
    headless: chromium.headless
  });

  const page = await browser.newPage();
  await page.setContent(htmlContent);
  await page.pdf({ path: pdfFilePath, format: 'A4', margin: margins });
  await browser.close();
}
