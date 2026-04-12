const DB_NAME = 'starred-report-db'
const DB_VERSION = 1
const META_STORE = 'datasetMeta'
const RECORDS_STORE = 'stargazerRecords'
const META_KEY = 'active'

function openDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = () => {
      const db = request.result

      if (!db.objectStoreNames.contains(META_STORE)) {
        db.createObjectStore(META_STORE, { keyPath: 'key' })
      }

      if (!db.objectStoreNames.contains(RECORDS_STORE)) {
        db.createObjectStore(RECORDS_STORE, { keyPath: 'id' })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('Could not open IndexedDB.'))
  })
}

function runTransaction(mode, handler) {
  return openDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const transaction = db.transaction([META_STORE, RECORDS_STORE], mode)
        transaction.oncomplete = () => {
          db.close()
          resolve()
        }
        transaction.onerror = () => {
          db.close()
          reject(transaction.error ?? new Error('IndexedDB transaction failed.'))
        }
        handler(transaction)
      }),
  )
}

export async function loadDataset() {
  const db = await openDb()

  try {
    const transaction = db.transaction([META_STORE, RECORDS_STORE], 'readonly')
    const metaStore = transaction.objectStore(META_STORE)
    const recordsStore = transaction.objectStore(RECORDS_STORE)

    const meta = await new Promise((resolve, reject) => {
      const request = metaStore.get(META_KEY)
      request.onsuccess = () => resolve(request.result?.value ?? null)
      request.onerror = () => reject(request.error ?? new Error('Could not load dataset metadata.'))
    })

    const records = await new Promise((resolve, reject) => {
      const request = recordsStore.getAll()
      request.onsuccess = () => resolve(request.result ?? [])
      request.onerror = () => reject(request.error ?? new Error('Could not load stargazer records.'))
    })

    return {
      meta,
      records,
    }
  } finally {
    db.close()
  }
}

export async function saveDataset(meta, records) {
  await runTransaction('readwrite', (transaction) => {
    const metaStore = transaction.objectStore(META_STORE)
    const recordsStore = transaction.objectStore(RECORDS_STORE)

    metaStore.put({ key: META_KEY, value: meta })
    recordsStore.clear()
    records.forEach((record, index) => {
      recordsStore.put({
        ...record,
        id: `${meta.owner}/${meta.repo}/${index}`,
      })
    })
  })
}

export async function clearDataset() {
  await runTransaction('readwrite', (transaction) => {
    transaction.objectStore(META_STORE).delete(META_KEY)
    transaction.objectStore(RECORDS_STORE).clear()
  })
}
