import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Search, 
  Users,
  Mail,
  Phone,
  MapPin,
  Eye,
  MoreHorizontal
} from "lucide-react";

interface CustomersManagementProps {
  customers?: any[];
}

export const CustomersManagement = ({ customers = [] }: CustomersManagementProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  // Use real customers data passed as props
  const displayCustomers = customers && customers.length > 0 ? customers : [];

  const filteredCustomers = displayCustomers.filter(customer => 
    customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone?.includes(searchTerm)
  );

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      "Active": "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400",
      "Inactive": "bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400", 
      "VIP": "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400"
    };
    return colors[status] || "bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400";
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Customers</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage customer accounts and information</p>
        </div>
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
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{filteredCustomers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Customers</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {filteredCustomers.filter(c => c.status === "Active").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">VIP Customers</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {filteredCustomers.filter(c => c.status === "VIP").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <Users className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${filteredCustomers.reduce((acc, c) => acc + c.totalSpent, 0).toFixed(0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search customers by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customer List ({filteredCustomers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500 dark:text-gray-400 border-b pb-3">
              <div className="col-span-3">Customer</div>
              <div className="col-span-2">Contact</div>
              <div className="col-span-2">Orders</div>
              <div className="col-span-2">Total Spent</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1">Actions</div>
            </div>

            {/* Customers List */}
            {filteredCustomers.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-2">
                  <Users className="h-12 w-12 mx-auto mb-4" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No customers found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchTerm 
                    ? "Try adjusting your search criteria" 
                    : "Customers will appear here when they create accounts"
                  }
                </p>
              </div>
            ) : (
              filteredCustomers.map((customer) => (
                <div key={customer.id} className="grid grid-cols-12 gap-4 items-center py-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors">
                  <div className="col-span-3 flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={customer.avatar} alt={customer.name} />
                      <AvatarFallback className="bg-blue-600 text-white text-sm">
                        {getInitials(customer.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {customer.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Joined {customer.joinDate}
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Mail className="h-3 w-3" />
                        {customer.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Phone className="h-3 w-3" />
                        {customer.phone}
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {customer.totalOrders} orders
                      </div>
                      <div className="text-gray-500 dark:text-gray-400">
                        Last: {customer.lastOrder}
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2 font-medium text-gray-900 dark:text-white">
                    ${customer.totalSpent.toFixed(2)}
                  </div>
                  <div className="col-span-2">
                    <Badge 
                      variant="secondary"
                      className={`text-xs px-2 py-1 ${getStatusColor(customer.status)}`}
                    >
                      {customer.status}
                    </Badge>
                  </div>
                  <div className="col-span-1">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 w-8 p-0"
                      onClick={() => setSelectedCustomer(customer)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Customer Details Modal */}
      <Dialog open={!!selectedCustomer} onOpenChange={(open) => !open && setSelectedCustomer(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={selectedCustomer?.avatar} alt={selectedCustomer?.name} />
                <AvatarFallback className="bg-blue-600 text-white">
                  {selectedCustomer && getInitials(selectedCustomer.name)}
                </AvatarFallback>
              </Avatar>
              Customer Details - {selectedCustomer?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-6">
              {/* Customer Overview */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Contact Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span>{selectedCustomer.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{selectedCustomer.phone}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                      <span>{selectedCustomer.address}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Account Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-500">Status:</span> 
                      <Badge className={`ml-2 ${getStatusColor(selectedCustomer.status)}`}>
                        {selectedCustomer.status}
                      </Badge>
                    </div>
                    <div><span className="text-gray-500">Join Date:</span> {selectedCustomer.joinDate}</div>
                    <div><span className="text-gray-500">Last Order:</span> {selectedCustomer.lastOrder}</div>
                  </div>
                </div>
              </div>

              {/* Order Statistics */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Order Statistics</h4>
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {selectedCustomer.totalOrders}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Total Orders</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        ${selectedCustomer.totalSpent.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Total Spent</div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Recent Activity</h4>
                <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <div>• Last order placed on {selectedCustomer.lastOrder}</div>
                  <div>• Customer since {selectedCustomer.joinDate}</div>
                  <div>• Average order value: ${(selectedCustomer.totalSpent / selectedCustomer.totalOrders).toFixed(2)}</div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};