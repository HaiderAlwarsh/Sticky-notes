const NoteObject = new Nodes();
window.onload = getAllNode;

document.addEventListener('submit', (e) =>{
    e.preventDefault()

    let target = e.target;
    
        if(target && target.classList.contains('add-note')){
            addNote(target)
            
        }else if (target && target.classList.contains('update-note')){
            let note = {id: parseInt(target.dataset.id), text: target.querySelector('textarea').value}
            updateNote(note);
        }
})

document.addEventListener('click', (e) => {
    let {target} = e;

    if(target && target.classList.contains('delete')){
        let noteId = parseInt(target.dataset.id)
        deleteNote(noteId)

    }else if(target && target.classList.contains('edit')){
        editNote(target);

    }else if(target && target.classList.contains('reverse-btn')){
        reverseOrder();
    }else if (target && target.classList.contains('delete-all')){
        clearAllNotes();
    }

})

// To reverse note order
async function reverseOrder(){
    NoteObject.reverseOrder = !NoteObject.reverseOrder;
    getAllNode();
}

// To add new nots
async function addNote(target){
    let textarea = target.querySelector('textarea');
    let newNot = textarea.value;
    let addNote = await NoteObject.add({text: newNot});

    addNote.onsuccess = () => {
        textarea.value = '';
        getAllNode();
    }
}

//Delete note with it's ID
async function deleteNote(noteID) {
    if(confirm('Are you sure?')){
        
        let deleteNote = await NoteObject.delete(noteID);

        deleteNote.onsuccess = () => {
            document.getElementById('note-'+noteID).remove();
    }
    }else{
        return false;
    }
}

// will call when click on edit icon
function editNote(note) {
    let noteContainer = document.getElementById('note-' + note.dataset.id);
    let oldText = noteContainer.querySelector('.textNote').textContent;

    noteContainer.innerHTML = `
    <form class="update-note" data-id='${note.dataset.id}'>
        <textarea>${oldText}</textarea>
        <button class="btn" type='submit'>تحديث</button>
    </form>
    `

}

// Update note and send it to database
async function updateNote(note){
    
    let updateNote = await NoteObject.update(note);

    updateNote.onsuccess = getAllNode;
}

// Get all notes via cursor, then save them into array
async function getAllNode() {
    
    let curRequest = await NoteObject.all();
    let notesArray = [];

    curRequest.onsuccess = () => {
        let cursor = curRequest.result;
            
        if(cursor){
            notesArray.push(cursor.value)
            cursor.continue();
        }else{
            displayNotes(notesArray)
        }
    }
}

//Display all note in UL
function displayNotes (notes){

    let ULElement = document.createElement('ul');

    notes.forEach(element => {

        let LIElement = document.createElement('li');
        let note = element;
        LIElement.className = 'note'
        LIElement.id = 'note-' + element.id;
        LIElement.innerHTML = `
            <div class="">
                <img class='delete' data-id='${note.id}' src="imgs/delete-icon.png">
                <img class='edit' data-id='${note.id}' src="imgs/edit-icon.png">
            </div>
            <div class='textNote'>${note.text}</div>
        `
        ULElement.appendChild(LIElement);

    });
    document.querySelector('#notes').innerHTML = '';
    document.querySelector('#notes').appendChild(ULElement);
}

// Delete all note from IndexedDB
async function clearAllNotes(){

    if(confirm("Are you sure?")){
        let clear = await NoteObject.clear();
        clear.onsuccess = getAllNode;
    }else{
        return false;
    }
    
}


