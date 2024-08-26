"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertHTMLToPDF = convertHTMLToPDF;
const puppeteer_1 = __importDefault(require("puppeteer"));
const chromium_1 = __importDefault(require("@sparticuz/chromium"));
const puppeteer_core_1 = __importDefault(require("puppeteer-core"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function convertHTMLToPDF(htmlContent, pdfFilePath, margins = { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' }) {
    let browser;
    if (process.env.NODE_ENV === 'development') {
        browser = await puppeteer_1.default.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            headless: true
        });
    }
    else {
        browser = await puppeteer_core_1.default.launch({
            args: chromium_1.default.args,
            defaultViewport: chromium_1.default.defaultViewport,
            executablePath: await chromium_1.default.executablePath(),
            headless: chromium_1.default.headless
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
//# sourceMappingURL=pdf.js.map