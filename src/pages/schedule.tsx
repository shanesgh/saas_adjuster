import { motion } from "framer-motion";
import { Calendar, Clock, CheckCircle, AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function SchedulePage() {
  const MotionCard = motion.create(Card);

  return (
    <div className="min-h-screen bg-muted/40 dark:bg-background">
      <div className="p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Calendar className="h-8 w-8" />
            Schedule
          </h1>
          <p className="text-muted-foreground">
            Manage approval workflows and signing schedules.
          </p>
        </div>

        <div className="grid gap-4 md:gap-6 md:grid-cols-2 mb-6">
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground mt-1">
                Cheques awaiting signature
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
                Due This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-muted-foreground mt-1">
                Upcoming deadlines
              </p>
            </CardContent>
          </MotionCard>
        </div>

        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <CardHeader>
            <CardTitle>Approval Queue</CardTitle>
            <CardDescription>
              Cheques scheduled for approval and signing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="font-medium">Vendor Payment Batch #203</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      Due: Today 5:00 PM • 8 cheques • $45,230.00
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">Urgent</Badge>
                  <Button size="sm">Review</Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium">Payroll Batch #156</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      Due: Tomorrow 2:00 PM • 23 cheques • $125,800.00
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Scheduled</Badge>
                  <Button size="sm" variant="outline">
                    View
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg opacity-60">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium">Expense Reimbursements</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      Completed: Yesterday • 15 cheques • $8,450.00
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Completed</Badge>
                  <Button size="sm" variant="ghost" disabled>
                    View
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </MotionCard>
      </div>
    </div>
  );
}
