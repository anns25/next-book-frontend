// 'use client'

// import { Box, Container, Grid, Pagination, Typography, useTheme } from "@mui/material"
// import BookCard from "./BookCard";
// import { useState } from "react";
// import { Book } from "../types/Book";
// interface FeaturedBooksProps {
//     books: Book[];
// }


// const FeaturedBooks = ({ books}: FeaturedBooksProps) => {

//     const theme = useTheme();
//     const [currentPage, setCurrentPage] = useState(1);
//     const booksPerPage = 12;

//     const indexOfLastBook = currentPage * booksPerPage;
//     const indexOfFirstBook = indexOfLastBook - booksPerPage;
//     const currentPageBooks = books.slice(indexOfFirstBook, indexOfLastBook);
//     return (
//         < Container sx={{ backgroundColor: theme.palette.background.default, color: theme.palette.text.primary, pb: 10 }
//         }>
//             <Box px={5} sx={{ minHeight: '100vh' }}>
//                 <Typography variant="h4" textAlign="center" m={5} p={3} sx={{ fontFamily: theme.typography.h2.fontFamily }}>
//                     Featured Books
//                 </Typography>
//                 <Grid container spacing={4} justifyContent="center">
//                     {currentPageBooks.map((book) => (<Grid size={{ sm: 4, md: 3, lg: 2 }} key={book.book_id}>
//                         <BookCard book={book} key={book.book_id} />
//                     </Grid>
//                     ))}
//                 </Grid>
//                 <Pagination
//                     count={Math.ceil(books.length / booksPerPage)}
//                     page={currentPage}
//                     onChange={(e, value) => setCurrentPage(value)}
//                     color='primary'
//                     sx={{ mt: 5, pt: 3, display: 'flex', justifyContent: 'center', alignItems: 'stretch' }} />
//             </Box>


//         </Container >
//     )
// }

// export default FeaturedBooks


// app/components/FeaturedBooks.tsx


'use client';

import { Box, Container, Grid, Pagination, Typography, useTheme } from "@mui/material";
import BookCard from "./BookCard";
import { useState } from "react";
import { useBooks } from "../lib/swr"; // <-- the hook from step 2

const FeaturedBooks = () => {
  const theme = useTheme();
  const { data: books = [], isLoading, error } = useBooks();

  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 10;

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentPageBooks = books.slice(indexOfFirstBook, indexOfLastBook);

  if (error) return <div>Failed to load books</div>;
  
  return (
    <Container sx={{ backgroundColor: theme.palette.background.default, color: theme.palette.text.primary, pb: 10 }}>
      <Box px={5} sx={{ minHeight: '100vh' }}>
        <Typography variant="h4" textAlign="center" m={5} p={3} sx={{ fontFamily: theme.typography.h2.fontFamily }}>
          Featured Books
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {currentPageBooks.map((book) => (
            <Grid key={book.book_id} /* use proper Grid props if it's MUI Grid v5/6 */>
              <BookCard book={book} />
            </Grid>
          ))}
        </Grid>

        <Pagination
          count={Math.ceil(books.length / booksPerPage)}
          page={currentPage}
          onChange={(_, value) => setCurrentPage(value)}
          color='primary'
          sx={{ mt: 5, pt: 3, display: 'flex', justifyContent: 'center', alignItems: 'stretch' }}
        />
      </Box>
    </Container>
  );
};

export default FeaturedBooks;
