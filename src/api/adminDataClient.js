const STORAGE_PREFIX = 'adminData:';

const ENTITY_KEYS = {
  Vehicle: 'vehicles',
  Booking: 'bookings',
  Document: 'documents',
  User: 'users',
};

const generateId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

const nowIso = () => new Date().toISOString();

const getStorageKey = (entityName) => `${STORAGE_PREFIX}${ENTITY_KEYS[entityName] || entityName.toLowerCase()}`;

const readEntity = (entityName) => {
  const key = getStorageKey(entityName);
  const raw = localStorage.getItem(key);
  if (!raw) {
    if (entityName === 'User') {
      const seeded = [
        {
          id: 'admin-seed',
          full_name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin',
          created_date: nowIso(),
        },
      ];
      localStorage.setItem(key, JSON.stringify(seeded));
      return seeded;
    }
    return [];
  }
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

const writeEntity = (entityName, items) => {
  localStorage.setItem(getStorageKey(entityName), JSON.stringify(items));
  return items;
};

const sortItems = (items, sortKey) => {
  if (!sortKey) return items;
  const desc = sortKey.startsWith('-');
  const key = desc ? sortKey.slice(1) : sortKey;
  return [...items].sort((a, b) => {
    const av = a?.[key];
    const bv = b?.[key];
    if (av == null && bv == null) return 0;
    if (av == null) return 1;
    if (bv == null) return -1;
    if (av > bv) return desc ? -1 : 1;
    if (av < bv) return desc ? 1 : -1;
    return 0;
  });
};

const entityClient = (entityName) => ({
  async list(sortBy, limit) {
    let items = readEntity(entityName);
    items = sortItems(items, sortBy);
    if (typeof limit === 'number') {
      items = items.slice(0, limit);
    }
    return items;
  },

  async filter(criteria = {}) {
    const items = readEntity(entityName);
    return items.filter((item) =>
      Object.entries(criteria).every(([key, value]) => item?.[key] === value)
    );
  },

  async create(data) {
    const items = readEntity(entityName);
    const record = {
      id: generateId(),
      created_date: nowIso(),
      ...data,
    };
    writeEntity(entityName, [record, ...items]);
    return record;
  },

  async update(id, data) {
    const items = readEntity(entityName);
    let updatedRecord = null;
    const updatedItems = items.map((item) => {
      if (item.id !== id) return item;
      updatedRecord = {
        ...item,
        ...data,
        updated_date: nowIso(),
      };
      return updatedRecord;
    });
    writeEntity(entityName, updatedItems);
    return updatedRecord;
  },

  async delete(id) {
    const items = readEntity(entityName);
    const filtered = items.filter((item) => item.id !== id);
    writeEntity(entityName, filtered);
    return { success: true };
  },
});

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export const adminData = {
  entities: {
    Vehicle: entityClient('Vehicle'),
    Booking: entityClient('Booking'),
    Document: entityClient('Document'),
    User: entityClient('User'),
  },
  integrations: {
    Core: {
      async UploadFile({ file }) {
        const file_url = await readFileAsDataUrl(file);
        return { file_url };
      },
    },
  },
};
