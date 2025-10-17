import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { emailService } from "@/services/emailService";
import { useToast } from "@/hooks/use-toast";
import { 
  Mail, 
  Send, 
  Users, 
  Settings,
  TestTube,
  Eye,
  Plus,
  History
} from "lucide-react";

interface EmailManagementProps {
  emailSettings?: any;
  onSaveSettings?: (settings: any) => void;
}

export const EmailManagement = ({ emailSettings = {}, onSaveSettings }: EmailManagementProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const sendBulkNewsletterEmails = async (emails: string[], subject: string, content: string) => {
    setIsLoading(true);
    try {
      const results = await Promise.allSettled(
        emails.map(email => emailService.sendEmail({
          to: email,
          subject,
          html: content,
        }))
      );
      
      const successful = results.filter(result => 
        result.status === 'fulfilled' && result.value === true
      ).length;
      
      const failed = emails.length - successful;
      
      if (successful > 0) {
        toast({
          title: "Newsletter Sent",
          description: `Newsletter sent to ${successful} subscribers${failed > 0 ? ` (${failed} failed)` : ''}`,
        });
      } else {
        toast({
          title: "Email Failed",
          description: "Failed to send newsletter to any subscribers",
          variant: "destructive",
        });
      }
      
      return { successful, failed };
    } catch (error) {
      console.error('Error sending bulk newsletter:', error);
      toast({
        title: "Email Error",
        description: "Failed to send newsletter",
        variant: "destructive",
      });
      return { successful: 0, failed: emails.length };
    } finally {
      setIsLoading(false);
    }
  };

  const testEmailConnection = async () => {
    try {
      return await emailService.sendEmail({
        to: 'test@example.com',
        subject: 'Test Email',
        html: 'This is a test email.',
      });
    } catch (error) {
      return false;
    }
  };

  const [activeTab, setActiveTab] = useState("compose");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  // Newsletter composition state
  const [newsletter, setNewsletter] = useState({
    subject: "",
    title: "",
    content: "",
    ctaText: "",
    ctaUrl: "",
    featuredProducts: []
  });

  // Email settings state
  const [settings, setSettings] = useState({
    orderConfirmations: emailSettings.orderConfirmations ?? true,
    shippingUpdates: emailSettings.shippingUpdates ?? true,
    passwordResets: emailSettings.passwordResets ?? true,
    welcomeEmails: emailSettings.welcomeEmails ?? true,
    newsletter: emailSettings.newsletter ?? true,
    marketingEmails: emailSettings.marketingEmails ?? false,
    smtpHost: emailSettings.smtpHost || "",
    smtpPort: emailSettings.smtpPort || 587,
    smtpUser: emailSettings.smtpUser || "",
    smtpPassword: emailSettings.smtpPassword || "",
    fromEmail: emailSettings.fromEmail || "noreply@trishh.com",
    fromName: emailSettings.fromName || "TRISHH Store"
  });

  // Real subscriber data (empty initially)
  const subscribers: any[] = [];

  // Email history data (empty initially) 
  const emailHistory: any[] = [];

  const handleSendNewsletter = async () => {
    if (!newsletter.subject || !newsletter.content) {
      toast({
        title: "Error",
        description: "Please fill in subject and content",
        variant: "destructive",
      });
      return;
    }

    const activeSubscribers = subscribers
      .filter(sub => sub.status === "active")
      .map(sub => sub.email);

    if (activeSubscribers.length === 0) {
      toast({
        title: "Error",
        description: "No active subscribers found",
        variant: "destructive",
      });
      return;
    }

    const result = await sendBulkNewsletterEmails(activeSubscribers, newsletter.subject, newsletter.content);
    
    if (result.successful > 0) {
      setNewsletter({
        subject: "",
        title: "",
        content: "",
        ctaText: "",
        ctaUrl: "",
        featuredProducts: []
      });
    }
  };

  const handleTestEmail = async () => {
    const success = await testEmailConnection();
    if (success) {
      toast({
        title: "Success",
        description: "Email connection test successful!",
      });
    }
  };

  const handleSaveSettings = () => {
    if (onSaveSettings) {
      onSaveSettings(settings);
    }
    toast({
      title: "Success",
      description: "Email settings saved!",
    });
  };

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      "Newsletter": "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
      "Order Confirmation": "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400",
      "Shipping Update": "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
      "Welcome": "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400"
    };
    return colors[type] || "bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Email Management</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage email campaigns and notifications</p>
        </div>
        
        <Button onClick={handleTestEmail} variant="outline" disabled={isLoading}>
          <TestTube className="h-4 w-4 mr-2" />
          Test Connection
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Subscribers</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{subscribers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <Mail className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Emails Sent</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">1,252</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <Send className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Open Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">24.3%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <Settings className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Campaigns</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="compose">Compose</TabsTrigger>
          <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Compose Newsletter */}
        <TabsContent value="compose" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Compose Newsletter
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="subject">Email Subject</Label>
                  <Input
                    id="subject"
                    value={newsletter.subject}
                    onChange={(e) => setNewsletter({...newsletter, subject: e.target.value})}
                    placeholder="Enter email subject"
                  />
                </div>
                <div>
                  <Label htmlFor="title">Newsletter Title</Label>
                  <Input
                    id="title"
                    value={newsletter.title}
                    onChange={(e) => setNewsletter({...newsletter, title: e.target.value})}
                    placeholder="Enter newsletter title"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={newsletter.content}
                  onChange={(e) => setNewsletter({...newsletter, content: e.target.value})}
                  placeholder="Write your newsletter content here..."
                  className="min-h-32"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ctaText">Call-to-Action Text</Label>
                  <Input
                    id="ctaText"
                    value={newsletter.ctaText}
                    onChange={(e) => setNewsletter({...newsletter, ctaText: e.target.value})}
                    placeholder="Shop Now"
                  />
                </div>
                <div>
                  <Label htmlFor="ctaUrl">Call-to-Action URL</Label>
                  <Input
                    id="ctaUrl"
                    value={newsletter.ctaUrl}
                    onChange={(e) => setNewsletter({...newsletter, ctaUrl: e.target.value})}
                    placeholder="https://trishh.com/shop"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Email Preview</DialogTitle>
                    </DialogHeader>
                    <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Preview of how the email will look to subscribers
                      </p>
                      <div className="bg-white dark:bg-gray-900 p-4 rounded border">
                        <h2 className="text-xl font-bold mb-4">{newsletter.title || "Newsletter Title"}</h2>
                        <div className="prose prose-sm max-w-none">
                          {newsletter.content.split('\n').map((paragraph, index) => (
                            <p key={index} className="mb-2">{paragraph}</p>
                          ))}
                        </div>
                        {newsletter.ctaText && (
                          <div className="mt-6">
                            <Button>{newsletter.ctaText}</Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button 
                  onClick={handleSendNewsletter} 
                  disabled={isLoading || !newsletter.subject || !newsletter.content}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isLoading ? "Sending..." : `Send to ${subscribers.filter(s => s.status === "active").length} Subscribers`}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subscribers */}
        <TabsContent value="subscribers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Newsletter Subscribers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500 dark:text-gray-400 border-b pb-3">
                  <div className="col-span-4">Email</div>
                  <div className="col-span-3">Name</div>
                  <div className="col-span-2">Subscribed</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-1">Actions</div>
                </div>

                {/* Subscribers List */}
                {subscribers.map((subscriber) => (
                  <div key={subscriber.id} className="grid grid-cols-12 gap-4 items-center py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                    <div className="col-span-4 text-sm text-gray-900 dark:text-white">
                      {subscriber.email}
                    </div>
                    <div className="col-span-3 text-sm text-gray-600 dark:text-gray-400">
                      {subscriber.name}
                    </div>
                    <div className="col-span-2 text-sm text-gray-600 dark:text-gray-400">
                      {subscriber.subscribed}
                    </div>
                    <div className="col-span-2">
                      <Badge 
                        variant="secondary"
                        className={`text-xs px-2 py-1 ${
                          subscriber.status === "active" 
                            ? "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                            : "bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400"
                        }`}
                      >
                        {subscriber.status}
                      </Badge>
                    </div>
                    <div className="col-span-1">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email History */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Email History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500 dark:text-gray-400 border-b pb-3">
                  <div className="col-span-2">Type</div>
                  <div className="col-span-4">Subject</div>
                  <div className="col-span-2">Sent Date</div>
                  <div className="col-span-2">Recipients</div>
                  <div className="col-span-2">Status</div>
                </div>

                {/* Email History List */}
                {emailHistory.map((email) => (
                  <div key={email.id} className="grid grid-cols-12 gap-4 items-center py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                    <div className="col-span-2">
                      <Badge 
                        variant="secondary"
                        className={`text-xs px-2 py-1 ${getTypeColor(email.type)}`}
                      >
                        {email.type}
                      </Badge>
                    </div>
                    <div className="col-span-4 text-sm text-gray-900 dark:text-white">
                      {email.subject}
                    </div>
                    <div className="col-span-2 text-sm text-gray-600 dark:text-gray-400">
                      {email.sent}
                    </div>
                    <div className="col-span-2 text-sm text-gray-600 dark:text-gray-400">
                      {email.recipients}
                    </div>
                    <div className="col-span-2">
                      <Badge 
                        variant="secondary"
                        className="text-xs px-2 py-1 bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                      >
                        {email.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="orderConfirmations">Order Confirmations</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Send confirmation emails for new orders</p>
                  </div>
                  <Switch
                    id="orderConfirmations"
                    checked={settings.orderConfirmations}
                    onCheckedChange={(checked) => setSettings({...settings, orderConfirmations: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="shippingUpdates">Shipping Updates</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Send shipping notifications</p>
                  </div>
                  <Switch
                    id="shippingUpdates"
                    checked={settings.shippingUpdates}
                    onCheckedChange={(checked) => setSettings({...settings, shippingUpdates: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="welcomeEmails">Welcome Emails</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Send welcome emails to new users</p>
                  </div>
                  <Switch
                    id="welcomeEmails"
                    checked={settings.welcomeEmails}
                    onCheckedChange={(checked) => setSettings({...settings, welcomeEmails: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="newsletter">Newsletter</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Allow newsletter subscriptions</p>
                  </div>
                  <Switch
                    id="newsletter"
                    checked={settings.newsletter}
                    onCheckedChange={(checked) => setSettings({...settings, newsletter: checked})}
                  />
                </div>
              </CardContent>
            </Card>

            {/* SMTP Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>SMTP Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input
                    id="smtpHost"
                    value={settings.smtpHost}
                    onChange={(e) => setSettings({...settings, smtpHost: e.target.value})}
                    placeholder="smtp.gmail.com"
                  />
                </div>

                <div>
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    type="number"
                    value={settings.smtpPort}
                    onChange={(e) => setSettings({...settings, smtpPort: parseInt(e.target.value)})}
                    placeholder="587"
                  />
                </div>

                <div>
                  <Label htmlFor="fromEmail">From Email</Label>
                  <Input
                    id="fromEmail"
                    type="email"
                    value={settings.fromEmail}
                    onChange={(e) => setSettings({...settings, fromEmail: e.target.value})}
                    placeholder="noreply@trishh.com"
                  />
                </div>

                <div>
                  <Label htmlFor="fromName">From Name</Label>
                  <Input
                    id="fromName"
                    value={settings.fromName}
                    onChange={(e) => setSettings({...settings, fromName: e.target.value})}
                    placeholder="TRISHH Store"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSaveSettings} className="bg-blue-600 hover:bg-blue-700">
              <Settings className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};