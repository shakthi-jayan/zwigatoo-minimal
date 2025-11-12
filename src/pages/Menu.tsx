// ==========================================
// Menu.tsx - FIXED VERSION
// ==========================================
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom"; // Changed from "react-router" to "react-router-dom"
import { ArrowLeft, ShoppingCart, Plus, Minus } from "lucide-react";
import { useEffect, useState } from "react";
import { getMenuItems, StoredMenuItem, createOrder } from "@/lib/storage";
import { toast } from "sonner";

interface CartItem extends StoredMenuItem {
  quantity: number;
}

export default function Menu() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState<StoredMenuItem[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    // Wait for auth to load first
    if (isLoading) return;

    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }

    const fetchMenuItems = async () => {
      try {
        setIsLoadingItems(true);
        const items = await getMenuItems();
        // Filter only available items for customers
        const availableItems = items.filter(item => item.available);
        setMenuItems(availableItems);
      } catch (error) {
        console.error("Error fetching menu items:", error);
        toast.error("Failed to load menu items");
      } finally {
        setIsLoadingItems(false);
      }
    };

    fetchMenuItems();
  }, [isAuthenticated, navigate, isLoading]);

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
    toast.info("Item removed from cart");
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

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    try {
      setIsCheckingOut(true);
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
        // Navigate to orders page after successful checkout
        setTimeout(() => navigate("/orders"), 1000);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order");
    } finally {
      setIsCheckingOut(false);
    }
  };

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <ShoppingCart className="h-12 w-12 text-primary" />
        </motion.div>
      </div>
    );
  }

  // Return null if not authenticated
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
          <img src="/logo.svg" alt="Zwigatoo" width={40} height={40} className="rounded-lg" />
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
            Cart
            {getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {getTotalItems()}
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

          {isLoadingItems ? (
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
              className="text-center py-20 p-6 rounded-lg border bg-card"
            >
              <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
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
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
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
                    <span className="text-lg font-bold">₹{item.price.toFixed(2)}</span>
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
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCart(false)}
            className="fixed inset-0 bg-black/50 z-40"
          />
          
          {/* Cart Panel */}
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
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
                <div className="text-center py-8">
                  <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Cart is empty</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item._id} className="p-4 border rounded-lg bg-card">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{item.name}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item._id)}
                        className="h-8 w-8 p-0"
                      >
                        ✕
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">₹{item.price.toFixed(2)} each</p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="flex-1 text-center font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm font-semibold mt-2 text-right">
                      Subtotal: ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Items:</span>
                    <span>{getTotalItems()}</span>
                  </div>
                  <div className="flex items-center justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>₹{getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>
                <Button 
                  onClick={handleCheckout} 
                  className="w-full"
                  disabled={isCheckingOut}
                >
                  {isCheckingOut ? "Processing..." : "Checkout"}
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </motion.div>
  );
}