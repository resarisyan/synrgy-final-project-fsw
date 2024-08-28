import puppeteer from 'puppeteer';
import chromium from '@sparticuz/chromium';
import puppeteerCore from 'puppeteer-core';
import dotenv from 'dotenv';
import { EnumFile } from '../enums/enum-file';

dotenv.config();
export async function convertHTMLToDocument(
  htmlContent: string,
  path: string,
  outputType: EnumFile = EnumFile.PDF,
  margins = { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' }
) {
  let browser;
  console.log(process.env.NODE_ENV);
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
  let documentBuffer;
  if (outputType === EnumFile.PDF) {
    documentBuffer = await page.pdf({
      path: path,
      format: 'A4',
      margin: margins
    });
  } else {
    documentBuffer = await page.screenshot({
      path: path,
      quality: 100,
      type: outputType
    });
  }
  await page.close();
  await browser.close();
  return documentBuffer;
}
