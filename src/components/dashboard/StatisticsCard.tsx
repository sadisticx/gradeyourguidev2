import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  Users,
  FileText,
  BarChart3,
} from "lucide-react";

interface StatisticsCardProps {
  title?: string;
  value?: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
  className?: string;
}

const StatisticsCard = ({
  title = "Active Evaluations",
  value = "24",
  icon = <FileText className="h-8 w-8 text-primary" />,
  trend = { value: 12, isPositive: true },
  description = "from last month",
  className = "",
}: StatisticsCardProps) => {
  // Predefined card variants that can be used
  const cardVariants = {
    evaluations: {
      title: "Active Evaluations",
      value: "24",
      icon: <FileText className="h-8 w-8 text-primary" />,
      trend: { value: 12, isPositive: true },
    },
    responses: {
      title: "Response Rate",
      value: "78%",
      icon: <BarChart3 className="h-8 w-8 text-indigo-500" />,
      trend: { value: 5, isPositive: true },
    },
    pending: {
      title: "Pending Reviews",
      value: "9",
      icon: <FileText className="h-8 w-8 text-amber-500" />,
      trend: { value: 2, isPositive: false },
    },
    faculty: {
      title: "Faculty Evaluated",
      value: "42",
      icon: <Users className="h-8 w-8 text-emerald-500" />,
      trend: { value: 8, isPositive: true },
    },
  };

  return (
    <Card className={`bg-white h-full w-full ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="rounded-full p-2 bg-primary/10">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center text-xs text-muted-foreground mt-1">
          <span
            className={`flex items-center ${trend.isPositive ? "text-emerald-500" : "text-rose-500"}`}
          >
            {trend.isPositive ? (
              <ArrowUpIcon className="h-3 w-3 mr-1" />
            ) : (
              <ArrowDownIcon className="h-3 w-3 mr-1" />
            )}
            {trend.value}%
          </span>
          <span className="ml-1">{description}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatisticsCard;
