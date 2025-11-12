import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { ArrowLeft, ShoppingCart, Plus, Minus } from "lucide-react";
import { useEffect, useState } from "react";
import { getMenuItems, StoredMenuItem, createOrder } from "@/lib/storage";
import { toast } from "sonner";

interface CartItem extends StoredMenuItem {
  quantity: number;
}

export default function Menu() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState<StoredMenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);

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

  const addToCart = (item: StoredMenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i._id === item._id);
      if (existing) {
        return prev.map((i) =>
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    toast.success(`${item.name} added to cart`);
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((i) => i._id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCart((prev) =>
        prev.map((i) => (i._id === itemId ? { ...i, quantity } : i))
      );
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    try {
      if (user?.uid) {
        await createOrder({
          userId: user.uid,
          items: cart.map((item) => ({
            itemId: item._id,
            itemName: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          totalPrice: getTotalPrice(),
          status: 'pending',
        });
        toast.success("Order placed successfully!");
        setCart([]);
        setShowCart(false);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order");
    }
  };

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
          className="flex items-center gap-4"
        >
          <Button
            onClick={() => setShowCart(!showCart)}
            variant="outline"
            size="sm"
            className="relative"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Cart ({cart.length})
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </Button>
          <Button onClick={() => navigate("/dashboard")} variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
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
                    <Button
                      size="sm"
                      onClick={() => addToCart(item)}
                      disabled={!item.available}
                    >
                      {item.available ? "Add to Cart" : "Out of Stock"}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Cart Sidebar */}
      {showCart && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="fixed right-0 top-0 h-full w-full md:w-96 bg-background border-l shadow-lg z-50 flex flex-col"
        >
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="text-2xl font-bold">Your Cart</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCart(false)}
            >
              ✕
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Cart is empty</p>
            ) : (
              cart.map((item) => (
                <div key={item._id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{item.name}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item._id)}
                    >
                      ✕
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">₹{item.price}</p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="flex-1 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm font-semibold mt-2">
                    Subtotal: ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="border-t p-6 space-y-4">
              <div className="flex items-center justify-between text-lg font-bold">
                <span>Total:</span>
                <span>₹{getTotalPrice().toFixed(2)}</span>
              </div>
              <Button onClick={handleCheckout} className="w-full">
                Checkout
              </Button>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}