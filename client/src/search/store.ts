import { atom } from 'jotai';
import { Paper } from '~/shared/utils/types';
import * as api from '~/shared/api/fetch';
import type dayjs from 'dayjs'; // Import dayjs if you haven't already

export const searchStateAtom = atom<'pending' | 'loading'| 'complete' | 'empty' | 'error'>('pending');
export const tabValueAtom = atom<0 | 1>(0);
export const resultListAtom = atom<Paper[]>([]);

export const queryAtom = atom('');
export const queryFieldAtom = atom('all');
export const favoriteAtom = atom(false);
export const viewedAtom = atom(false);
export const relevancyAtom = atom('');
export const comparisonOperatorAtom = atom('≥');
export const dateStartAtom = atom(null);
export const dateEndAtom = atom(null);

export const initialStateAtom = atom(false);
export const approvedStateAtom = atom(false);
export const generatedStateAtom = atom(false);
export const publishedStateAtom = atom(false);

type Day = dayjs.Dayjs | null;

export const submitSearchAtom = atom(
  null,
  async (get, set) => {
    set(searchStateAtom, 'loading');

    const beforeDate = get(dateStartAtom) as unknown as Day;
    const afterDate = get(dateEndAtom) as unknown as Day;

    const form = {
      query: get(queryAtom), // string
      queryField: get(queryFieldAtom), // string
      relevancy: {
        operator: get(comparisonOperatorAtom), // string
        value: get(relevancyAtom), // string
      },
      dateStart: beforeDate ? beforeDate.format('YYYY-MM-DD') : null, // string
      dateEnd: afterDate ? afterDate.format('YYYY-MM-DD') : null, // string
      viewed: get(viewedAtom), // boolean
      favorite: get(favoriteAtom), // boolean
      initialState: get(initialStateAtom), // boolean
      approvedState: get(approvedStateAtom), // boolean
      generatedState: get(generatedStateAtom), // boolean
      publishedState: get(publishedStateAtom), // boolean
    };

    try {
      const response = await api.searchPapers(form);
      const results = response.data;

      if (results.length === 0) {
        set(searchStateAtom, 'empty');
      } else {
        set(searchStateAtom, 'complete');
      }

      set(resultListAtom, (results as any));
    } catch (error) {
      console.error("Failed to search papers:", error);
      set(searchStateAtom, 'error');
    }
  }
);

export const resetFieldsAtom = atom(
  null,
  (get, set) => {
    set(queryAtom, '');
    set(queryFieldAtom, 'all');
    set(favoriteAtom, false);
    set(viewedAtom, false);
    set(relevancyAtom, '');
    set(comparisonOperatorAtom, '≥');
    set(dateStartAtom, null);
    set(dateEndAtom, null);
    set(initialStateAtom, false);
    set(approvedStateAtom, false);
    set(generatedStateAtom, false);
    set(publishedStateAtom, false);
  }
);