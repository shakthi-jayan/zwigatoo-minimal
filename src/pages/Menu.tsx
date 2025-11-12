import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { getMenuItems, StoredMenuItem } from "@/lib/storage";
import { toast } from "sonner";

export default function Menu() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState<StoredMenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
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
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
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
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">Browse Menu</h1>
          <p className="text-muted-foreground mb-8">Explore our delicious offerings</p>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <ShoppingCart className="h-12 w-12 text-primary" />
              </motion.div>
            </div>
          ) : menuItems.length === 0 ? (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center py-20"
            >
              <p className="text-lg text-muted-foreground mb-4">No menu items available yet</p>
              <Button onClick={() => navigate("/dashboard")} variant="outline">
                Return to Dashboard
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {menuItems.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
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
                    <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                  )}
                  {item.category && (
                    <p className="text-xs text-primary mb-3">{item.category}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold">₹{item.price}</span>
                    <Button size="sm" disabled={!item.available}>
                      {item.available ? "Add to Cart" : "Out of Stock"}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}