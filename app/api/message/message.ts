import { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }
  
    const { productId, message, email, password } = req.body;
  
    if (!productId || !message || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }
  
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
  
    try {
      // 1️⃣ Open Leboncoin login page
      await page.goto("https://www.leboncoin.fr/account/login", { waitUntil: "networkidle2" });
  
      // 2️⃣ Fill in login form
      await page.type('input[name="email"]', email);
      await page.type('input[name="password"]', password);
      await page.click('button[type="submit"]'); // Adjust selector if needed
      await page.waitForNavigation();
  
      // 3️⃣ Navigate to the product page
      const productUrl = `https://www.leboncoin.fr/vi/${productId}`;
      await page.goto(productUrl, { waitUntil: "domcontentloaded" });
  
      // 4️⃣ Send message
      await page.waitForSelector('textarea[name="message"]', { timeout: 5000 });
      await page.type('textarea[name="message"]', message);
      await page.click('button[type="submit"]');
      await new Promise(resolve => setTimeout(resolve, 2000));

  
      res.status(200).json({ success: true, message: "Message sent!" });
    } catch (error) {
        if (error instanceof Error) {
          res.status(500).json({ error: "Failed to send message", details: error.message });
        } else {
          res.status(500).json({ error: "Failed to send message", details: "Unknown error occurred" });
        }
    }      
  }
  