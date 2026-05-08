import React, { useState } from 'react';
import { db } from '../lib/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
import { citiesData } from '../data/citiesData';

export default function Migration() {
  const [status, setStatus] = useState<string>('Ready to migrate');

  const migrate = async () => {
    setStatus('Migrating...');
    try {
      for (const [id, city] of Object.entries(citiesData)) {
        await setDoc(doc(db, 'cities', id), city);
      }
      setStatus('Migration completed successfully!');
    } catch (e) {
      console.error(e);
      setStatus('Migration failed: ' + (e instanceof Error ? e.message : String(e)));
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Data Migration Page</h1>
      <button 
        onClick={migrate}
        className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold"
      >
        Migrate Old City Data to Firestore
      </button>
      <div className="mt-4 p-4 border rounded">{status}</div>
    </div>
  );
}
