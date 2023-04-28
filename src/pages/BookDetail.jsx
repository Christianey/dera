import { Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useStore } from "../store";

const BookDetail = () => {
  const { id } = useParams();
  const data = useStore((state) => state.data);

  const book = data.find((book) => {
    return book.id === +id;
  });

  return (
    <>
      <Typography variant="h1">Book Details</Typography>
      <Typography variant="h3">Title: {book.title}</Typography>
      <Typography variant="h3">Author: {book.author}</Typography>
      <Typography variant="h3">Published: {book.date}</Typography>
      <Typography variant="h3">Genre: {book.genre}</Typography>
    </>
  );
};

export default BookDetail;
