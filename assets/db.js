/**
 * Refuel Assist IndexedDB Utility
 * Lightweight, zero-dependency, asynchronous database layer with seamless localStorage fallback.
 */

const db = {
  dbName: 'refuel_assist_db',
  dbVersion: 1,
  _dbPromise: null,

  /**
   * Initializes the IndexedDB database.
   * Returns a promise resolving to the IDBDatabase instance, or null if unsupported/failed.
   */
  init() {
    if (this._dbPromise) return this._dbPromise;
    this._dbPromise = new Promise((resolve) => {
      if (!window.indexedDB) {
        console.warn('IndexedDB is not supported in this browser. Falling back to localStorage.');
        resolve(null);
        return;
      }
      try {
        const request = indexedDB.open(this.dbName, this.dbVersion);
        request.onerror = (e) => {
          console.error('IndexedDB open error:', e.target ? e.target.error : e);
          resolve(null);
        };
        request.onsuccess = (e) => {
          resolve(e.target.result);
        };
        request.onupgradeneeded = (e) => {
          const database = e.target.result;
          if (!database.objectStoreNames.contains('fuel_logs')) {
            database.createObjectStore('fuel_logs', { keyPath: 'id' });
          }
          if (!database.objectStoreNames.contains('towing_logs')) {
            database.createObjectStore('towing_logs', { keyPath: 'id' });
          }
          if (!database.objectStoreNames.contains('block_logs')) {
            database.createObjectStore('block_logs', { keyPath: 'id' });
          }
        };
      } catch (err) {
        console.error('IndexedDB open exception:', err);
        resolve(null);
      }
    });
    return this._dbPromise;
  },

  /**
   * Returns true if IndexedDB is available and initialized, false otherwise.
   */
  async isSupported() {
    const database = await this.init();
    return database !== null;
  },

  /**
   * Map database stores to legacy LocalStorage keys for fallback compatibility.
   */
  _getLegacyKey(storeName) {
    if (storeName === 'fuel_logs') return 'logs_v6';
    if (storeName === 'towing_logs') return 'ra_towing_logs';
    if (storeName === 'block_logs') return 'refuel_block_time_flights';
    return storeName;
  },

  /**
   * Returns all records from a store.
   */
  async getAll(storeName) {
    const database = await this.init();
    if (!database) {
      const legacyKey = this._getLegacyKey(storeName);
      try {
        return JSON.parse(localStorage.getItem(legacyKey) || '[]');
      } catch (e) {
        return [];
      }
    }
    return new Promise((resolve) => {
      try {
        const transaction = database.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => resolve([]);
      } catch (e) {
        resolve([]);
      }
    });
  },

  /**
   * Saves or updates a single record in a store.
   */
  async save(storeName, item) {
    const database = await this.init();
    if (!database) {
      const legacyKey = this._getLegacyKey(storeName);
      try {
        let items = JSON.parse(localStorage.getItem(legacyKey) || '[]');
        const index = items.findIndex(x => x.id === item.id);
        if (index !== -1) items[index] = item;
        else items.unshift(item);
        localStorage.setItem(legacyKey, JSON.stringify(items));
      } catch (e) {
        console.error('LocalStorage save fallback error:', e);
      }
      return;
    }
    return new Promise((resolve) => {
      try {
        const transaction = database.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put(item);
        request.onsuccess = () => resolve(true);
        request.onerror = () => resolve(false);
      } catch (e) {
        resolve(false);
      }
    });
  },

  /**
   * Saves/overwrites multiple records in a store.
   */
  async saveAll(storeName, items) {
    const database = await this.init();
    if (!database) {
      const legacyKey = this._getLegacyKey(storeName);
      try {
        localStorage.setItem(legacyKey, JSON.stringify(items));
      } catch (e) {
        console.error('LocalStorage saveAll fallback error:', e);
      }
      return;
    }
    return new Promise((resolve) => {
      try {
        const transaction = database.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const clearReq = store.clear();
        
        clearReq.onsuccess = () => {
          if (!items || items.length === 0) {
            resolve(true);
            return;
          }
          let count = 0;
          let failed = false;
          items.forEach(item => {
            const req = store.put(item);
            req.onsuccess = () => {
              count++;
              if (count === items.length) resolve(!failed);
            };
            req.onerror = () => {
              count++;
              failed = true;
              if (count === items.length) resolve(false);
            };
          });
        };
        clearReq.onerror = () => resolve(false);
      } catch (e) {
        resolve(false);
      }
    });
  },

  /**
   * Deletes a record from a store.
   */
  async delete(storeName, id) {
    const database = await this.init();
    if (!database) {
      const legacyKey = this._getLegacyKey(storeName);
      try {
        let items = JSON.parse(localStorage.getItem(legacyKey) || '[]');
        items = items.filter(x => x.id !== id);
        localStorage.setItem(legacyKey, JSON.stringify(items));
      } catch (e) {
        console.error('LocalStorage delete fallback error:', e);
      }
      return;
    }
    return new Promise((resolve) => {
      try {
        const transaction = database.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.delete(id);
        request.onsuccess = () => resolve(true);
        request.onerror = () => resolve(false);
      } catch (e) {
        resolve(false);
      }
    });
  },

  /**
   * Clears all records from a store.
   */
  async clear(storeName) {
    const database = await this.init();
    if (!database) {
      const legacyKey = this._getLegacyKey(storeName);
      localStorage.removeItem(legacyKey);
      return;
    }
    return new Promise((resolve) => {
      try {
        const transaction = database.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.clear();
        request.onsuccess = () => resolve(true);
        request.onerror = () => resolve(false);
      } catch (e) {
        resolve(false);
      }
    });
  },

  /**
   * Migrates legacy localStorage records to IndexedDB (runs once).
   */
  async migrate() {
    const database = await this.init();
    if (!database) return;

    // 1. Fuel logs
    const legacyFuel = localStorage.getItem('logs_v6');
    if (legacyFuel) {
      try {
        const items = JSON.parse(legacyFuel);
        if (Array.isArray(items) && items.length > 0) {
          await this.saveAll('fuel_logs', items);
          localStorage.removeItem('logs_v6');
          console.log('Migrated fuel logs successfully.');
        } else if (Array.isArray(items)) {
          localStorage.removeItem('logs_v6');
        }
      } catch (e) {
        console.error('Error migrating fuel logs:', e);
      }
    }

    // 2. Towing logs
    const legacyTowing = localStorage.getItem('ra_towing_logs');
    if (legacyTowing) {
      try {
        const items = JSON.parse(legacyTowing);
        if (Array.isArray(items) && items.length > 0) {
          await this.saveAll('towing_logs', items);
          localStorage.removeItem('ra_towing_logs');
          console.log('Migrated towing logs successfully.');
        } else if (Array.isArray(items)) {
          localStorage.removeItem('ra_towing_logs');
        }
      } catch (e) {
        console.error('Error migrating towing logs:', e);
      }
    }

    // 3. Block flights
    const legacyBlock = localStorage.getItem('refuel_block_time_flights');
    if (legacyBlock) {
      try {
        const items = JSON.parse(legacyBlock);
        if (Array.isArray(items) && items.length > 0) {
          await this.saveAll('block_logs', items);
          localStorage.removeItem('refuel_block_time_flights');
          console.log('Migrated block logs successfully.');
        } else if (Array.isArray(items)) {
          localStorage.removeItem('refuel_block_time_flights');
        }
      } catch (e) {
        console.error('Error migrating block logs:', e);
      }
    }
  }
};

// Initiate migration automatically
try {
  db.migrate().catch(err => console.error('Migration failed:', err));
} catch (e) {}
