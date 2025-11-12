import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { Coffee, Users, Zap, ArrowRight } from "lucide-react";

export default function Landing() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-accent/5"
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
          {isAuthenticated ? (
            <Button onClick={() => navigate("/dashboard")}>Dashboard</Button>
          ) : (
            <Button onClick={() => navigate("/auth")}>Get Started</Button>
          )}
        </motion.div>
      </nav>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-20">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center max-w-2xl"
        >
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Cafeteria Management
            <span className="block text-primary">Made Simple</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Order food, manage outlets, and streamline your cafeteria operations with Zwigatoo's minimalist platform.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl w-full"
        >
          {[
            { icon: Coffee, title: "Browse Menu", desc: "Explore available items" },
            { icon: Users, title: "Easy Ordering", desc: "Quick and simple checkout" },
            { icon: Zap, title: "Real-time Updates", desc: "Track your orders live" },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="p-6 rounded-lg border bg-card hover:shadow-md transition-shadow"
            >
              <feature.icon className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <Button
            size="lg"
            onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
            className="gap-2"
          >
            {isAuthenticated ? "Go to Dashboard" : "Start Ordering"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="border-t py-6 text-center text-sm text-muted-foreground"
      >
        <p>Built with Zwigatoo • Powered by Firebase</p>
      </motion.footer>
    </motion.div>
  );
}
