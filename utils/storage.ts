
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

// --- LocalStorage Wrapper ---
export const LocalStore = {
    get: (key: string, def: any) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : def;
        } catch { return def; }
    },
    set: (key: string, value: any) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) { console.error("LS Error", e); }
    }
};

// --- IndexedDB Wrapper for High Volume Logs ---
const DB_NAME = 'TopBot_Telemetry_DB';
const STORE_NAME = 'packets';
const DB_VERSION = 1;

export const PacketDB = {
    db: null as IDBDatabase | null,

    async init() {
        return new Promise<void>((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = () => {
                console.error("IndexedDB error");
                reject();
            };

            request.onsuccess = (event) => {
                this.db = (event.target as IDBOpenDBRequest).result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
                    store.createIndex('timestamp', 'timestamp', { unique: false });
                }
            };
        });
    },

    async logPacket(packet: any) {
        if (!this.db) await this.init();
        
        return new Promise<void>((resolve) => {
            if (!this.db) return resolve();
            
            const transaction = this.db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            
            // Limit store size - delete old if too many (naive implementation)
            // In a real app, use a cursor to delete old entries
            
            store.put(packet);
            resolve();
        });
    },

    async getRecentPackets(limit = 50): Promise<any[]> {
        if (!this.db) await this.init();

        return new Promise((resolve) => {
            if (!this.db) return resolve([]);
            
            const transaction = this.db.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const index = store.index('timestamp');
            const request = index.openCursor(null, 'prev');
            
            const results: any[] = [];
            
            request.onsuccess = (event) => {
                const cursor = (event.target as IDBRequest).result;
                if (cursor && results.length < limit) {
                    results.push(cursor.value);
                    cursor.continue();
                } else {
                    resolve(results);
                }
            };
        });
    }
};
