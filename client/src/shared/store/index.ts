import { atom } from 'jotai';
import * as api from '../api/fetch';
import { calenderModelAtom } from '~/calender/components/main/store';

export const selectedDateAtom = atom<string>('');
