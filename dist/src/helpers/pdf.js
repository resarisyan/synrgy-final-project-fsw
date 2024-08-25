"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertHTMLToPDF = convertHTMLToPDF;
const puppeteer_1 = __importDefault(require("puppeteer"));
const chromium_1 = __importDefault(require("@sparticuz/chromium"));
const fs_1 = __importDefault(require("fs"));
async function convertHTMLToPDF(htmlContent, pdfFilePath, margins = { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' }) {
    const executablePath = await chromium_1.default.executablePath();
    if (!fs_1.default.existsSync(executablePath)) {
        throw new Error(`Chromium executable not found at path: ${executablePath}`);
    }
    const browser = await puppeteer_1.default.launch({
        defaultViewport: chromium_1.default.defaultViewport,
        executablePath: executablePath,
        headless: chromium_1.default.headless
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    await page.pdf({ path: pdfFilePath, format: 'A4', margin: margins });
    await browser.close();
}
//# sourceMappingURL=pdf.js.map