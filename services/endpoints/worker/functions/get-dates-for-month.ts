import scrapePapersByDate from "./scrape-papers-by-date";
import { promises as fs } from 'fs';
import path from 'path';


function getDatesForMonth(month: number, year: number) {
  return Array.from({ length: new Date(year, month, 0).getDate() }, (_, i) => {
    const date = new Date(Date.UTC(year, month - 1, i + 1)).toUTCString();
    return date.split(' ').slice(0, 4).join(' ');
  });
}

// const dates = getDatesForMonth(8, 2023); // For August 2023
// console.log(dates);

function getTodaysDate() {
  const date = new Date().toUTCString();
  return date.split(' ').slice(0, 4).join(' ');
}

console.log(getTodaysDate());

const testDate = 'Fri, 11 Aug 2023'

// scrapePapersByDate(getTodaysDate());

scrapePapersByDate(testDate).then((arxivPapers) => {

  // console.log('arxivPapers: ', arxivPapers);
  const root = '/Users/spankyed/Develop/Projects/CurateGPT/services/files/assets';
  const jsonPath = path.join(root, 'generated', 'test_data', 'arxiv-papers.json');
  const jsonString = JSON.stringify(arxivPapers, null, 2);

  // fs.writeFile('arxiv-papers.json', jsonString)
  fs.writeFile(jsonPath, jsonString)
    .then(() => {
      console.log('File has been saved!');
    })
    .catch((err) => {
      console.error('Error writing to file:', err);
    });

});

