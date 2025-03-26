import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from "@/FirebaseConfig"; // Adjust the path to your Firebase config

type UserType = User | null | undefined;

type AuthContextType = {
  user: UserType,
  loading: boolean,
  loggedIn: boolean,
  reload: () => void
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  loggedIn: false,
  reload: () => {}
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserType>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoggedIn(user ? true : false);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const reload = async () => {
    await auth.currentUser?.reload();
    setUser(Object.create(auth.currentUser));
  }

  return (
    <AuthContext.Provider value={{ user, loading, loggedIn, reload }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);