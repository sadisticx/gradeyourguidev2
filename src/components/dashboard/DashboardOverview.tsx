import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatisticsCard from "./StatisticsCard";
import QuickAccessCard from "./QuickAccessCard";
import { FileText, BarChart3, Users, Send, PlusCircle } from "lucide-react";
import StudentEvaluationLink from "../student/StudentEvaluationLink";

interface DashboardOverviewProps {
  statistics?: {
    activeEvaluations?: number;
    responseRate?: number;
    pendingReviews?: number;
    facultyEvaluated?: number;
  };
}

const DashboardOverview = ({
  statistics = {
    activeEvaluations: 24,
    responseRate: 78,
    pendingReviews: 9,
    facultyEvaluated: 42,
  },
}: DashboardOverviewProps) => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full p-6 bg-gray-50">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome to the Faculty Evaluation System dashboard.
        </p>
      </div>

      {/* Statistics Overview */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatisticsCard
            title="Active Evaluations"
            value={statistics.activeEvaluations}
            icon={<FileText className="h-8 w-8 text-primary" />}
            trend={{ value: 12, isPositive: true }}
            description="from last month"
          />
          <StatisticsCard
            title="Response Rate"
            value={`${statistics.responseRate}%`}
            icon={<BarChart3 className="h-8 w-8 text-indigo-500" />}
            trend={{ value: 5, isPositive: true }}
            description="higher than previous cycle"
          />
          <StatisticsCard
            title="Pending Reviews"
            value={statistics.pendingReviews}
            icon={<FileText className="h-8 w-8 text-amber-500" />}
            trend={{ value: 2, isPositive: false }}
            description="need attention"
          />
          <StatisticsCard
            title="Faculty Evaluated"
            value={statistics.facultyEvaluated}
            icon={<Users className="h-8 w-8 text-emerald-500" />}
            trend={{ value: 8, isPositive: true }}
            description="this semester"
          />
        </div>
      </div>

      {/* Quick Access Cards */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <QuickAccessCard
            variant="questionnaires"
            title="Questionnaire Management"
            actionText="Manage Questionnaires"
            onClick={() => navigate("/questionnaires")}
          />
          <QuickAccessCard
            variant="forms"
            title="Form Distribution"
            actionText="Distribute Forms"
            onClick={() => navigate("/forms")}
          />
          <QuickAccessCard
            variant="analytics"
            title="Analytics Dashboard"
            actionText="View Analytics"
            onClick={() => navigate("/analytics")}
          />
          <QuickAccessCard
            variant="admins"
            title="Administrator Management"
            actionText="Manage Admins"
            onClick={() => navigate("/admins")}
          />
          <QuickAccessCard
            variant="create"
            title="Create New Evaluation"
            description="Start the process of creating a new evaluation form"
            actionText="Create Now"
            onClick={() => navigate("/questionnaires/new")}
          />
          <Card className="w-full max-w-[380px] h-[240px] bg-white border border-dashed border-gray-300 flex flex-col items-center justify-center">
            <CardHeader>
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2 bg-gray-100">
                <PlusCircle size={24} className="text-gray-400" />
              </div>
              <CardTitle className="text-xl text-center">
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-gray-500">
                View your recent activities and notifications
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Activity items */}
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">New evaluation form created</p>
                    <p className="text-sm text-muted-foreground">
                      Computer Science Department - Fall 2023
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      2 hours ago
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Demo Link for Student Evaluation */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-lg font-medium mb-2">Demo Access</h3>
        <p className="text-sm text-gray-600 mb-4">
          Quick access to student evaluation demo for showcase purposes.
        </p>
        <StudentEvaluationLink />
      </div>
    </div>
  );
};

export default DashboardOverview;
