/* ============================================================
   AMDOX ERP — Database Core Engine
   localStorage-backed CRUD store
   ============================================================ */
const DB_VERSION = '1.0.4';

const db = {
  _store: {},
  _key: 'amdox_erp_db',

  // Initialize or load from localStorage
  init(seedData) {
    const saved = localStorage.getItem(this._key);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed._version === DB_VERSION) {
          this._store = parsed;
          console.log('📦 Database loaded from localStorage');
          return;
        }
      } catch(e) { /* corrupt data, re-seed */ }
    }
    this._store = { _version: DB_VERSION, ...seedData };
    this._save();
    console.log('🌱 Database seeded with fresh data');
  },

  _save() {
    try { localStorage.setItem(this._key, JSON.stringify(this._store)); } catch(e) { console.warn('DB save failed', e); }
  },

  // Create a table accessor
  table(name) {
    const self = this;
    if (!self._store[name]) { self._store[name] = []; self._save(); }
    return {
      getAll() { return [...(self._store[name] || [])]; },
      getById(id) { return (self._store[name] || []).find(r => String(r.id) === String(id)); },
      find(fn) { return (self._store[name] || []).filter(fn); },
      findOne(fn) { return (self._store[name] || []).find(fn); },
      count(fn) { return fn ? this.find(fn).length : (self._store[name] || []).length; },
      create(record) {
        const r = { id: self._nextId(name), ...record, _createdAt: new Date().toISOString() };
        self._store[name].push(r);
        self._save();
        return r;
      },
      update(id, changes) {
        const idx = (self._store[name] || []).findIndex(r => String(r.id) === String(id));
        if (idx === -1) return null;
        self._store[name][idx] = { ...self._store[name][idx], ...changes, _updatedAt: new Date().toISOString() };
        self._save();
        return self._store[name][idx];
      },
      delete(id) {
        const idx = (self._store[name] || []).findIndex(r => String(r.id) === String(id));
        if (idx === -1) return false;
        self._store[name].splice(idx, 1);
        self._save();
        return true;
      },
      sum(field) { return (self._store[name] || []).reduce((s, r) => s + (Number(r[field]) || 0), 0); }
    };
  },

  _nextId(table) {
    const records = this._store[table] || [];
    return records.length ? Math.max(...records.map(r => r.id || 0)) + 1 : 1;
  },

  // Reset to seed data
  reset(seedData) {
    this._store = { _version: DB_VERSION, ...seedData };
    this._save();
    console.log('🔄 Database reset');
  },

  // Export all data
  export() { return JSON.parse(JSON.stringify(this._store)); }
};
