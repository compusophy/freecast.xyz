import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCQ43cwItFLOMWRGfDVIEfXCSkX5_iOfBg",
  appId: "1:715758479245:web:06999403aeda67596affc4",
  authDomain: "compusophy-db.firebaseapp.com",
  databaseURL: "https://compusophy-db-default-rtdb.firebaseio.com",
  messagingSenderId: "715758479245",
  projectId: "compusophy-db",
  storageBucket: "compusophy-db.firebasestorage.app",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

// Initialize database structure
export async function initializeDatabase() {
  const rootRef = ref(db, 'compusophy');
  const snapshot = await get(rootRef);

  if (!snapshot.exists()) {
    // Initialize with empty but valid structure
    await set(rootRef, {
      users: {
        // Empty users object, will be populated as users interact
        _initialized: true // marker to show structure exists
      }
    });
  }
}

// Test database connection and structure
export async function testDatabaseConnection(): Promise<boolean> {
  const testData = {
    token: "test_token",
    url: "https://test.url",
  };

  // Write test to the new structure
  const testRef = ref(db, 'compusophy/users/test/notifications');
  
  try {
    await set(testRef, testData);
    const testSnapshot = await get(testRef);
    return testSnapshot.exists();
  } catch {
    throw new Error("Database connection test failed");
  }
}
