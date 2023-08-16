import { chromium, Page, BrowserContext } from 'playwright';

interface Entry {
  id: string;
  title: string;
  abstract: string;
  author: { name: string }[];
  pdfLink: string;
  published: string;
}

const extractPaperDetails = async (context: BrowserContext, link: string): Promise<Entry> => {
  const page = await context.newPage();
  await page.goto(link);
  
  const id = await page.$eval('[name="citation_arxiv_id"]', (node: HTMLMetaElement) => node.content);
  const title = await page.$eval('.title', (node: HTMLElement) => 
    node.textContent?.replace("Title:", "").trim() || ''); // remove "Title:" from title
  const abstract = await page.$eval('.abstract', (node: HTMLElement) => 
    node.textContent?.replace("Abstract:", "").trim() || ''); // remove "Abstract:" from abstract
  const author = await page.$$eval('.authors a', (nodes: HTMLElement[]) => nodes.map(n => ({ name: n.textContent?.trim() || '' })));

  // const pdfLink = await page.$eval('.full-text a', (node: HTMLAnchorElement) => node.href);
  // https://arxiv.org/pdf/2308.05713.pdf
  const pdfLink = `https://arxiv.org/pdf/${id}.pdf`
  
  const published = await page.$eval('[name="citation_date"]', (node: HTMLMetaElement) => node.content);

  await page.close();

  // return { id, title, abstract, author, pdfLink, published };
  return { id, title, abstract, pdfLink };
};

export default async function scrapePapersByDate(date: string) {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  let paperDetails: Entry[] = [];

  const page = await context.newPage();
  await page.goto('https://arxiv.org/list/cs.AI/recent');
  await page.click('a:has-text("all")');
  await page.waitForLoadState('domcontentloaded');

  const dates = await page.$$eval('h3', (nodes: HTMLElement[]) => nodes.map(n => n.textContent || ''));
  const dateIndex = dates.findIndex(d => d === date);

  if (dateIndex !== -1) {
    const paperLists = await page.$$('dl');
    const entries = await paperLists[dateIndex].$$eval('dt', (nodes: HTMLElement[]) => nodes.map(n => {
      const links = n.querySelectorAll('a');
      return {
        number: n.textContent || '',
        link: (links[1] as HTMLAnchorElement)?.href || ''
      };
    }));

    const paperDetailsPromises = entries.map(entry => extractPaperDetails(context, entry.link));
    paperDetails = await Promise.all(paperDetailsPromises);
    // paperDetails.forEach(details => console.log(details));
  } else {
    console.log('Date not found');
  }

  await browser.close();

  return paperDetails
};