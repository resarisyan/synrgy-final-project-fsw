import puppeteer from 'puppeteer';
import chromium from '@sparticuz/chromium';
import puppeteerCore from 'puppeteer-core';
import dotenv from 'dotenv';

dotenv.config();
export async function convertHTMLToPDF(
  htmlContent: string,
  pdfFilePath: string,
  margins = { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' }
) {
  let browser;
  if (process.env.NODE_ENV === 'development') {
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true
    });
  } else {
    browser = await puppeteerCore.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless
    });
  }

  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  const pdfBuffer = await page.pdf({
    path: pdfFilePath,
    format: 'A4',
    margin: margins
  });
  await page.close();
  await browser.close();
  return pdfBuffer;
}
