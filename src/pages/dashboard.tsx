import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import {
  Shield,
  User,
  Bell,
  Settings,
  BarChart3,
  Calendar,
  FileText,
  Users,
  Home,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  const getInitials = (email: string) => {
    return email
      .split("@")[0]
      .split(".")
      .map((name) => name[0].toUpperCase())
      .join("");
  };

  const userInitials = user?.email ? getInitials(user.email) : "U";

  const handleProfileNavigation = () => {
    navigate({ to: "/profile" });
  };

  const MotionCard = motion.create(Card);

  return (
    <div className="min-h-screen bg-muted/40 dark:bg-background">
      {/* Header */}
      <header className="h-16 border-b bg-card flex items-center justify-between px-4 md:px-6">
        <div className="md:hidden">
          <Shield className="h-6 w-6 text-primary" />
        </div>

        <div className="flex-1 md:hidden" />

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full"
              >
                <Avatar>
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {user?.email}
                <p className="text-xs text-muted-foreground mt-1">
                  Role: {user?.role.toUpperCase()}
                </p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleProfileNavigation}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate({ to: "/settings" })}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={handleLogout}
              >
                <User className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Dashboard content */}
      <div className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Welcome back, {userInitials}</h1>
          <p className="text-muted-foreground">
            Here's an overview of your secure dashboard.
          </p>
        </div>

        <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Authentication Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">Secure</div>
              <p className="text-xs text-muted-foreground mt-1">
                Your session is protected
              </p>
            </CardContent>
          </MotionCard>

          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Account Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {user?.role.toUpperCase()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Full access permissions
              </p>
            </CardContent>
          </MotionCard>

          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Session Info
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Active</div>
              <p className="text-xs text-muted-foreground mt-1">
                Last login: {new Date().toLocaleString()}
              </p>
            </CardContent>
          </MotionCard>
        </div>

        <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="md:col-span-2 lg:col-span-3"
          >
            <CardHeader>
              <CardTitle>Security Overview</CardTitle>
              <CardDescription>
                Your account is protected with our advanced security features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-4 bg-green-100 dark:bg-green-900 p-2 rounded-full">
                      <Shield className="h-5 w-5 text-green-600 dark:text-green-300" />
                    </div>
                    <div>
                      <h4 className="font-medium">
                        Secure Token Authentication
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Single-use tokens with proper hashing
                      </p>
                    </div>
                  </div>
                  <div className="text-green-500 font-medium">Active</div>
                </div>
                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-4 bg-green-100 dark:bg-green-900 p-2 rounded-full">
                      <Users className="h-5 w-5 text-green-600 dark:text-green-300" />
                    </div>
                    <div>
                      <h4 className="font-medium">IP & User-Agent Binding</h4>
                      <p className="text-sm text-muted-foreground">
                        Session linked to your device
                      </p>
                    </div>
                  </div>
                  <div className="text-green-500 font-medium">Active</div>
                </div>
                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-4 bg-green-100 dark:bg-green-900 p-2 rounded-full">
                      <Bell className="h-5 w-5 text-green-600 dark:text-green-300" />
                    </div>
                    <div>
                      <h4 className="font-medium">
                        Real-time Security Monitoring
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Instant alerts for suspicious activity
                      </p>
                    </div>
                  </div>
                  <div className="text-green-500 font-medium">Active</div>
                </div>
              </div>
            </CardContent>
          </MotionCard>
        </div>
      </div>
    </div>
  );
}