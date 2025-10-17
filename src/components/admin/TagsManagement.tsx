import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  Tag,
  Hash
} from "lucide-react";

interface TagsManagementProps {
  tags?: any[];
  onCreateTag?: (tag: any) => void;
  onUpdateTag?: (id: string, tag: any) => void;
  onDeleteTag?: (id: string) => void;
}

export const TagsManagement = ({ 
  tags = [], 
  onCreateTag, 
  onUpdateTag, 
  onDeleteTag 
}: TagsManagementProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<any>(null);
  const [newTag, setNewTag] = useState({
    name: "",
    description: "",
    color: "blue",
    category: "product"
  });

  // Sample data if no tags provided
  const sampleTags = [
    {
      id: "1",
      name: "Limited",
      description: "Limited edition products with exclusive availability",
      color: "red",
      category: "promotion",
      productCount: 12,
      createdAt: "2023-10-01"
    },
    {
      id: "2", 
      name: "Sale",
      description: "Products currently on sale with discounted prices",
      color: "green",
      category: "promotion",
      productCount: 8,
      createdAt: "2023-09-15"
    },
    {
      id: "3",
      name: "Newly Launched",
      description: "Recently launched products in our catalog",
      color: "blue",
      category: "product",
      productCount: 15,
      createdAt: "2023-10-10"
    },
    {
      id: "4",
      name: "Fresh",
      description: "Fresh arrival products with modern design",
      color: "purple",
      category: "product",
      productCount: 6,
      createdAt: "2023-10-05"
    },
    {
      id: "5",
      name: "Bestseller",
      description: "Top selling products based on customer demand",
      color: "yellow",
      category: "performance",
      productCount: 20,
      createdAt: "2023-08-20"
    }
  ];

  const displayTags = tags.length > 0 ? tags : sampleTags;

  const filteredTags = displayTags.filter(tag => 
    tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tag.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTagColor = (color: string) => {
    const colors: { [key: string]: string } = {
      "red": "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400",
      "green": "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400",
      "blue": "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
      "purple": "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
      "yellow": "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400",
      "gray": "bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400"
    };
    return colors[color] || colors.gray;
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "product": "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300",
      "promotion": "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300",
      "performance": "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300"
    };
    return colors[category] || colors.product;
  };

  const handleAddTag = () => {
    if (onCreateTag && newTag.name) {
      onCreateTag({
        ...newTag,
        id: Date.now().toString(),
        productCount: 0,
        createdAt: new Date().toISOString().split('T')[0]
      });
    }
    setNewTag({ name: "", description: "", color: "blue", category: "product" });
    setIsAddDialogOpen(false);
  };

  const handleEditTag = (tag: any) => {
    setEditingTag(tag);
    setNewTag({
      name: tag.name,
      description: tag.description,
      color: tag.color,
      category: tag.category
    });
  };

  const handleUpdateTag = () => {
    if (onUpdateTag && editingTag) {
      onUpdateTag(editingTag.id, newTag);
    }
    setEditingTag(null);
    setNewTag({ name: "", description: "", color: "blue", category: "product" });
  };

  const tagStats = {
    total: filteredTags.length,
    product: filteredTags.filter(t => t.category === "product").length,
    promotion: filteredTags.filter(t => t.category === "promotion").length,
    performance: filteredTags.filter(t => t.category === "performance").length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tags</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage product tags and categories</p>
        </div>
        
        <Dialog open={isAddDialogOpen || !!editingTag} onOpenChange={(open) => {
          if (!open) {
            setIsAddDialogOpen(false);
            setEditingTag(null);
            setNewTag({ name: "", description: "", color: "blue", category: "product" });
          }
        }}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Tag
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingTag ? "Edit Tag" : "Add New Tag"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="tagName">Tag Name</Label>
                <Input
                  id="tagName"
                  value={newTag.name}
                  onChange={(e) => setNewTag({...newTag, name: e.target.value})}
                  placeholder="Enter tag name"
                />
              </div>
              <div>
                <Label htmlFor="tagDescription">Description</Label>
                <Textarea
                  id="tagDescription"
                  value={newTag.description}
                  onChange={(e) => setNewTag({...newTag, description: e.target.value})}
                  placeholder="Enter tag description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tagColor">Color</Label>
                  <Select value={newTag.color} onValueChange={(value) => setNewTag({...newTag, color: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="red">Red</SelectItem>
                      <SelectItem value="green">Green</SelectItem>
                      <SelectItem value="blue">Blue</SelectItem>
                      <SelectItem value="purple">Purple</SelectItem>
                      <SelectItem value="yellow">Yellow</SelectItem>
                      <SelectItem value="gray">Gray</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="tagCategory">Category</Label>
                  <Select value={newTag.category} onValueChange={(value) => setNewTag({...newTag, category: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="product">Product</SelectItem>
                      <SelectItem value="promotion">Promotion</SelectItem>
                      <SelectItem value="performance">Performance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={editingTag ? handleUpdateTag : handleAddTag} 
                  className="flex-1"
                  disabled={!newTag.name}
                >
                  {editingTag ? "Update Tag" : "Add Tag"}
                </Button>
                {editingTag && (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setEditingTag(null);
                      setNewTag({ name: "", description: "", color: "blue", category: "product" });
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
                <Hash className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Tags</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{tagStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Tag className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Product Tags</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{tagStats.product}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <Tag className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Promotion Tags</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{tagStats.promotion}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <Tag className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Performance Tags</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{tagStats.performance}</p>
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
              placeholder="Search tags by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tags Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tag List ({filteredTags.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500 dark:text-gray-400 border-b pb-3">
              <div className="col-span-3">Tag Name</div>
              <div className="col-span-4">Description</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-1">Products</div>
              <div className="col-span-1">Created</div>
              <div className="col-span-1">Actions</div>
            </div>

            {/* Tags List */}
            {filteredTags.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-2">
                  <Tag className="h-12 w-12 mx-auto mb-4" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No tags found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchTerm 
                    ? "Try adjusting your search criteria" 
                    : "Get started by creating your first tag"
                  }
                </p>
              </div>
            ) : (
              filteredTags.map((tag) => (
                <div key={tag.id} className="grid grid-cols-12 gap-4 items-center py-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors">
                  <div className="col-span-3">
                    <Badge 
                      variant="secondary"
                      className={`text-sm px-3 py-1 ${getTagColor(tag.color)}`}
                    >
                      {tag.name}
                    </Badge>
                  </div>
                  <div className="col-span-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {tag.description}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <Badge 
                      variant="outline"
                      className={`text-xs px-2 py-1 ${getCategoryColor(tag.category)}`}
                    >
                      {tag.category.charAt(0).toUpperCase() + tag.category.slice(1)}
                    </Badge>
                  </div>
                  <div className="col-span-1 text-sm text-gray-600 dark:text-gray-400">
                    {tag.productCount}
                  </div>
                  <div className="col-span-1 text-sm text-gray-600 dark:text-gray-400">
                    {tag.createdAt}
                  </div>
                  <div className="col-span-1">
                    <div className="flex gap-1">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 p-0"
                        onClick={() => handleEditTag(tag)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        onClick={() => onDeleteTag?.(tag.id)}
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