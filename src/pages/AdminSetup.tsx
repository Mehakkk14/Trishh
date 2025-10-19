import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { setupAdminUser, checkUserRole, AdminSetupData } from '@/utils/adminSetup';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Shield, UserCheck, Settings, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export const AdminSetup = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [userRole, setUserRole] = useState<AdminSetupData | null>(null);
  const [isCheckingRole, setIsCheckingRole] = useState(true);

  useEffect(() => {
    if (user) {
      checkCurrentUserRole();
    }
  }, [user]);

  const checkCurrentUserRole = async () => {
    if (!user) return;
    
    setIsCheckingRole(true);
    try {
      const role = await checkUserRole(user.uid);
      setUserRole(role);
    } catch (error) {
      console.error('Error checking user role:', error);
    } finally {
      setIsCheckingRole(false);
    }
  };

  const handleSetupAdmin = async () => {
    if (!user) {
      toast.error('No user logged in');
      return;
    }

    setIsLoading(true);
    try {
      const success = await setupAdminUser(user.uid, user.email || '');
      
      if (success) {
        toast.success('Admin role granted successfully!');
        await checkCurrentUserRole(); // Refresh user role
      } else {
        toast.error('Failed to grant admin role');
      }
    } catch (error) {
      console.error('Error setting up admin:', error);
      toast.error('Error setting up admin role');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <CardTitle>Admin Setup</CardTitle>
            <CardDescription>Please log in to set up admin access</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Admin Access Setup</h1>
          <p className="text-muted-foreground mt-2">
            Configure admin permissions for your account
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Current User Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="font-mono text-sm">{user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">User ID</label>
                <p className="font-mono text-xs">{user.uid}</p>
              </div>
            </div>

            {isCheckingRole ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span className="text-sm text-muted-foreground">Checking role...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-muted-foreground">Current Role:</label>
                {userRole ? (
                  <Badge variant={userRole.role === 'admin' ? 'default' : 'secondary'}>
                    {userRole.role}
                  </Badge>
                ) : (
                  <Badge variant="outline">No role assigned</Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {userRole?.role === 'admin' ? (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>You already have admin access! You can now access the admin panel.</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.location.href = '/admin'}
              >
                Go to Admin Panel
              </Button>
            </AlertDescription>
          </Alert>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Grant Admin Access
              </CardTitle>
              <CardDescription>
                Click the button below to grant admin privileges to your account.
                This will allow you to access the admin panel and manage the store.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Important:</strong> This will grant full administrative access to your account.
                  Only proceed if you are the site owner/administrator.
                </AlertDescription>
              </Alert>
              
              <Button 
                onClick={handleSetupAdmin}
                disabled={isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Setting up admin access...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Grant Admin Access
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>What does admin access include?</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Manage products (create, edit, delete)</li>
              <li>• View and process customer orders</li>
              <li>• Access analytics and reports</li>
              <li>• Manage user accounts</li>
              <li>• Send email notifications</li>
              <li>• Full store administration</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};