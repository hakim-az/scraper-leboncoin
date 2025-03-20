import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { productId, message, bearerToken } = body;

        if (!productId || !message || !bearerToken) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Launch puppeteer in headless mode (no visible browser)
        const browser = await puppeteer.launch({ headless: true });  // Set headless to true
        const page = await browser.newPage();

        // Set authentication headers
        await page.setExtraHTTPHeaders({
            Authorization: `Bearer ${bearerToken}`
        });

        // Open product page
        const productUrl = `https://www.leboncoin.fr/ad/sport_plein_air/${productId}`;
        await page.goto(productUrl, { waitUntil: "domcontentloaded" });

        // Click on "Contacter" button and wait for redirection
        await page.waitForSelector('[data-test-id="contact-button"]', { timeout: 5000 });
        await Promise.all([
            page.click('[data-test-id="contact-button"]'),
            page.waitForNavigation({ waitUntil: "domcontentloaded" }) // Wait for the page to change
        ]);

        // Fill in message
        await page.waitForSelector('textarea#body', { timeout: 5000 });
        await page.type('textarea#body', message);

        // Click the send button
        await page.waitForSelector('[data-test-id="send-message"]', { timeout: 5000 });
        await page.click('[data-test-id="send-message"]');

        // Wait for the action to complete
        await new Promise(resolve => setTimeout(resolve, 2000));

        await browser.close();

        return NextResponse.json({ success: true, message: "Message sent!" }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to send message", details: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}
