import { Shield, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const SecurityBanner = () => {
  return (
    <Alert className="mb-6 bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
      <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
      <AlertDescription className="text-green-800 dark:text-green-200">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          <span className="font-medium">Security Enhanced:</span>
          This application now features role-based admin access, secure checkout validation, and comprehensive data protection.
        </div>
      </AlertDescription>
    </Alert>
  );
};