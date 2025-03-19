import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export const GET = async () => {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // User-Agent pour éviter d’être bloqué
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36');

    // Aller sur la page LeBonCoin
    await page.goto('https://www.leboncoin.fr/ck/sport_plein_air/board-electrique', { waitUntil: 'domcontentloaded' });

    // Attendre que les annonces chargent
    await page.waitForSelector('li[style^="grid-area:classified-"]', { timeout: 5000 });

    // Récupérer les annonces
    const annonces = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('li[style^="grid-area:classified-"]'))
        .slice(0, 10) // On prend les 10 premières annonces
        .map((annonce) => {
          // Récupérer le titre
          const title = annonce.querySelector('p[data-test-id="adcard-title"]')?.textContent?.trim() || 'Titre non trouvé';
          
          // Récupérer le prix
          const price = annonce.querySelector('p[data-test-id="price"]')?.textContent?.trim() || 'Prix non trouvé';

          // Récupérer le lien relatif et le rendre absolu
          const linkElement = annonce.querySelector('a[class="absolute inset-0"]');
          const link = linkElement ? `https://www.leboncoin.fr${linkElement.getAttribute('href')}` : '#';

          // Récupérer l'URL de l'image (mise à jour avec la nouvelle structure)
          const imageElement = annonce.querySelector('img[class="absolute inset-0 m-auto size-full object-cover"]');
          const image = imageElement ? imageElement.getAttribute('src') : '';

          return { title, price, link, image };
        });
    });

    await browser.close();
    return NextResponse.json({ annonces });
  } catch (error) {
    console.error('Erreur scraping:', error);
    return NextResponse.json({ error: 'Erreur lors du scraping' }, { status: 500 });
  }
};

