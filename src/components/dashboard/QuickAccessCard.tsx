import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, BarChart3, Users, Send, PlusCircle } from "lucide-react";

interface QuickAccessCardProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionText?: string;
  onClick?: () => void;
  variant?: "questionnaires" | "forms" | "analytics" | "admins" | "create";
}

const QuickAccessCard = ({
  title = "Quick Access",
  description = "Access frequently used features",
  icon,
  actionText = "Go to feature",
  onClick = () => {},
  variant = "questionnaires",
}: QuickAccessCardProps) => {
  // Define icon and colors based on variant
  const getCardDetails = () => {
    switch (variant) {
      case "questionnaires":
        return {
          icon: icon || <FileText size={24} />,
          color: "bg-blue-50 text-blue-600",
          hoverColor: "hover:bg-blue-100",
          title: title || "Questionnaire Management",
          description: description || "Create and manage evaluation forms",
        };
      case "forms":
        return {
          icon: icon || <Send size={24} />,
          color: "bg-green-50 text-green-600",
          hoverColor: "hover:bg-green-100",
          title: title || "Form Distribution",
          description: description || "Distribute and track evaluation forms",
        };
      case "analytics":
        return {
          icon: icon || <BarChart3 size={24} />,
          color: "bg-purple-50 text-purple-600",
          hoverColor: "hover:bg-purple-100",
          title: title || "Analytics Dashboard",
          description: description || "View and analyze evaluation results",
        };
      case "admins":
        return {
          icon: icon || <Users size={24} />,
          color: "bg-amber-50 text-amber-600",
          hoverColor: "hover:bg-amber-100",
          title: title || "Administrator Management",
          description: description || "Manage administrator accounts",
        };
      case "create":
        return {
          icon: icon || <PlusCircle size={24} />,
          color: "bg-rose-50 text-rose-600",
          hoverColor: "hover:bg-rose-100",
          title: title || "Create New Evaluation",
          description: description || "Start creating a new evaluation",
        };
      default:
        return {
          icon: icon || <FileText size={24} />,
          color: "bg-gray-50 text-gray-600",
          hoverColor: "hover:bg-gray-100",
          title,
          description,
        };
    }
  };

  const {
    icon: variantIcon,
    color,
    hoverColor,
    title: variantTitle,
    description: variantDescription,
  } = getCardDetails();

  return (
    <Card className="w-full max-w-[380px] h-[240px] bg-white transition-all duration-200 hover:shadow-md">
      <CardHeader>
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${color}`}
        >
          {variantIcon}
        </div>
        <CardTitle className="text-xl">{variantTitle}</CardTitle>
        <CardDescription>{variantDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500">
          Quick access to manage and view all related features and settings.
        </p>
      </CardContent>
      <CardFooter>
        <Button
          onClick={onClick}
          className={`w-full ${color} ${hoverColor} border-0`}
          variant="outline"
        >
          {actionText}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuickAccessCard;
