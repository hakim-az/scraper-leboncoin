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
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        // Set authentication headers
        await page.setExtraHTTPHeaders({
            Authorization: `Bearer ${bearerToken}`
        });

        // Open product page
        const productUrl = `https://www.leboncoin.fr/ad/sport_plein_air/${productId}`;
        await page.goto(productUrl, { waitUntil: "domcontentloaded" });

        // Wait for and click the "Contacter" button (if needed)
        await page.waitForSelector('[data-test-id="contact-button"]', { timeout: 5000 });
        await page.click('[data-test-id="contact-button"]');
        
        // Wait for the page to load before triggering the API call
        await page.waitForNavigation({ waitUntil: "domcontentloaded" });

        // Intercept network requests and trigger the reply API directly
        await page.setRequestInterception(true);
        page.on('request', (request) => {
            if (request.url().includes(`/api/frontend/v1/classified/${productId}/reply`)) {
                request.continue({
                    method: 'POST',
                    postData: JSON.stringify({ message }),
                    headers: {
                        ...request.headers(),
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${bearerToken}`,
                    }
                });
            } else {
                request.continue();
            }
        });

        // Wait for the response from the API
        await page.waitForResponse(response =>
            response.url().includes(`/api/frontend/v1/classified/${productId}/reply`) && response.status() === 200
        );

        await browser.close();

        return NextResponse.json({ success: true, message: "Message sent!" }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to send message", details: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}
