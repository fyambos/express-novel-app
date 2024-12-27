import { useState, useEffect } from 'react';
import { auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';

export function useAuth() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const response = await fetch(`http://localhost:5000/api/users/${currentUser.uid}`);
        const data = await response.json();
        setUser({ ...currentUser, theme: data.theme });
      } else {
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  return user;
}
