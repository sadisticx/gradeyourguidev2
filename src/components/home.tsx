import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "./layout/DashboardLayout";
import DashboardOverview from "./dashboard/DashboardOverview";

const Home = () => {
  // Set page title
  document.title = "Dashboard - Faculty Evaluation System";
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Mock statistics data
  const statistics = {
    activeEvaluations: 24,
    responseRate: 78,
    pendingReviews: 9,
    facultyEvaluated: 42,
  };

  return (
    <div className="bg-background min-h-screen">
      <DashboardLayout
        sidebarOpen={sidebarOpen}
        onToggleSidebar={toggleSidebar}
      >
        <DashboardOverview statistics={statistics} />
      </DashboardLayout>
    </div>
  );
};

export default Home;
