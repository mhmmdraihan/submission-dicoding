const INCOMPLETED_BOOK_ID = 'incompleteBookshelfList';
const COMPLETED_BOOK_ID = 'completeBookshelfList';
const BOOK_ITEMID = 'itemId';
// checkbox boolean
const cek = document.getElementById('inputBookIsComplete');

// ganti span
cek.addEventListener('click', function(){
    if(cek.checked){
        document.querySelector('#bookSubmit span').innerText = 'Selesai dibaca';
    } else {
        document.querySelector('#bookSubmit span').innerText = 'Belum selesai dibaca';
    };
});


// function addBook(): simpan value dari input form
function addBookItem(){
    const incompleteShelf = document.getElementById(INCOMPLETED_BOOK_ID);
    const completeShelf = document.getElementById(COMPLETED_BOOK_ID);
    const data = {
        id: +new Date(),
        title: document.getElementById('inputBookTitle').value,
        author: document.getElementById('inputBookAuthor').value,
        year: document.getElementById('inputBookYear').value,
        isComplete: cek.checked
    };

    const bookItem = makeBookItem(data.title, data.author, data.year, data.isComplete);
    const bookObject = composeBookObject(data.title, data.author, data.year, data.isComplete);

    bookItem[BOOK_ITEMID] = bookObject.id;
    books.push(bookObject);

    if(data.isComplete){
        completeShelf.append(bookItem);
    } else {
        incompleteShelf.append(bookItem);
    };
    updateDataToStorage();
};

function makeBookItem(title, author, year, isComplete){

    const textTitle = document.createElement('h3');
    textTitle.innerText = title;

    const textAuthor = document.createElement('p');
    textAuthor.innerText = `Penulis: ${author}`;

    const textYear = document.createElement('p');
    textYear.innerText = `Tahun: ${year}`;

    const container = document.createElement('article');
    container.classList.add('book_item');
    container.append(textTitle, textAuthor, textYear);

    // create div as buttons' container
    const buttonsDiv = document.createElement('div');
    buttonsDiv.classList.add('action');
    if(isComplete) {
        buttonsDiv.append(
            createUndoButton(),
            );
    } else {
        buttonsDiv.append(createCheckButton());
    };
    buttonsDiv.append(createTrashButton());
    container.append(buttonsDiv);

    return container;
};


// function createButton() [plus 'text' on its parameter]
function createButton(buttonTypeClass, eventListener, text){
    const button = document.createElement('button');
    button.classList.add(buttonTypeClass);
    button.innerText = text;
    button.addEventListener('click', function(e){
        eventListener(e);
    });

    // add onclick='popUp()'
    if(buttonTypeClass === 'red') {
        button.setAttribute('onclick', 'popUp()');
    }

    return button;
};


function addBookToCompleted(bookElement) {
    const bookTitle = bookElement.querySelector('h3').innerText;
    const par = bookElement.querySelectorAll('p');
    const bookAuthor = par[0].innerText;
    const bookYear = par[1].innerText;

    const newBook = makeBookItem(bookTitle, bookAuthor, bookYear, true);
    const book = findBook(bookElement[BOOK_ITEMID]);
    book.isComplete = true;
    newBook[BOOK_ITEMID] = book.id;

    const completedShelf = document.getElementById(COMPLETED_BOOK_ID);
    completedShelf.append(newBook);
    bookElement.remove();

    updateDataToStorage();
};

// function createCheckButton and trigger addBookToCompleted
function createCheckButton() {
    return createButton('green', function(e) {
        addBookToCompleted(e.target.parentElement.parentElement);
    },
    'Selesai dibaca');
};


// function remove book
function removeBookFromCompleted(bookElement /* HTMLElement */) {
    const bookPosition = findBookIndex(bookElement[BOOK_ITEMID]);
    
    // event that'll happpen from pop-up box's choice ['hapus buku' or 'batal']
    const no = document.querySelector('.btns .btn1');
    const yes = document.querySelector('.btns .btn2');
    const popUpBox = document.querySelector('main > .box');

    yes.addEventListener('click', function(){
        books.splice(bookPosition, 1);
    bookElement.remove();

    popUpBox.style.visibility = 'hidden';

    updateDataToStorage();
    });

    no.addEventListener('click', function(){
        popUpBox.style.visibility = 'hidden';
    });
    
};

// function pop-up: box appears
function popUp() {
    const popUpBox = document.querySelector('main > .box');
    popUpBox.style.visibility = 'visible';
};

// function button hapus buku
function createTrashButton() {
    return createButton('red', function(e){
        removeBookFromCompleted(e.target.parentElement.parentElement);
    }
    , 'Hapus buku');
};


// function undo: book from complete to incomplete
function undoBookFromCompleted(bookElement) {
    const incompletedShelf = document.getElementById(INCOMPLETED_BOOK_ID);
    const bookTitle = bookElement.querySelector('h3').innerText;
    const par = bookElement.querySelectorAll('p');
    const bookAuthor = par[0].innerText;
    const bookYear = par[1].innerText;

    const newBook = makeBookItem(bookTitle, bookAuthor, bookYear, false)

    const book = findBook(bookElement[BOOK_ITEMID]);
    book.isComplete = false;
    newBook[BOOK_ITEMID] = book.id;

    incompletedShelf.append(newBook);
    bookElement.remove();

    updateDataToStorage();
};

// function createUndo
function createUndoButton() {
    return createButton('green', function(e){
        undoBookFromCompleted(e.target.parentElement.parentElement);
    }
    , 'Belum selesai dibaca');
};


// function searchBook
// filter const books based on the title submitted

function searchBook() {
    const inputTitle = document.getElementById('searchBookTitle').value;
    const bookFiltered = books.filter(a => a.title === inputTitle);

    // if(ada title yang sama dengan input): simpan value, lalu munculkan di searchBox. else: alert not found
    if(bookFiltered.length !== 0){
        const searchContainer = document.querySelector('#searchBookshelfList');
        const newBook = makeBookItemSearch(bookFiltered[0].title, bookFiltered[0].author, bookFiltered[0].year, bookFiltered[0].isComplete);
        searchContainer.append(newBook);
    } else {
        // alert custom/dialog box
        const alerta = document.querySelector('main .box2')
        const close = document.querySelector('.box2 .btns span');

        alerta.style.visibility = 'visible';

        close.addEventListener('click', function(){
            alerta.style.visibility = 'hidden';
        });
    };

};

// function createBookItem for search section
function makeBookItemSearch(title, author, year, isComplete){
    const textTitle = document.createElement('h3');
    textTitle.innerText = title;

    const textAuthor = document.createElement('p');
    textAuthor.innerText = `Penulis: ${author}`;

    const textYear = document.createElement('p');
    textYear.innerText = `Tahun: ${year}`;

    const textStatus = document.createElement('p');
    if(isComplete) {
        textStatus.innerText = 'Status: Selesai dibaca';
    } else {
        textStatus.innerText = 'Status: Belum selesai dibaca';
    }

    const container = document.createElement('article');
    container.classList.add('book_item', 'search_item');
    container.append(textTitle, textAuthor, textYear, textStatus);

    const buttonsDiv = document.createElement('div');
    buttonsDiv.classList.add('action');
    buttonsDiv.append(createButton('red1', function(e){
        e.target.parentElement.parentElement.remove();
    }, 'Hapus'));
    container.append(buttonsDiv);

    return container;
};