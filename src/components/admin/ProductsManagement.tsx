import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/ui/image-upload";
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2,
  MoreHorizontal,
  Package
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ProductsManagementProps {
  products?: any[];
  onCreateProduct?: (product: any) => void;
  onUpdateProduct?: (id: string, product: any) => void;
  onDeleteProduct?: (id: string) => void;
}

export const ProductsManagement = ({ 
  products = [], 
  onCreateProduct, 
  onUpdateProduct, 
  onDeleteProduct 
}: ProductsManagementProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTag, setFilterTag] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    images: [] as string[],
    tags: []
  });

  // Remove sample data - only show real products
  const displayProducts = products || [];
  const allTags = ["Limited", "Sale", "Newly Launched", "Fresh", "Bestseller"];

  const filteredProducts = displayProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterTag === "all" || product.tags?.includes(filterTag);
    return matchesSearch && matchesFilter;
  });

  const handleAddProduct = () => {
    if (onCreateProduct) {
      onCreateProduct({
        ...newProduct,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock)
      });
    }
    setNewProduct({ name: "", description: "", price: "", stock: "", images: [], tags: [] });
    setIsAddDialogOpen(false);
  };

  const getTagColor = (tag: string) => {
    const colors: { [key: string]: string } = {
      "Limited": "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400",
      "Sale": "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400",
      "Newly Launched": "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
      "Fresh": "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
      "Bestseller": "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400"
    };
    return colors[tag] || "bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400";
  };

  const handleClearAllProducts = async () => {
    if (window.confirm('⚠️ Are you sure you want to delete ALL products? This cannot be undone!')) {
      try {
        for (const product of displayProducts) {
          await onDeleteProduct?.(product.id);
        }
        toast({
          title: "Success",
          description: "All products have been deleted",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete some products",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage your product inventory</p>
        </div>
        
        <div className="flex gap-2">
          {displayProducts.length > 0 && (
            <Button 
              variant="destructive" 
              size="sm"
              onClick={handleClearAllProducts}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All ({displayProducts.length})
            </Button>
          )}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  placeholder="Enter product description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                    placeholder="0"
                  />
                </div>
              </div>
              <div>
                <ImageUpload
                  value={newProduct.images}
                  onChange={(images) => setNewProduct({...newProduct, images})}
                  maxImages={5}
                  label="Product Images"
                />
              </div>
              <Button onClick={handleAddProduct} className="w-full">
                Add Product
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterTag} onValueChange={setFilterTag}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tags</SelectItem>
                {allTags.map(tag => (
                  <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Product List ({filteredProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500 dark:text-gray-400 border-b pb-3">
              <div className="col-span-4">Product Name</div>
              <div className="col-span-2">Price</div>
              <div className="col-span-2">Stock</div>
              <div className="col-span-3">Tags</div>
              <div className="col-span-1">Actions</div>
            </div>

            {/* Products List */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-2">
                  <Package className="h-12 w-12 mx-auto mb-4" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchTerm || filterTag !== "all" 
                    ? "Try adjusting your search or filter criteria" 
                    : "Get started by adding your first product"
                  }
                </p>
              </div>
            ) : (
              filteredProducts.map((product) => (
                <div key={product.id} className="grid grid-cols-12 gap-4 items-center py-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors">
                  <div className="col-span-4 flex items-center gap-3">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {product.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-48">
                        {product.description}
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2 font-medium text-gray-900 dark:text-white">
                    ${product.price}
                  </div>
                  <div className="col-span-2 text-gray-600 dark:text-gray-400">
                    {product.stock}
                  </div>
                  <div className="col-span-3">
                    <div className="flex flex-wrap gap-1">
                      {product.tags?.map((tag: string, index: number) => (
                        <Badge 
                          key={index} 
                          variant="secondary"
                          className={`text-xs px-2 py-1 ${getTagColor(tag)}`}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <div className="flex gap-1">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 p-0"
                        onClick={() => onUpdateProduct?.(product.id, product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        onClick={() => onDeleteProduct?.(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};