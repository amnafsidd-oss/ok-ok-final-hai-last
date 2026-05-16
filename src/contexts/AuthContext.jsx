import React, { createContext, useContext, useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (pb.authStore.isValid) {
          // Optionally refresh the token to ensure it's still valid
          const authData = await pb.collection('users').authRefresh({ $autoCancel: false });
          setCurrentUser(authData.record);
        }
      } catch (error) {
        console.error('Auth refresh failed:', error);
        pb.authStore.clear();
        setCurrentUser(null);
      } finally {
        setInitialLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const authData = await pb.collection('users').authWithPassword(email, password, { $autoCancel: false });
      setCurrentUser(authData.record);
      console.log('[AUTH] Token after login:', pb.authStore.token);
      return authData;
    } catch (error) {
      console.error('Login failed in AuthContext:', error);
      throw error;
    }
  };

  const signup = async (userData) => {
    try {
      const record = await pb.collection('users').create({
        ...userData,
        passwordConfirm: userData.password
      }, { $autoCancel: false });
      
      await pb.collection('users').authWithPassword(userData.email, userData.password, { $autoCancel: false });
      setCurrentUser(pb.authStore.model);
      console.log('[AUTH] Token after signup:', pb.authStore.token);
      return record;
    } catch (error) {
      console.error('Signup failed in AuthContext:', error);
      throw error;
    }
  };

  const logout = () => {
    pb.authStore.clear();
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    token: pb.authStore.token,
    login,
    signup,
    logout,
    isAuthenticated: pb.authStore.isValid
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground font-medium">Loading ZayToo...</p>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};