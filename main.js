function isStorageExist() {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

let books = [];

function saveToLocalStorage() {
  localStorage.setItem('books', JSON.stringify(books));
}

function loadFromLocalStorage() {
  if (isStorageExist()) {
    const storedBooks = localStorage.getItem('books');
    if (storedBooks) {
      books = JSON.parse(storedBooks);
      renderBooks();
    }
  }
}

function renderBooks() {
  const incompleteBookList = document.getElementById('incompleteBookList');
  const completeBookList = document.getElementById('completeBookList');

  incompleteBookList.innerHTML = '';
  completeBookList.innerHTML = '';

  books.forEach(book => {
    const bookItem = document.createElement('div');
    bookItem.setAttribute('data-bookid', book.id);
    bookItem.setAttribute('data-testid', 'bookItem');

    bookItem.innerHTML = `
            <h3 data-testid="bookItemTitle">${book.title}</h3>
            <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
            <p data-testid="bookItemYear">Tahun: ${book.year}</p>
            <div>
                <button data-testid="bookItemIsCompleteButton" onclick="toggleComplete(${book.id})">${book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca'}</button>
                <button data-testid="bookItemDeleteButton" onclick="deleteBook(${book.id})">Hapus Buku</button>
                <button data-testid="bookItemEditButton" onclick="editBook(${book.id})">Edit Buku</button>
            </div>
        `;

    if (book.isComplete) {
      completeBookList.appendChild(bookItem);
    } else {
      incompleteBookList.appendChild(bookItem);
    }
  });
}

document.getElementById('bookForm').addEventListener('submit', function (event) {
  event.preventDefault();
  const title = document.getElementById('bookFormTitle').value;
  const author = document.getElementById('bookFormAuthor').value;
  const year = document.getElementById('bookFormYear').value;
  const isComplete = document.getElementById('bookFormIsComplete').checked;

  const newBook = {
    id: Date.now(),
    title,
    author,
    year: Number(year),
    isComplete
  };

  books.push(newBook);
  saveToLocalStorage();
  renderBooks();
  this.reset();
});

function toggleComplete(bookId) {
  const book = books.find(b => b.id === bookId);
  if (book) {
    book.isComplete = !book.isComplete;
    saveToLocalStorage();
    renderBooks();
  }
}

function deleteBook(bookId) {
  books = books.filter(b => b.id !== bookId);
  saveToLocalStorage();
  renderBooks();
}

function editBook(bookId) {
  const book = books.find(b => b.id === bookId);
  if (book) {
    document.getElementById('editBookId').value = book.id;
    document.getElementById('editBookTitle').value = book.title;
    document.getElementById('editBookAuthor').value = book.author;
    document.getElementById('editBookYear').value = book.year;
  }
}

document.getElementById('editBookForm').addEventListener('submit', function (event) {
  event.preventDefault();
  const id = Number(document.getElementById('editBookId').value);
  const title = document.getElementById('editBookTitle').value;
  const author = document.getElementById('editBookAuthor').value;
  const year = document.getElementById('editBookYear').value;

  const bookIndex = books.findIndex(b => b.id === id);
  if (bookIndex !== -1) {
    books[bookIndex] = { id, title, author, year: Number(year), isComplete: books[bookIndex].isComplete };
    saveToLocalStorage();
    renderBooks();
    this.reset();
  }
});

document.getElementById('searchBook').addEventListener('submit', function (event) {
  event.preventDefault();
  const searchTitle = document.getElementById('searchBookTitle').value.toLowerCase();
  const filteredBooks = books.filter(book => book.title.toLowerCase().includes(searchTitle));

  const incompleteBookList = document.getElementById('incompleteBookList');
  const completeBookList = document.getElementById('completeBookList');

  incompleteBookList.innerHTML = '';
  completeBookList.innerHTML = '';

  filteredBooks.forEach(book => {
    const bookItem = document.createElement('div');
    bookItem.setAttribute('data-bookid', book.id);
    bookItem.setAttribute('data-testid', 'bookItem');

    bookItem.innerHTML = `
            <h3 data-testid="bookItemTitle">${book.title}</h3>
            <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
            <p data-testid="bookItemYear">Tahun: ${book.year}</p>
            <div>
                <button data-testid="bookItemIsCompleteButton" onclick="toggleComplete(${book.id})">${book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca'}</button>
                <button data-testid="bookItemDeleteButton" onclick="deleteBook(${book.id})">Hapus Buku</button>
                <button data-testid="bookItemEditButton" onclick="editBook(${book.id})">Edit Buku</button>
            </div>
        `;

    if (book.isComplete) {
      completeBookList.appendChild(bookItem);
    } else {
      incompleteBookList.appendChild(bookItem);
    }
  });
});

loadFromLocalStorage();
