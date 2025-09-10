import useSWR from 'swr';
import axios from '../lib/axios'; // your configured axios instance
import type { Book } from '../types/Book';

type ApiListResponse<T> = { data: T; message: string };

const fetcher = <T,>(url: string) =>
  axios.get<ApiListResponse<T>>(url).then(res => res.data.data);

/** Fetch all books */
export function useBooks() {
  return useSWR<Book[]>('/book/all', (url) => fetcher<Book[]>(url), {
    revalidateOnFocus: true,
    dedupingInterval: 2000,
  });
}

/** Fetch individual book by ID */
export function useBook(id : string | null){
  return useSWR<Book>(
    id ? `/book/view/${id}` : null, // only fetch if ID exists
    (url) =>fetcher<Book>(url),
    {
      revalidateOnFocus : true,
      dedupingInterval : 2000,
    }
  );
}
