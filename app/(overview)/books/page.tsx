import { getBooks } from "@/app/lib/api";


export default async function BooksPage() {
  const books = await getBooks();

  return (
    <div className="grid grid-cols-3 gap-4">
      {books.map((b: any) => (
        <div key={b._id} className="border p-4">
          <h3>{b.title}</h3>
          <p>{b.author}</p>
        </div>
      ))}
    </div>
  );
}
