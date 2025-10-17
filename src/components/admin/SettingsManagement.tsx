import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Save,
  Settings as SettingsIcon,
  Store,
  Bell,
  Shield,
  CreditCard,
  Mail,
  Globe
} from "lucide-react";
import { toast } from "sonner";

interface SettingsManagementProps {
  settings?: any;
  onSaveSettings?: (settings: any) => void;
}

export const SettingsManagement = ({ 
  settings = {}, 
  onSaveSettings 
}: SettingsManagementProps) => {
  const [formData, setFormData] = useState({
    // Store Settings
    storeName: settings.storeName || "TRISHH",
    storeDescription: settings.storeDescription || "Premium fashion and lifestyle brand",
    storeEmail: settings.storeEmail || "contact@trishh.com",
    storePhone: settings.storePhone || "+1 (555) 123-4567",
    storeAddress: settings.storeAddress || "123 Fashion Street, NY 10001",
    currency: settings.currency || "USD",
    timezone: settings.timezone || "America/New_York",
    
    // Notification Settings
    emailNotifications: settings.emailNotifications ?? true,
    orderNotifications: settings.orderNotifications ?? true,
    lowStockAlerts: settings.lowStockAlerts ?? true,
    customerSignupNotifications: settings.customerSignupNotifications ?? false,
    
    // Security Settings
    twoFactorAuth: settings.twoFactorAuth ?? false,
    sessionTimeout: settings.sessionTimeout || 30,
    passwordMinLength: settings.passwordMinLength || 8,
    
    // Payment Settings
    paymentProvider: settings.paymentProvider || "stripe",
    acceptCreditCards: settings.acceptCreditCards ?? true,
    acceptPaypal: settings.acceptPaypal ?? true,
    acceptCrypto: settings.acceptCrypto ?? false,
    
    // Email Settings
    smtpHost: settings.smtpHost || "",
    smtpPort: settings.smtpPort || 587,
    smtpUser: settings.smtpUser || "",
    smtpPassword: settings.smtpPassword || "",
    
    // SEO Settings
    metaTitle: settings.metaTitle || "TRISHH - Premium Fashion",
    metaDescription: settings.metaDescription || "Discover premium fashion and lifestyle products at TRISHH",
    metaKeywords: settings.metaKeywords || "fashion, clothing, premium, lifestyle"
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    if (onSaveSettings) {
      onSaveSettings(formData);
    }
    toast.success("Settings saved successfully!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage your store configuration and preferences</p>
        </div>
        
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Store Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              Store Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="storeName">Store Name</Label>
              <Input
                id="storeName"
                value={formData.storeName}
                onChange={(e) => handleInputChange('storeName', e.target.value)}
                placeholder="Enter store name"
              />
            </div>
            <div>
              <Label htmlFor="storeDescription">Description</Label>
              <Textarea
                id="storeDescription"
                value={formData.storeDescription}
                onChange={(e) => handleInputChange('storeDescription', e.target.value)}
                placeholder="Enter store description"
              />
            </div>
            <div>
              <Label htmlFor="storeEmail">Contact Email</Label>
              <Input
                id="storeEmail"
                type="email"
                value={formData.storeEmail}
                onChange={(e) => handleInputChange('storeEmail', e.target.value)}
                placeholder="contact@yourstore.com"
              />
            </div>
            <div>
              <Label htmlFor="storePhone">Phone Number</Label>
              <Input
                id="storePhone"
                value={formData.storePhone}
                onChange={(e) => handleInputChange('storePhone', e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div>
              <Label htmlFor="storeAddress">Address</Label>
              <Textarea
                id="storeAddress"
                value={formData.storeAddress}
                onChange={(e) => handleInputChange('storeAddress', e.target.value)}
                placeholder="Enter store address"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="INR">INR (₹)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <Select value={formData.timezone} onValueChange={(value) => handleInputChange('timezone', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/New_York">Eastern Time</SelectItem>
                    <SelectItem value="America/Chicago">Central Time</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                    <SelectItem value="Europe/London">London</SelectItem>
                    <SelectItem value="Asia/Kolkata">India</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailNotifications">Email Notifications</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">Receive email notifications for important events</p>
              </div>
              <Switch
                id="emailNotifications"
                checked={formData.emailNotifications}
                onCheckedChange={(checked) => handleInputChange('emailNotifications', checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="orderNotifications">Order Notifications</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">Get notified when new orders are placed</p>
              </div>
              <Switch
                id="orderNotifications"
                checked={formData.orderNotifications}
                onCheckedChange={(checked) => handleInputChange('orderNotifications', checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="lowStockAlerts">Low Stock Alerts</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">Alert when product stock is running low</p>
              </div>
              <Switch
                id="lowStockAlerts"
                checked={formData.lowStockAlerts}
                onCheckedChange={(checked) => handleInputChange('lowStockAlerts', checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="customerSignupNotifications">Customer Signups</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">Notify when new customers register</p>
              </div>
              <Switch
                id="customerSignupNotifications"
                checked={formData.customerSignupNotifications}
                onCheckedChange={(checked) => handleInputChange('customerSignupNotifications', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">Add an extra layer of security to your account</p>
              </div>
              <Switch
                id="twoFactorAuth"
                checked={formData.twoFactorAuth}
                onCheckedChange={(checked) => handleInputChange('twoFactorAuth', checked)}
              />
            </div>
            <Separator />
            <div>
              <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={formData.sessionTimeout}
                onChange={(e) => handleInputChange('sessionTimeout', parseInt(e.target.value))}
                placeholder="30"
              />
            </div>
            <div>
              <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
              <Input
                id="passwordMinLength"
                type="number"
                value={formData.passwordMinLength}
                onChange={(e) => handleInputChange('passwordMinLength', parseInt(e.target.value))}
                placeholder="8"
              />
            </div>
          </CardContent>
        </Card>

        {/* Payment Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Options
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="paymentProvider">Payment Provider</Label>
              <Select value={formData.paymentProvider} onValueChange={(value) => handleInputChange('paymentProvider', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stripe">Stripe</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="square">Square</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="acceptCreditCards">Credit Cards</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">Accept Visa, Mastercard, American Express</p>
              </div>
              <Switch
                id="acceptCreditCards"
                checked={formData.acceptCreditCards}
                onCheckedChange={(checked) => handleInputChange('acceptCreditCards', checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="acceptPaypal">PayPal</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">Accept PayPal payments</p>
              </div>
              <Switch
                id="acceptPaypal"
                checked={formData.acceptPaypal}
                onCheckedChange={(checked) => handleInputChange('acceptPaypal', checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="acceptCrypto">Cryptocurrency</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">Accept Bitcoin and other cryptocurrencies</p>
              </div>
              <Switch
                id="acceptCrypto"
                checked={formData.acceptCrypto}
                onCheckedChange={(checked) => handleInputChange('acceptCrypto', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Email Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="smtpHost">SMTP Host</Label>
              <Input
                id="smtpHost"
                value={formData.smtpHost}
                onChange={(e) => handleInputChange('smtpHost', e.target.value)}
                placeholder="smtp.gmail.com"
              />
            </div>
            <div>
              <Label htmlFor="smtpPort">SMTP Port</Label>
              <Input
                id="smtpPort"
                type="number"
                value={formData.smtpPort}
                onChange={(e) => handleInputChange('smtpPort', parseInt(e.target.value))}
                placeholder="587"
              />
            </div>
            <div>
              <Label htmlFor="smtpUser">SMTP Username</Label>
              <Input
                id="smtpUser"
                value={formData.smtpUser}
                onChange={(e) => handleInputChange('smtpUser', e.target.value)}
                placeholder="your-email@gmail.com"
              />
            </div>
            <div>
              <Label htmlFor="smtpPassword">SMTP Password</Label>
              <Input
                id="smtpPassword"
                type="password"
                value={formData.smtpPassword}
                onChange={(e) => handleInputChange('smtpPassword', e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </CardContent>
        </Card>

        {/* SEO Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              SEO Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="metaTitle">Meta Title</Label>
              <Input
                id="metaTitle"
                value={formData.metaTitle}
                onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                placeholder="Your Store - Premium Products"
              />
            </div>
            <div>
              <Label htmlFor="metaDescription">Meta Description</Label>
              <Textarea
                id="metaDescription"
                value={formData.metaDescription}
                onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                placeholder="Discover amazing products at our store..."
              />
            </div>
            <div>
              <Label htmlFor="metaKeywords">Meta Keywords</Label>
              <Input
                id="metaKeywords"
                value={formData.metaKeywords}
                onChange={(e) => handleInputChange('metaKeywords', e.target.value)}
                placeholder="fashion, clothing, accessories"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg" className="bg-blue-600 hover:bg-blue-700">
          <Save className="h-4 w-4 mr-2" />
          Save All Settings
        </Button>
      </div>
    </div>
  );
};