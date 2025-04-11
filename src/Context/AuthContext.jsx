import { useEffect, useState } from "react";
import { useContext } from "react";
import { createContext } from "react";
import { supabase } from "../../supabase";

const AuthContext = createContext();
export const useAuth = () => {
  return useContext(AuthContext);
};
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const sesstionCheck = async () => {
      const { data: sesstion } = await supabase.auth.getSession();
      setUser(sesstion.session?.user ?? null);
    };
    sesstionCheck();
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, sesstion) => {
        setUser(sesstion?.user ?? null);
      }
    );
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);
  const value = {
    signUp: (data) => supabase.auth.signUp(data),
    signIn: (data) => supabase.auth.signInWithPassword(data),
    signOut: () => supabase.auth.signOut(),
    user,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
