import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  Timestamp,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { startOfDay } from 'date-fns';

const firebaseConfig = {
  apiKey: "AIzaSyANlKJSJP8tNrcoiF1AHNTyRXo5Yqjk6Ss",
  authDomain: "regnemetoden.firebaseapp.com",
  projectId: "regnemetoden",
  storageBucket: "regnemetoden.firebasestorage.app",
  messagingSenderId: "31711630435",
  appId: "1:31711630435:web:d3242584eed36734d91456",
  measurementId: "G-3ZRRBD6229"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

console.log('Firebase initialized');

// Add auth state listener
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log('User is signed in:', user.uid);
  } else {
    console.log('No user is signed in');
  }
}, (error) => {
  console.error('Auth state change error:', error);
});

export interface WeightLossGoal {
  startWeight: number;
  targetWeight: number;
  numberOfDays: number;
  startDate: string;
  updatedAt?: Timestamp;
}

export interface DayEntry {
  weight?: number;
  date: string;
  foodEntries: { amount: number; time: string }[];
  updatedAt?: Timestamp;
  id?: string;
}

export interface UserData {
  uid: string;
  weightLossGoal: WeightLossGoal | null;
  dayEntries: DayEntry[];
}

// Auth functions
export async function signInWithGoogle() {
  try {
    console.log('Starting Google sign in...');
    const result = await signInWithPopup(auth, googleProvider);
    console.log('Google sign in successful, initializing user data...');
    await initializeUserData(result.user.uid);
    console.log('User data initialized');
    return result.user;
  } catch (error: any) {
    console.error('Google sign in error:', error);
    throw new Error(error.message);
  }
}

export async function signInWithEmail(email: string, password: string) {
  try {
    console.log('Starting email sign in...');
    const result = await signInWithEmailAndPassword(auth, email, password);
    console.log('Email sign in successful');
    return result.user;
  } catch (error: any) {
    console.error('Email sign in error:', error);
    throw new Error(error.message);
  }
}

export async function signUpWithEmail(email: string, password: string) {
  try {
    console.log('Starting email sign up...');
    const result = await createUserWithEmailAndPassword(auth, email, password);
    console.log('Email sign up successful, initializing user data...');
    await initializeUserData(result.user.uid);
    console.log('User data initialized');
    return result.user;
  } catch (error: any) {
    console.error('Email sign up error:', error);
    throw new Error(error.message);
  }
}

export async function signOutUser() {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error('Error signing out:', error);
    throw new Error(error.message);
  }
}

export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

// Data functions
export async function saveWeightLossGoal(uid: string, goal: WeightLossGoal) {
  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, { 
    weightLossGoal: {
      ...goal,
      updatedAt: Timestamp.now()  
    }
  }, { merge: true });
}

export async function saveDayEntry(uid: string, entry: DayEntry) {
  const dayEntryRef = doc(db, 'users', uid, 'dayEntries', startOfDay(new Date(entry.date)).toISOString());
  await setDoc(dayEntryRef, {
    ...entry,
    updatedAt: Timestamp.now()  
  });
}

export async function getWeightLossGoal(uid: string): Promise<WeightLossGoal | null> {
  const userRef = doc(db, 'users', uid);
  const userDoc = await getDoc(userRef);
  return userDoc.exists() ? userDoc.data().weightLossGoal : null;
}

export async function getDayEntries(uid: string): Promise<DayEntry[]> {
  const dayEntriesRef = collection(db, 'users', uid, 'dayEntries');
  const querySnapshot = await getDocs(dayEntriesRef);
  return querySnapshot.docs.map(doc => ({...doc.data(), id: doc.id} as DayEntry));
}

export async function getDayEntry(uid: string, date: Date): Promise<DayEntry | null> {
  const dayEntryRef = doc(db, 'users', uid, 'dayEntries', startOfDay(date).toISOString());
  const dayEntryDoc = await getDoc(dayEntryRef);
  return dayEntryDoc.exists() ? ({...dayEntryDoc.data(), id: dayEntryDoc.id} as DayEntry) : null;
}

export async function initializeUserData(uid: string): Promise<void> {
  try {
    console.log('Initializing user data...');
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      console.log('Creating new user document...');
      await setDoc(userRef, {
        uid,
        weightLossGoal: null,
        createdAt: Timestamp.now()
      });
      console.log('User document created');
    } else {
      console.log('User document already exists');
    }
  } catch (error: any) {
    console.error('Error initializing user data:', error);
    throw new Error(error.message);
  }
}

// Real-time listeners
export function onDayEntriesChange(uid: string, callback: (entries: DayEntry[]) => void) {
  const dayEntriesRef = collection(db, 'users', uid, 'dayEntries');
  const q = query(dayEntriesRef, orderBy('date', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const entries = snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id  
    }) as DayEntry);
    callback(entries);
  }, (error) => {
    console.error('Day entries listener error:', error);
  });
}

export function onWeightLossGoalChange(uid: string, callback: (goal: WeightLossGoal | null) => void) {
  console.log('Setting up weight loss goal listener...');
  const userRef = doc(db, 'users', uid);
  
  return onSnapshot(userRef, (doc) => {
    console.log('Weight loss goal updated:', doc.data()?.weightLossGoal);
    const data = doc.data();
    callback(data?.weightLossGoal || null);
  }, (error) => {
    console.error('Weight loss goal listener error:', error);
  });
}
