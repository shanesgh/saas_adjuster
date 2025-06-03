import { motion } from "framer-motion";
import { FileText, Upload, Download, Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function DocumentsPage() {
  const MotionCard = motion.create(Card);

  return (
    <div className="min-h-screen bg-muted/40 dark:bg-background">
      <div className="p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="h-8 w-8" />
            Documents
          </h1>
          <p className="text-muted-foreground">
            Upload and manage Excel files for cheque processing.
          </p>
        </div>

        <div className="grid gap-4 md:gap-6 mb-6">
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <CardHeader>
              <CardTitle>Upload Cheque Data</CardTitle>
              <CardDescription>
                Upload Excel files containing cheque information for processing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">
                  Drop Excel files here
                </p>
                <p className="text-muted-foreground mb-4">or click to browse</p>
                <Button>Choose Files</Button>
              </div>
            </CardContent>
          </MotionCard>

          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <CardHeader>
              <CardTitle>Recent Documents</CardTitle>
              <CardDescription>
                Manage your uploaded cheque documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input placeholder="Search documents..." className="pl-10" />
                </div>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Cheques_March_2025.xlsx</p>
                    <p className="text-sm text-muted-foreground">
                      Uploaded 2 hours ago • 156 cheques
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                    <Button size="sm">Process</Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Payroll_Cheques_Feb.xlsx</p>
                    <p className="text-sm text-muted-foreground">
                      Uploaded yesterday • 89 cheques
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                    <Button size="sm" disabled>
                      Processed
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </MotionCard>
        </div>
      </div>
    </div>
  );
}
