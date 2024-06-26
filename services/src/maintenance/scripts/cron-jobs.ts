import cron from 'node-cron';
import scrapeAndRankPapers from '~/worker/scripts/scrape';
import repository from '~/maintenance/repository';
import { getCurrentDate } from './add-dates';
import { getConfig } from '~/shared/utils/get-config';

type Jobs = { [key: string]: cron.ScheduledTask };
const scrapeJobs: Jobs = {};

export async function startJobScrapeNewDatesWithRetry() {
  scrapeTodayWithRetry(true);

  return cron.schedule('0 0 * * *', async () => {
    // runs at midnight every day
    // todo skip job if todays friday, and if its monday create 3 jobs for friday-monday
    scrapeTodayWithRetry();
  })
}

async function scrapeTodayWithRetry(tryNow = false) {
  const date = getCurrentDate();
  await repository.storeDate(date)

  if (tryNow) {
    attemptToScrapeTodaysPapers(date)
  }

  if (scrapeJobs[date]) {
    return;
  }

  let attempts = 0;
  
  const config = await getConfig();
  const scrapeInterval = config.settings.scrapeInterval;

  scrapeJobs[date] = cron.schedule(`0 */${scrapeInterval} * * *`, async () => {
    attempts++;

    console.log(`Attempt [${attempts}] to scrape papers for date, ${date}...`);

    attemptToScrapeTodaysPapers(date)
  });
}

async function attemptToScrapeTodaysPapers(date: any) {
  const dateRecord = await repository.getDate(date) 
  const isPending = dateRecord?.status === 'pending';

  const result = isPending ? await scrapeAndRankPapers(date, false) : [];

  if (scrapeJobs[date] && (result.length || !isPending)) {
    scrapeJobs[date].stop();
    delete scrapeJobs[date];
  }
};
