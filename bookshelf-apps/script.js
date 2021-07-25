// preventDefault tombol submit

document.addEventListener('DOMContentLoaded', function(){
    const form = document.getElementById('inputBook');
    
    form.addEventListener('submit', function(e){
    e.preventDefault();

    addBookItem();
    });

    if(isStorageExist()) {
        loadDataFromStorage();
    };

    // preventDefault() untuk searchSubmit
    const searchForm = document.getElementById('searchBook');

    searchForm.addEventListener('submit', function(e){
        e.preventDefault();

        searchBook();
    });
});


document.addEventListener('ondatasaved', () => {
    console.log('Data berhasil disimpan');
});


document.addEventListener('ondataloaded', () => {
    refreshDataFromBooks();
});