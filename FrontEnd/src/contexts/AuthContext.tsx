import { createContext, useContext, ReactNode, useEffect, useState } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: "student" | "teacher" | null;
  userId: string | null;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userRole: null,
  userId: null,
  logout: () => {},
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<"student" | "teacher" | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Read auth info from localStorage
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole") as "student" | "teacher" | null;
    const id = localStorage.getItem("userId");

    if (token && role && id) {
      setIsAuthenticated(true);
      setUserRole(role);
      setUserId(id);
    } else {
      setIsAuthenticated(false);
      setUserRole(null);
      setUserId(null);
    }

    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setUserRole(null);
    setUserId(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, userRole, userId, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
