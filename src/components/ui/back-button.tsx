import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./button";
import { ChevronLeft } from "lucide-react";

interface BackButtonProps {
  label?: string;
  className?: string;
  toDashboard?: boolean;
}

const BackButton = ({
  label = "Back",
  className = "",
  toDashboard = false,
}: BackButtonProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (toDashboard) {
      navigate("/");
    } else {
      navigate(-1);
    }
  };

  return (
    <Button
      variant="outline"
      className={`flex items-center justify-center gap-2 ${className}`}
      onClick={handleBack}
    >
      <ChevronLeft className="h-4 w-4" />
      {label}
    </Button>
  );
};

export default BackButton;
