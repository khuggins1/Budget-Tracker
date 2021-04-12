

//establish connection to indexedb
let db;
const request = indexedDB.open('tracking-budget', 1);

request.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore('new_entry', { autoIncrement: true});
};

//if successful

request.onsuccess = function(event) {
    db = event.target.result;
    //check if app is online
    if (navigator.onLine) {

    }
};

request.onerror = function(event) {
    console.log(event.target.errorCode);
};

//function for user transaction

function saveRecord(record) {
    const transaction = db.transaction(['new_entry'], 'readwrite');
    const entryObjectStore = transaction.objectStore('new_entry');
    entryObjectStore.add(record);
}

function uploadTransaction() {
    const transaction = db.transaction(['new_entry'], 'readwrite');
    const entryObjectStore = transaction.objectStore('new_entry');
    const getAll = entryObjectStore.getAll();
}

// after getall execution sends to api server

getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
        fetch('/api/transaction', {
            method: 'POST',
            body: JSON.stringify(getAll.result),
            headers: {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(serverResponse => {
            if(serverResponse.message) {
                throw new Error(serverResponse);
            }
            const transaction = db.transaction(['new_entry'], 'readwrite');
            const entryObjectStore = transaction.objectStore('new_entry');
            entryObjectStore.clear();

            alert ('All saved transactions submitted');
        })
        .catch(err => {
            console.log(err);
        });
    }
};

window.addEventListener('online', uploadTransaction);