// pertama, bikin beberapa helper function untuk membantu mengolah data dari webstorage
const STORAGE_KEY = 'BOOKSHELF_APPS';

let books = [];

function isStorageExist()/* boolean */ {
    if(typeof(Storage) === undefined){
        alert('Browser kamu tidak mendukung local storage');
    };

    return true;
};

function saveData() {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event('ondatasaved'));
};

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);

    let data = JSON.parse(serializedData);

    if(data !== null)
        books = data;

    document.dispatchEvent(new Event('ondataloaded'));
};

function updateDataToStorage() {
    if(isStorageExist())
        saveData();
};

function composeBookObject(title, author, year, isComplete) {
    return {
        id: +new Date(),
        title,
        author,
        year,
        isComplete
    };
};

function findBook(bookId) {
    for(book of books){
        if(book.id === bookId)
            return book;
    };
    return null;
};

function findBookIndex(bookId) {
    let index = 0;
    for(book of books) {
        if(book.id === bookId)
            return index;

        index++;
    };
    return -1;
};

function refreshDataFromBooks() {
    const listIncompleted = document.getElementById(INCOMPLETED_BOOK_ID);
    let listCompleted = document.getElementById(COMPLETED_BOOK_ID);

    for(book of books){
        const newBook = makeBookItem(book.title, book.author, book.year, book.isComplete);
        newBook[BOOK_ITEMID] = book.id;

        if(book.isComplete) {
            listCompleted.append(newBook);
        } else {
            listIncompleted.append(newBook);
        };
    };
};