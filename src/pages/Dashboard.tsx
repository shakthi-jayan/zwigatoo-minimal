import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { LogOut, Coffee, Users, Settings } from "lucide-react";
import { useEffect } from "react";

export default function Dashboard() {
  const { isAuthenticated, isLoading, user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Coffee className="h-12 w-12 text-primary" />
        </motion.div>
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

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
          <span className="text-sm text-muted-foreground">
            {user?.email || 'Guest User'} • {user?.role}
          </span>
          <Button onClick={handleSignOut} variant="outline" size="sm">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </motion.div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-20">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center max-w-2xl"
        >
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Welcome to Zwigatoo
            <span className="block text-primary">{user?.role === 'staff' ? 'Staff' : 'Customer'} Dashboard</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            {user?.role === 'staff'
              ? 'Manage orders and cafeteria operations'
              : 'Browse menu and place orders'}
          </p>
        </motion.div>

        {/* Dashboard Cards */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 max-w-4xl w-full"
        >
          {user?.role === 'staff' ? (
            <>
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                onClick={() => navigate("/orders")}
                className="p-6 rounded-lg border bg-card hover:shadow-md transition-shadow cursor-pointer text-left w-full"
              >
                <Coffee className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold mb-2">Manage Orders</h3>
                <p className="text-sm text-muted-foreground">View and manage customer orders</p>
              </motion.button>
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                onClick={() => navigate("/menu-management")}
                className="p-6 rounded-lg border bg-card hover:shadow-md transition-shadow cursor-pointer text-left w-full"
              >
                <Settings className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold mb-2">Menu Management</h3>
                <p className="text-sm text-muted-foreground">Update menu items and availability</p>
              </motion.button>
            </>
          ) : (
            <>
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                onClick={() => navigate("/menu")}
                className="p-6 rounded-lg border bg-card hover:shadow-md transition-shadow cursor-pointer text-left w-full"
              >
                <Coffee className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold mb-2">Browse Menu</h3>
                <p className="text-sm text-muted-foreground">View available items and place orders</p>
              </motion.button>
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                onClick={() => navigate("/orders")}
                className="p-6 rounded-lg border bg-card hover:shadow-md transition-shadow cursor-pointer text-left w-full"
              >
                <Users className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold mb-2">My Orders</h3>
                <p className="text-sm text-muted-foreground">Track your order history</p>
              </motion.button>
            </>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}