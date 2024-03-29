import * as repository from './repository';
import { WorkerPath, MaintenancePath } from "../../shared/constants";
import createRequest from "../../shared/request";
import * as sharedRepository from "../../shared/repository";
import { groupDatesByMonth } from '../sidebar-dates/transform';
import { mapRecordsToModel } from './transform';
import { route } from '../../shared/route';
import { calenderPageSize } from './repository';

const workerService = createRequest(WorkerPath);
const maintenanceService = createRequest(MaintenancePath);
// workerService.post('generate', params)
// workerService.post('auto', params)
async function scrapePapers(request: any, h: any){
  const date = request.params.date;

  workerService.post('scrape', { date });

  return 'Scraping started';
}

function initialBackfill(request: any, h: any){
  return new Promise(async (resolve, reject) => {
    const date = request.params.date;
    const newDateRecords: any = await maintenanceService.post('backfill/' + date);
    const prevFiveDates = newDateRecords.slice(calenderPageSize * -1);
    const sorted = prevFiveDates.sort((a: { value: number; }, b: { value: number; }) => b.value - a.value);
    const dateList = groupDatesByMonth(newDateRecords); // need to update sidebar date list as well
    const calenderModel = mapRecordsToModel(sorted, []);
    const calenderData = { dateList, calenderModel }
    
    resolve(calenderData)
  });
}

function getCalender(request: any, h: any){
  return new Promise(async (resolve, reject) => {
    const [prevFiveDates, papers] = await repository.fetchCalenderData();
    const calenderModel = mapRecordsToModel(prevFiveDates, papers);
    // ! this being empty shouldn't break the UI for papers in calender
    resolve(calenderModel) 
  });
}

function loadMore(request: any, h: any){
  return new Promise(async (resolve, reject) => {
    const date = request.params.cursor;
    const [prevFiveDates, papers] = await repository.fetchCalenderData(date);
    const calenderModel = mapRecordsToModel(prevFiveDates, papers);
    resolve(calenderModel) 
  });
}

function loadMonth(request: any, h: any){
  return new Promise(async (resolve, reject) => {
    const date = request.params.cursor;
    const [prevFiveDates, papers] = await repository.fetchCalenderData(date, true);
    const calenderModel = mapRecordsToModel(prevFiveDates, papers);
    resolve(calenderModel) 
  });
}

function reset(request: any, h: any){
  return new Promise(async (resolve, reject) => {
    const date = request.params.date;
    const success = await sharedRepository.updateDateStatus(date, 'pending');
    resolve(success) 
  });
}

export default [
  route.get('/getCalender', getCalender),
  route.post('/reset/{date}', reset),
  route.get('/loadMore/{cursor}', loadMore),
  route.get('/loadMonth/{cursor}', loadMonth),
  route.post('/backfill/{date}', initialBackfill),
  route.post('/scrape/{date}', scrapePapers)
]
