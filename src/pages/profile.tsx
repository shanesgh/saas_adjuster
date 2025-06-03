import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Building,
  Calendar,
  Shield,
  Edit,
  TrendingUp,
  FileCheck,
  Clock,
  Settings,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/stores/auth-store";

export function ProfilePage() {
  const MotionCard = motion.create(Card);
  const { user } = useAuthStore();

  const getInitials = (email: string) => {
    return email
      .split("@")[0]
      .split(".")
      .map((name) => name[0].toUpperCase())
      .join("");
  };

  const userInitials = user?.email ? getInitials(user.email) : "U";

  return (
    <div className="min-h-screen bg-muted/40 dark:bg-background">
      <div className="p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <User className="h-8 w-8" />
            Profile
          </h1>
          <p className="text-muted-foreground">
            Manage your account information and preferences.
          </p>
        </div>

        <div className="grid gap-4 md:gap-6 max-w-4xl">
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-primary/10 text-primary text-xl">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-2xl">{userInitials}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Mail className="h-4 w-4" />
                      {user?.email}
                    </CardDescription>
                  </div>
                </div>
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Role
                  </p>
                  <Badge
                    variant={user?.role === "ceo" ? "default" : "secondary"}
                    className="w-fit"
                  >
                    <Shield className="h-3 w-3 mr-1" />
                    {user?.role.toUpperCase()}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Department
                  </p>
                  <p className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Executive Management
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Phone
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    +1 (555) 123-4567
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Last Login
                  </p>
                  <p className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </MotionCard>

          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <CardHeader>
              <CardTitle>Account Activity</CardTitle>
              <CardDescription>
                Recent account activity and login history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">Successful Login</p>
                    <p className="text-sm text-muted-foreground">
                      Chrome on Windows • IP: 192.168.1.100
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Today, 9:30 AM
                  </p>
                </div>
                <Separator />
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">Signed 15 Cheques</p>
                    <p className="text-sm text-muted-foreground">
                      Batch #203 - Vendor Payments
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Yesterday, 4:15 PM
                  </p>
                </div>
                <Separator />
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">Profile Updated</p>
                    <p className="text-sm text-muted-foreground">
                      Phone number changed
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">2 days ago</p>
                </div>
              </div>
            </CardContent>
          </MotionCard>

          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <CardHeader>
              <CardTitle>Signing Statistics</CardTitle>
              <CardDescription>
                Your cheque signing performance and metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <FileCheck className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <p className="text-2xl font-bold">247</p>
                  <p className="text-sm text-muted-foreground">Total Signed</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <p className="text-2xl font-bold">15</p>
                  <p className="text-sm text-muted-foreground">This Week</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                  <p className="text-2xl font-bold">2.5</p>
                  <p className="text-sm text-muted-foreground">
                    Avg. Time (min)
                  </p>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    Monthly Target Progress
                  </span>
                  <span className="text-sm text-muted-foreground">
                    60/80 cheques
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: "75%" }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground">
                  75% complete • 20 remaining
                </p>
              </div>
            </CardContent>
          </MotionCard>

          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <CardHeader>
              <CardTitle>Security & Preferences</CardTitle>
              <CardDescription>
                Manage your security settings and application preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">
                      Enhanced account security
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-green-600 border-green-600"
                  >
                    Enabled
                  </Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Receive updates about cheque signing
                    </p>
                  </div>
                  <Badge variant="outline">Enabled</Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">Theme Preference</p>
                    <p className="text-sm text-muted-foreground">
                      Light/Dark mode setting
                    </p>
                  </div>
                  <Badge variant="secondary">System</Badge>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t">
                <Button variant="outline" className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Advanced Settings
                </Button>
              </div>
            </CardContent>
          </MotionCard>
        </div>
      </div>
    </div>
  );
}
