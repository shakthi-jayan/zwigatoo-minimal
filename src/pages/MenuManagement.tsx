import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { createMenuItem, getMenuItems, deleteMenuItem, MenuItem } from "@/firebase/firestore-service";
import { toast } from "sonner";

export default function MenuManagement() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    available: true,
  });

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "staff") {
      navigate("/dashboard");
      return;
    }

    const fetchMenuItems = async () => {
      try {
        setIsLoading(true);
        const items = await getMenuItems();
        setMenuItems(items);
      } catch (error) {
        console.error("Error fetching menu items:", error);
        toast.error("Failed to load menu items");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuItems();
  }, [isAuthenticated, user, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price) {
      toast.error("Please fill in name and price");
      return;
    }

    try {
      setIsSubmitting(true);
      await createMenuItem({
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        image: formData.image,
        available: formData.available,
      });

      toast.success("Menu item added successfully");
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        image: "",
        available: true,
      });

      // Refresh menu items
      const items = await getMenuItems();
      setMenuItems(items);
    } catch (error) {
      console.error("Error adding menu item:", error);
      toast.error("Failed to add menu item");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await deleteMenuItem(id);
      toast.success("Menu item deleted");
      setMenuItems(menuItems.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting menu item:", error);
      toast.error("Failed to delete menu item");
    }
  };

  if (!isAuthenticated || user?.role !== "staff") {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5"
    >
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 border-b">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-2"
        >
          <img src="./logo.svg" alt="Zwigatoo" width={40} height={40} className="rounded-lg" />
          <span className="font-bold text-lg">Zwigatoo</span>
        </motion.div>
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Button onClick={() => navigate("/dashboard")} variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </motion.div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col px-4 py-12">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-6xl mx-auto w-full"
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">Menu Management</h1>

          {/* Add Item Form */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-lg border bg-card mb-8"
          >
            <h2 className="text-2xl font-semibold mb-6">Add New Item</h2>
            <form onSubmit={handleAddItem} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="text"
                  name="name"
                  placeholder="Item Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  type="number"
                  name="price"
                  placeholder="Price (₹)"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="text"
                  name="category"
                  placeholder="Category (e.g., Breakfast, Lunch)"
                  value={formData.category}
                  onChange={handleInputChange}
                />
                <Input
                  type="url"
                  name="image"
                  placeholder="Image URL"
                  value={formData.image}
                  onChange={handleInputChange}
                />
              </div>
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md text-sm"
                rows={3}
              />
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="available"
                  checked={formData.available}
                  onChange={handleInputChange}
                  className="rounded"
                />
                <label className="text-sm font-medium">Available</label>
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                {isSubmitting ? "Adding..." : "Add Item"}
              </Button>
            </form>
          </motion.div>

          {/* Menu Items List */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-semibold mb-6">Current Menu Items</h2>
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading menu items...</p>
              </div>
            ) : menuItems.length === 0 ? (
              <div className="text-center py-12 p-6 rounded-lg border bg-card">
                <p className="text-muted-foreground">No menu items yet. Add one above!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item._id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="p-6 rounded-lg border bg-card hover:shadow-md transition-shadow"
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-40 object-cover rounded-md mb-4"
                      />
                    )}
                    <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                    {item.description && (
                      <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                    )}
                    {item.category && (
                      <p className="text-xs text-primary mb-2">{item.category}</p>
                    )}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-bold">₹{item.price}</span>
                      <span className={`text-xs px-2 py-1 rounded ${item.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {item.available ? "Available" : "Out of Stock"}
                      </span>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteItem(item._id)}
                      className="w-full"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
