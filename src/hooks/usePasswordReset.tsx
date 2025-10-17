import { useState } from "react";
import { sendPasswordResetEmail, confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { auth } from "@/integrations/firebase/firebaseConfig";
import { toast } from "sonner";

interface ResetPasswordData {
  email: string;
  resetCode: string;
  newPassword: string;
}

export const usePasswordReset = () => {
  const [isLoading, setIsLoading] = useState(false);

  const sendResetEmail = async (email: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Send Firebase password reset email
      await sendPasswordResetEmail(auth, email, {
        url: `${window.location.origin}/reset-password`,
        handleCodeInApp: true,
      });

      // Optional: Send custom branded email using our email service
      // await sendPasswordReset(email, 'reset-token-placeholder');
      
      toast.success("Password reset email sent successfully!");
      return true;
    } catch (error: any) {
      console.error("Send reset email error:", error);
      
      let errorMessage = "Failed to send password reset email.";
      
      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "No account found with this email address.";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address.";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many requests. Please try again later.";
          break;
      }
      
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyResetCode = async (resetCode: string): Promise<{ isValid: boolean; email?: string }> => {
    try {
      setIsLoading(true);
      const email = await verifyPasswordResetCode(auth, resetCode);
      return { isValid: true, email };
    } catch (error: any) {
      console.error("Verify reset code error:", error);
      
      let errorMessage = "Invalid reset code.";
      
      switch (error.code) {
        case "auth/invalid-action-code":
          errorMessage = "This password reset link is invalid or has expired.";
          break;
        case "auth/expired-action-code":
          errorMessage = "This password reset link has expired. Please request a new one.";
          break;
      }
      
      toast.error(errorMessage);
      return { isValid: false };
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (resetCode: string, newPassword: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      await confirmPasswordReset(auth, resetCode, newPassword);
      toast.success("Password reset successfully!");
      return true;
    } catch (error: any) {
      console.error("Reset password error:", error);
      
      let errorMessage = "Failed to reset password.";
      
      switch (error.code) {
        case "auth/invalid-action-code":
          errorMessage = "This password reset link is invalid or has expired.";
          break;
        case "auth/expired-action-code":
          errorMessage = "This password reset link has expired. Please request a new one.";
          break;
        case "auth/weak-password":
          errorMessage = "Password is too weak. Please choose a stronger password.";
          break;
      }
      
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number");
    }
    
    if (!/[^A-Za-z0-9]/.test(password)) {
      errors.push("Password must contain at least one special character");
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const calculatePasswordStrength = (password: string): number => {
    let strength = 0;
    
    if (password.length >= 8) strength += 20;
    if (password.length >= 12) strength += 10;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[a-z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^A-Za-z0-9]/.test(password)) strength += 15;
    
    return Math.min(strength, 100);
  };

  return {
    isLoading,
    sendResetEmail,
    verifyResetCode,
    resetPassword,
    validatePassword,
    calculatePasswordStrength
  };
};