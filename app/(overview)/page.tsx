import { SWRConfig } from 'swr';
import FeaturedBooks from "../components/FeaturedBooks";
import Hero from "../components/Hero";
import { getBooks } from "../lib/api";
import { Book } from "../types/Book";

export default async function Home() {
 
  const books: Book[] = await getBooks();
  return (
    <>
      <Hero />
      <SWRConfig value={{ fallback: { '/book/all': books } }}>
        <FeaturedBooks />
      </SWRConfig>

    </>
  );
}
