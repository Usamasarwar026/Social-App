import './App.css';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from './redux/slices/authSlice';
import { auth, db } from './configure/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import Routing from './routing/Routing';
import { Toaster } from 'sonner';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // One-time listener that resolves auth state on mount
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const docSnap = await getDoc(doc(db, 'users', firebaseUser.uid));
          dispatch(setUser(docSnap.exists() ? docSnap.data() : null));
        } catch {
          dispatch(setUser(null));
        }
      } else {
        dispatch(setUser(null));
      }
    });
    return () => unsubscribe(); // cleanup on unmount
  }, [dispatch]);

  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      <Routing />
    </>
  );
}

export default App;
