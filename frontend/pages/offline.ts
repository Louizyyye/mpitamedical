// src/lib/db/indexedDB.ts
import { openDB, DBSchema } from 'idb';

interface MedicalAppDB extends DBSchema {
  appointments: {
    key: string;
    value: {
      id: string;
      patientId: string;
      doctorId: string;
      datetime: Date;
      status: string;
      syncedAt?: Date;
    };
    indexes: { 'by-patient': string; 'by-sync': Date };
  };
  pendingSync: {
    key: string;
    value: {
      type: 'create' | 'update' | 'delete';
      collection: string;
      data: any;
      timestamp: Date;
    };
  };
}

export const initDB = async () => {
  return openDB<MedicalAppDB>('medical-app', 1, {
    upgrade(db) {
      const appointmentStore = db.createObjectStore('appointments', {
        keyPath: 'id',
      });
      appointmentStore.createIndex('by-patient', 'patientId');
      appointmentStore.createIndex('by-sync', 'syncedAt');
      
      db.createObjectStore('pendingSync', {
        keyPath: 'id',
        autoIncrement: true,
      });
    },
  });
};

// src/services/syncService.ts
export class SyncService {
  private syncInProgress = false;
  private db;

  constructor() {
    this.db = initDB();
  }

    async syncData(): Promise<void> {

    if (this.syncInProgress || !navigator.onLine) return;
    
    this.syncInProgress = true;
    try {
      const db = await this.db;
      const pendingSync = await db.getAll('pendingSync');
      
      for (const item of pendingSync) {
        try {
          await this.processSyncItem(item);
          await db.delete('pendingSync', item.id);
        } catch (error) {
          console.error('Sync failed for item:', item, error.message);
        }
      }
    } finally {
      this.syncInProgress = false;
    }
  }

  private async processSyncItem(item: { type: string; collection: string; data: any; timestamp: Date; }) {
    const response = await fetch(`/api/${item.collection}`, {
      method: item.type === 'create' ? 'POST' : 
             item.type === 'update' ? 'PUT' : 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item.data),
    });
    
    if (!response.ok) throw new Error('Sync failed');
    return response.json();
  }
}
