import * as repository from './repository';
import { route } from '../../shared/route';

function paperById(request: any, h: any){
  return new Promise(async (resolve, reject) => {
    const paperId = request.params.paperId;
    const papers = await repository.getPaperById(paperId);
    resolve(papers)
  });
}

function starPaper(request: any, h: any){
  return new Promise(async (resolve, reject) => {
    const paperId = request.params.paperId;
    const value = request.payload.value;

    const papers = await repository.updateIsStarred(paperId, value);
    resolve(papers)
  });
}

export default [
  route.get('/paperById/{paperId}', paperById),
  route.post('/starPaper/{paperId}', starPaper),
]
