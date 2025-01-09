import React, { useState } from "react";
import AddBookForm from "./components/AddBookForm";
import BookList from "./components/BookList";
import UserRecords from "./components/UserRecords";
import SearchBar from "./components/SearchBar";

interface Book {
  id: number;
  title: string;
  author: string;
  borrowedBy?: string;
}

interface UserRecord {
  name: string;
  borrowedBooks: string[];
}

const App: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [userRecords, setUserRecords] = useState<UserRecord[]>([]);
  const [searchResults, setSearchResults] = useState<Book[]>([]);

  const addBook = (title: string, author: string) => {
    const newBook: Book = { id: Date.now(), title, author };
    setBooks([...books, newBook]);
  };

  const deleteBook = (id: number) => {
    setBooks(books.filter((book) => book.id !== id));
  };

  const borrowBook = (id: number, user: string) => {
    const updatedBooks = books.map((book) =>
      book.id === id ? { ...book, borrowedBy: user } : book
    );
    setBooks(updatedBooks);

    const userRecord = userRecords.find((record) => record.name === user);
    if (userRecord) {
      userRecord.borrowedBooks.push(
        books.find((book) => book.id === id)?.title || ""
      );
    } else {
      setUserRecords([...userRecords, { name: user, borrowedBooks: [books.find((book) => book.id === id)?.title || ""] }]);
    }
  };

  const returnBook = (id: number) => {
    const updatedBooks = books.map((book) =>
      book.id === id ? { ...book, borrowedBy: undefined } : book
    );
    setBooks(updatedBooks);

    const bookTitle = books.find((book) => book.id === id)?.title || "";
    setUserRecords(
      userRecords.map((record) => ({
        ...record,
        borrowedBooks: record.borrowedBooks.filter((title) => title !== bookTitle),
      }))
    );
  };

  const searchBooks = (query: string) => {
    const results = books.filter(
      (book) =>
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(results);
  };

  return (
    <div className=" flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Library Management System</h1>

        {/* Add Book Form */}
        <div className="mb-6">
          <AddBookForm onAddBook={addBook} />
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar onSearch={searchBooks} />
        </div>

        {/* Book List */}
        <div className="mb-6">
          <BookList
            books={searchResults.length > 0 ? searchResults : books}
            onBorrow={borrowBook}
            onReturn={returnBook}
            onDelete={deleteBook}
          />
        </div>

        {/* User Records */}
        <div>
          <UserRecords userRecords={userRecords} />
        </div>
      </div>
    </div>
  );
};

export default App;