import { FEED_TAB, SORT_LIST_TYPE } from '@/helper/constant';

export type ValueOf<T> = T[keyof T];
export type IFeedTab = ValueOf<typeof FEED_TAB>;
export type ISortListType = ValueOf<typeof SORT_LIST_TYPE>;
