import { io } from "../server";
import * as repository from './repository';
import { groupDatesByMonth } from "./transform";
import { route } from '../../shared/route';
import { getConfig } from "~/shared/utils/get-config";
import { WorkerPath, MaintenancePath } from "../../shared/constants";
import createRequest from "../../shared/request";

const workerService = createRequest(WorkerPath);
const maintenanceService = createRequest(MaintenancePath);

function gateway(method: string){
  return (request: any, h: any) => {
    return new Promise(async (resolve, reject) => {
      try {
        const result: any = await maintenanceService.post(method, request.payload);
        resolve(result)
      } catch (err) {
        console.error('Error in gateway: ', err);
        reject(err);
      }
    });
  }
}

async function updateStatus(request: any, h: any) {
  const type = request.params.type;
  const { key, status, data, final } = request.payload;

  console.log('updateStatus: ', {type, key, status, data: !!data, final});

  // type Status = { current: string; updated?: boolean; final?: boolean; data?: any };
  // io.to(user).emit('status', { type, key, status, data, final });
  io.emit('date_status', { type, key, status, data, final });

  return h.response({ status: 'success' }).code(200);
}

function checkIsNewUser(request: any, h: any){
  return new Promise(async (resolve, reject) => {
    const config = await getConfig();
    const isNewUser = config.settings.isNewUser;
    
    resolve(isNewUser)
  });
}

function getDates(request: any, h: any){
  return new Promise(async (resolve, reject) => {
    const dates = await repository.getAllDates();
    const dateList = groupDatesByMonth(dates as any);
    
    resolve(dateList)
  });
}

async function scrapePapers(request: any, h: any){
  const date = request.params.date;

  workerService.post('scrape', { date });

  return 'Scraping started';
}

export default [
  route.post('/scrapeBatch', gateway('scrapeBatch')),
  route.post('/getBatchDates', gateway('getBatchDates')),
  route.post('/loadBatchDates', gateway('loadBatchDates')),
  route.post('/onboardNewUser', gateway('onboardNewUser')),
  route.get('/checkIsNewUser', checkIsNewUser),
  route.post('/work-status/{type}', updateStatus),
  route.get('/getDates', getDates),
  route.post('/scrape/{date}', scrapePapers),
]
