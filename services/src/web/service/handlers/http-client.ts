import { groupDaysByMonth, mapPapersToDays } from '../utils';
import repository from '../repository';

import { WorkerPath } from "../../../shared/constants";
import createRequest from "../../../shared/request";

const workerService = createRequest(WorkerPath);

export const worker = {
  scrape: (params: any) => workerService.post('scrape', params),
  generate: (params: any) => workerService.post('generate', params),
  auto: (params: any) => workerService.post('auto', params),
  // completion: (params: any) => workerService.post('auto', params),
}

function getDashboard(request, h){
  return new Promise(async (resolve, reject) => {
    const [allDays, lastFiveDays] = await repository.fetchDashboard();
    console.log('dash fetched', lastFiveDays);
    const papers = await repository.getPapersForDays(lastFiveDays.map(day => day.value), 0, 7);
    console.log('papers fetched');
    // todo current day seems to be off (13th instead of 14th for today)
    const paperList = mapPapersToDays(lastFiveDays, papers);
    const dateList = groupDaysByMonth(allDays);
    // ! ensure paperList only includes dates in DB
    // const dashboardData = { dateList, paperList: [] } // ! this being empty shouldnt break the UI for papers in dashboard
    const dashboardData = { dateList, paperList }
    
    resolve(dashboardData)
  });
}

function getPapersForDay(request, h){
  return new Promise(async (resolve, reject) => {
    const date = request.params.date;
    const papers = await repository.getPapersForDays([date]);
    resolve(papers)
  });
}

async function scrapePapers(request, h){
  const date = request.params.date;
  const workerResponse = await worker.scrape({ date });
  console.log('workerResponse: ', workerResponse);

  if (!workerResponse){
    return { error: 'Problem scraping papers' }
  }

  return workerResponse;
}

export {
  getDashboard,
  getPapersForDay,
  scrapePapers
}