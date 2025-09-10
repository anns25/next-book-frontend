// "use client";

// import ViewCard from "@/app/components/ViewCard";
// import { getBookById } from "@/app/lib/api";
// import { Book } from "@/app/types/Book";
// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";

// export default function ViewPage() {
//   const { id } = useParams(); // ✅ works now since we're in client
//   const [book, setBook] = useState<Book | null>(null);

//   useEffect(() => {
//     if (!id) return;

//     const fetchBook = async () => {
//       const data = await getBookById(id as string); // 👈 cast to string
//       setBook(data);
//     };

//     fetchBook();
//   }, [id]);

//   if (!book) return <p>Loading...</p>;

//   return <ViewCard book={book} />;
// }


import ViewCard from "@/app/components/ViewCard";
import { getBookById } from "@/app/lib/api";
import { Book } from "@/app/types/Book";
import { notFound } from "next/navigation";


export default async function ViewPage(props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const id = params.id;
    const book: Book = await getBookById(id);


    if (!book) {
      console.log("Book not found");
      notFound();
    }

    console.log("Book Data: ", params.id);
    return (
      <ViewCard bookId={params.id} />

    );
  } catch (error) {
    console.error("Error in ViewPage", error);
    throw error;
  }

};

