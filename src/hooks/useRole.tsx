import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export type UserRole = 'admin' | 'moderator' | 'user';

export const useRole = () => {
  const { user, loading: authLoading } = useAuth();
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);

  // Firebase logic: check admin by email
  const ADMIN_EMAIL = "trishhna.studio@gmail.com";
  const hasRole = (role: UserRole) => roles.includes(role);
  const isAdmin = () => user && user.email === ADMIN_EMAIL;
  const isModerator = () => hasRole('moderator');

  return {
    roles,
    loading: authLoading || loading,
    hasRole,
    isAdmin,
    isModerator,
  };
};