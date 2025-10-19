import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/integrations/firebase/firebaseConfig';

export interface AdminSetupData {
  uid: string;
  email: string;
  role: 'admin' | 'customer';
  verified: boolean;
  createdAt: Date;
  lastLogin: Date;
}

export async function setupAdminUser(uid: string, email: string): Promise<boolean> {
  try {
    const userRef = doc(db, 'users', uid);
    
    // Check if user already exists
    const userDoc = await getDoc(userRef);
    
    const adminData: AdminSetupData = {
      uid,
      email,
      role: 'admin',
      verified: true,
      createdAt: userDoc.exists() ? userDoc.data().createdAt : new Date(),
      lastLogin: new Date()
    };

    console.log('🔧 Setting admin data:', adminData);
    await setDoc(userRef, adminData, { merge: true });
    
    // Verify the data was written
    const verifyDoc = await getDoc(userRef);
    if (verifyDoc.exists() && verifyDoc.data().role === 'admin') {
      console.log(`✅ Admin role successfully granted to: ${email}`);
      return true;
    } else {
      console.error('❌ Failed to verify admin role was set');
      return false;
    }
  } catch (error) {
    console.error('❌ Error setting up admin user:', error);
    console.error('Error details:', error);
    return false;
  }
}

export async function checkUserRole(uid: string): Promise<AdminSetupData | null> {
  try {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      return userDoc.data() as AdminSetupData;
    }
    
    return null;
  } catch (error) {
    console.error('Error checking user role:', error);
    return null;
  }
}