class Nodes {


    dbVersion = 2;
    dbName = 'newDatabase';
    reverseOrder = false;
    
    connent(){
    
        return new Promise((resolve, reject) =>{

            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onupgradeneeded = () =>{
                const db = request.result;

                if(!db.objectStoreNames.contains('note')){
                    db.createObjectStore('note', {keyPath:'id', autoIncrement:true});
                }
            }
    
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error.message);
            request.onblocked = () => console.log("Storage is blocked");

        })
    }

    async accessStore(accessType){
        let connent = await this.connent(); 
        let tx = connent.transaction('note', accessType); 
        return tx.objectStore('note');
    }

    async add(note){
        let store = await this.accessStore('readwrite');
        return store.add(note);
    }


    async delete(noteId){
        let store = await this.accessStore('readwrite');
        return store.delete(noteId);
    }

    async update(note){
        let store = await this.accessStore('readwrite');
        return store.put(note);
    }


    async all(){
        let note = await this.accessStore('readonly');
        return note.openCursor(null, this.reverseOrder ? 'prev' : 'next');
    }
    async clear(){
        let store = await this.accessStore('readwrite');
        return store.clear()
    }
}




