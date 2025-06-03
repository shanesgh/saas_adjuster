import { motion } from "framer-motion";
import { Users, UserPlus, Shield, Mail } from "lucide-react";
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

export function UsersPage() {
  const MotionCard = motion.create(Card);

  const users = [
    {
      name: "John Smith",
      email: "john.smith@company.com",
      role: "CEO",
      status: "Active",
      initials: "JS",
    },
    {
      name: "Sarah Johnson",
      email: "sarah.j@company.com",
      role: "CFO",
      status: "Active",
      initials: "SJ",
    },
    {
      name: "Mike Chen",
      email: "mike.chen@company.com",
      role: "Manager",
      status: "Active",
      initials: "MC",
    },
    {
      name: "Lisa Davis",
      email: "lisa.davis@company.com",
      role: "Manager",
      status: "Inactive",
      initials: "LD",
    },
  ];

  return (
    <div className="min-h-screen bg-muted/40 dark:bg-background">
      <div className="p-4 md:p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Users className="h-8 w-8" />
              Team Members
            </h1>
            <p className="text-muted-foreground">
              Manage user access and permissions for cheque signing.
            </p>
          </div>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>

        <div className="grid gap-4 md:gap-6 md:grid-cols-3 mb-6">
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground mt-1">
                Active team members
              </p>
            </CardContent>
          </MotionCard>

          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">CEO Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground mt-1">
                Full signing authority
              </p>
            </CardContent>
          </MotionCard>

          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Managers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">6</div>
              <p className="text-xs text-muted-foreground mt-1">
                Limited signing authority
              </p>
            </CardContent>
          </MotionCard>
        </div>

        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              View and manage team member permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {user.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <Badge
                        variant={user.role === "CEO" ? "default" : "secondary"}
                      >
                        <Shield className="h-3 w-3 mr-1" />
                        {user.role}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        Status:{" "}
                        <span
                          className={
                            user.status === "Active"
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {user.status}
                        </span>
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </MotionCard>
      </div>
    </div>
  );
}
