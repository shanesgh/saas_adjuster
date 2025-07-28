import { useState } from "react";
import { Search, Download, Eye, Plus, FileText } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export const Reports = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  // Sample data for reports
  const reports = [
    {
      id: "1",
      name: "Toyota Camry Assessment",
      reference: "REF-2025-001",
      status: "completed",
      date: "2025-07-15",
      client: "Maritime Insurance",
      size: "2.4 MB",
    },
    {
      id: "2",
      name: "Honda Civic Valuation",
      reference: "REF-2025-002",
      status: "pending",
      date: "2025-07-14",
      client: "Guardian General",
      size: "1.8 MB",
    },
    {
      id: "3",
      name: "Nissan X-Trail Assessment",
      reference: "REF-2025-003",
      status: "review",
      date: "2025-07-12",
      client: "TATIL",
      size: "3.1 MB",
    },
    {
      id: "4",
      name: "Kia Sportage Valuation",
      reference: "REF-2025-004",
      status: "cancelled",
      date: "2025-07-10",
      client: "Sagicor",
      size: "1.5 MB",
    },
    {
      id: "5",
      name: "Hyundai Tucson Assessment",
      reference: "REF-2025-005",
      status: "completed",
      date: "2025-07-08",
      client: "Maritime Insurance",
      size: "2.7 MB",
    },
  ];

  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "completed", label: "Completed" },
    { value: "pending", label: "Pending" },
    { value: "review", label: "Under Review" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const dateOptions = [
    { value: "all", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "year", label: "This Year" },
  ];

  // Filter reports based on search and filters
  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.client.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || report.status === statusFilter;

    // Simple date filtering for demo
    let matchesDate = true;
    if (dateFilter !== "all") {
      const today = new Date();
      const reportDate = new Date(report.date);

      if (dateFilter === "today") {
        matchesDate = reportDate.toDateString() === today.toDateString();
      } else if (dateFilter === "week") {
        const weekAgo = new Date(today);
        weekAgo.setDate(today.getDate() - 7);
        matchesDate = reportDate >= weekAgo;
      } else if (dateFilter === "month") {
        matchesDate =
          reportDate.getMonth() === today.getMonth() &&
          reportDate.getFullYear() === today.getFullYear();
      } else if (dateFilter === "year") {
        matchesDate = reportDate.getFullYear() === today.getFullYear();
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "review":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleView = (reportId: string) => {
    console.log("View report:", reportId);
    // TODO: Implement view functionality
  };

  const handleDownload = (reportId: string) => {
    console.log("Download report:", reportId);
    // TODO: Implement download functionality
  };
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <Button className="bg-primary-500 hover:bg-primary-600">
          <Plus className="w-4 h-4 mr-2" />
          New Report
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-4">
              <div className="w-40">
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  options={statusOptions}
                />
              </div>

              <div className="w-40">
                <Select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  options={dateOptions}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">All Reports</h2>
            <span className="text-sm text-gray-500">
              {filteredReports.length} reports
            </span>
          </div>
        </CardHeader>
        <CardContent>
          {filteredReports.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Reference
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Client
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Size
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FileText className="w-5 h-5 text-gray-400 mr-3" />
                          <div className="text-sm font-medium text-gray-900">
                            {report.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {report.reference}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(report.status)}`}
                        >
                          {report.status.charAt(0).toUpperCase() +
                            report.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(report.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {report.client}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {report.size}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No reports found
              </h3>
              <p className="text-gray-500 mb-4">
                No reports match your current filters.
              </p>
              {searchTerm || statusFilter !== "all" || dateFilter !== "all" ? (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setDateFilter("all");
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Clear filters
                </button>
              ) : (
                <button className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600">
                  Create your first report
                </button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
