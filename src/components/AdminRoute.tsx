import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useAdminGuard } from '@/services/securityService';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield } from 'lucide-react';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, canAccess } = useAdminGuard();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // For localhost development, allow any authenticated user
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const isDevelopment = import.meta.env.MODE === 'development';
  const allowDevelopmentAccess = (isLocalhost || isDevelopment) && user;

  // Debug logging for production
  console.log('AdminRoute Debug:', {
    user: user ? { uid: user.uid, email: user.email } : null,
    canAccess,
    isAdmin,
    isLocalhost,
    isDevelopment,
    allowDevelopmentAccess,
    hostname: window.location.hostname
  });

  // Temporary: Allow access for any authenticated user on production (REMOVE AFTER SETUP)
  const isTemporaryBypass = user && window.location.hostname.includes('vercel.app');
  
  if (!canAccess && !allowDevelopmentAccess && !isTemporaryBypass) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <Alert variant="destructive">
            <Shield className="h-4 w-4" />
            <AlertDescription className="text-center">
              <div className="space-y-4">
                <div>
                  <p className="font-semibold">Access Denied</p>
                  <p>You don't have permission to access the admin panel.</p>
                  <p className="text-sm text-muted-foreground">
                    Admin access is restricted to authorized users only.
                  </p>
                </div>
                <div className="text-xs text-muted-foreground border-t pt-2">
                  <p>Debug Info:</p>
                  <p>Email: {user?.email}</p>
                  <p>canAccess: {canAccess.toString()}</p>
                  <p>isAdmin: {isAdmin.toString()}</p>
                </div>
                <button 
                  onClick={() => window.location.href = '/admin-setup'}
                  className="text-sm text-blue-600 hover:underline"
                >
                  → Go to Admin Setup
                </button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};