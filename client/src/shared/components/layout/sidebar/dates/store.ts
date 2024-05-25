import dayjs from 'dayjs';
import { atom } from 'jotai';
import * as api from '~/shared/api/fetch';
import { DatesRow } from '~/shared/utils/types';

export const datesRowsAtom = atom<DatesRow[]>([]);
export const openMonthAtom = atom('');
export const lastOpenMonthAtom = atom('');

export const setSidebarDataAtom = atom(
  null, // write-only atom
  async (get, set, dateList: DatesRow[]) => {
    set(datesRowsAtom, dateList);
    set(openMonthAtom, dateList[0]?.month ?? '');
  }
);

export const fetchDatesSidebarDataAtom = atom(
  null, // write-only atom
  async (get, set) => {
    // set(calendarStateAtom, 'loading');
    try {
      const response = await api.getDatesSidebarData();
      const dateList = response.data;
      console.log('Sidebar dates:', {dateList});
      set(setSidebarDataAtom, dateList);

      // set(calendarStateAtom, dateList.length > 0 ? 'ready' : 'backfill')
      // set(calendarStateAtom, 'selected');
    } catch (error) {
      console.error("Failed to fetch calendar", error);
      // set(calendarStateAtom, 'error');
    }
  }
);

export const updateSidebarDataAtom = atom(
  null, // write-only atom
  async (get, set, { key, count, status }) => {
    
    set(datesRowsAtom, (prevModel) => {
      const month = dayjs(key).format('MMMM YYYY');
      console.log('month update: ', month);
      const updatedModel = prevModel.map((item) => {
        if (item.month === month) {
          return {
            ...item,
            dates: item.dates.map((date) => {
              if (date.value === key) {
                return {
                  ...date,
                  status,
                  count
                };
              }
              return date;
            }),
          };
        }
        return item;
      });
      return updatedModel;
    });
  }
);