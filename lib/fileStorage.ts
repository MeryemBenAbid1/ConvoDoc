// Utility for storing files temporarily in IndexedDB
const DB_NAME = 'documentConverter'
const STORE_NAME = 'files'
const RESULT_STORE_NAME = 'results'

interface FileStorage {
  init(): Promise<void>
  storeFile(id: string, file: File): Promise<void>
  getFile(id: string): Promise<File | null>
  storeResult(id: string, blob: Blob): Promise<void>
  getResult(id: string): Promise<Blob | null>
  clear(id: string): Promise<void>
}

class IndexedDBFileStorage implements FileStorage {
  private db: IDBDatabase | null = null

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME)
        }

        if (!db.objectStoreNames.contains(RESULT_STORE_NAME)) {
          db.createObjectStore(RESULT_STORE_NAME)
        }
      }
    })
  }

  async storeFile(id: string, file: File): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.put(file, id)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async getFile(id: string): Promise<File | null> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.get(id)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result || null)
    })
  }

  async storeResult(id: string, blob: Blob): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([RESULT_STORE_NAME], 'readwrite')
      const store = transaction.objectStore(RESULT_STORE_NAME)
      const request = store.put(blob, id)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async getResult(id: string): Promise<Blob | null> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([RESULT_STORE_NAME], 'readonly')
      const store = transaction.objectStore(RESULT_STORE_NAME)
      const request = store.get(id)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result || null)
    })
  }

  async clear(id: string): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME, RESULT_STORE_NAME], 'readwrite')
      const fileStore = transaction.objectStore(STORE_NAME)
      const resultStore = transaction.objectStore(RESULT_STORE_NAME)

      fileStore.delete(id)
      resultStore.delete(id)

      transaction.oncomplete = () => resolve()
      transaction.onerror = () => reject(transaction.error)
    })
  }
}

export const fileStorage = new IndexedDBFileStorage()
