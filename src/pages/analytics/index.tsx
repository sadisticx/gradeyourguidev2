import React, { useState, useEffect } from "react";
import { fetchData } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Download, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import FilterPanel from "@/components/analytics/FilterPanel";
import ResultsOverview from "@/components/analytics/ResultsOverview";
import DataVisualizations from "@/components/analytics/DataVisualizations";
import BackButton from "@/components/ui/back-button";

interface FilterState {
  section: string;
  course: string;
  faculty: string;
  searchTerm: string;
  dateRange:
    | {
        from?: Date;
        to?: Date;
      }
    | undefined;
}

const AnalyticsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [responseData, setResponseData] = useState<any[]>([]);

  // Fetch analytics data from Supabase
  useEffect(() => {
    const loadAnalyticsData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchData("responses");
        setResponseData(data);

        // If we have data, update the filtered data based on it
        if (data.length > 0) {
          // Process the data to get statistics
          const totalResponses = data.length;

          // Calculate average rating (assuming answers contains rating data)
          let totalRating = 0;
          let ratingCount = 0;
          data.forEach((response: any) => {
            const answers =
              typeof response.answers === "string"
                ? JSON.parse(response.answers)
                : response.answers;

            if (answers) {
              Object.entries(answers).forEach(([key, value]) => {
                if (typeof value === "string" && !isNaN(Number(value))) {
                  totalRating += Number(value);
                  ratingCount++;
                }
              });
            }
          });

          const averageRating = ratingCount > 0 ? totalRating / ratingCount : 0;

          // Update filtered data with real statistics
          setFilteredData({
            totalResponses,
            averageRating: parseFloat(averageRating.toFixed(1)),
            responseRate: 78, // This would need to be calculated based on total possible responses
            positiveComments: Math.round(totalResponses * 0.6), // Example calculation
            negativeComments: Math.round(totalResponses * 0.15), // Example calculation
            neutralComments: Math.round(totalResponses * 0.25), // Example calculation
          });
        }

        toast({
          title: "Success",
          description: "Analytics data loaded successfully",
        });
      } catch (error) {
        console.error("Error loading analytics data:", error);
        toast({
          title: "Error",
          description:
            "Failed to load analytics data. Using sample data instead.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalyticsData();
  }, [toast]);

  const [filters, setFilters] = useState<FilterState>({
    section: "all-sections",
    course: "all-courses",
    faculty: "all-faculty",
    searchTerm: "",
    dateRange: undefined,
  });

  // State for filtered data
  const [filteredData, setFilteredData] = useState({
    totalResponses: 245,
    averageRating: 4.2,
    responseRate: 78,
    positiveComments: 156,
    negativeComments: 32,
    neutralComments: 57,
  });

  // Mock data for the overview section
  const overviewData = {
    totalResponses: 245,
    averageRating: 4.2,
    responseRate: 78,
    positiveComments: 156,
    negativeComments: 32,
    neutralComments: 57,
  };

  // Mock data for visualizations
  const visualizationData = {
    ratingDistribution: [
      { rating: 1, count: 5 },
      { rating: 2, count: 12 },
      { rating: 3, count: 25 },
      { rating: 4, count: 38 },
      { rating: 5, count: 20 },
    ],
    facultyComparison: [
      { name: "Dr. Smith", averageRating: 4.2 },
      { name: "Prof. Johnson", averageRating: 3.8 },
      { name: "Dr. Williams", averageRating: 4.5 },
      { name: "Prof. Brown", averageRating: 3.9 },
      { name: "Dr. Davis", averageRating: 4.1 },
    ],
    trendData: [
      { month: "Jan", averageRating: 3.8 },
      { month: "Feb", averageRating: 3.9 },
      { month: "Mar", averageRating: 4.0 },
      { month: "Apr", averageRating: 4.2 },
      { month: "May", averageRating: 4.3 },
      { month: "Jun", averageRating: 4.1 },
    ],
    feedbackCategories: [
      { category: "Positive", percentage: 65 },
      { category: "Balanced", percentage: 25 },
      { category: "Critical", percentage: 10 },
    ],
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);

    // Simulate filtering data based on filters
    let multiplier = 1.0;

    // Apply section filter
    if (newFilters.section === "section-a") multiplier = 0.9;
    else if (newFilters.section === "section-b") multiplier = 1.1;
    else if (newFilters.section === "section-c") multiplier = 1.2;

    // Apply course filter
    if (newFilters.course === "cs101") multiplier *= 0.95;
    else if (newFilters.course === "cs201") multiplier *= 1.05;
    else if (newFilters.course === "math101") multiplier *= 1.1;

    // Apply faculty filter
    if (newFilters.faculty === "prof-smith") multiplier *= 1.15;
    else if (newFilters.faculty === "prof-johnson") multiplier *= 0.9;
    else if (newFilters.faculty === "prof-williams") multiplier *= 1.0;

    // Update filtered data
    setFilteredData({
      totalResponses: Math.round(245 * multiplier),
      averageRating: Math.min(5, Math.round(4.2 * multiplier * 10) / 10),
      responseRate: Math.min(100, Math.round(78 * multiplier)),
      positiveComments: Math.round(156 * multiplier),
      negativeComments: Math.round(32 * multiplier),
      neutralComments: Math.round(57 * multiplier),
    });
  };

  const handleExportData = () => {
    // Simulate exporting data to Excel
    const csvContent = `"Total Responses","Average Rating","Response Rate","Positive Comments","Negative Comments","Neutral Comments"
${filteredData.totalResponses},${filteredData.averageRating},${filteredData.responseRate}%,${filteredData.positiveComments},${filteredData.negativeComments},${filteredData.neutralComments}`;

    // Create a blob and download it
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "evaluation_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <BackButton toDashboard className="mb-4" />
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <Button
            onClick={handleExportData}
            className="flex items-center gap-2"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Export to Excel
          </Button>
        </div>

        {/* Filters Section */}
        <div className="mb-6">
          <FilterPanel
            onFilterChange={handleFilterChange}
            isLoading={isLoading}
          />
        </div>

        {/* Results Overview Section */}
        <div className="mb-6">
          <ResultsOverview
            totalResponses={filteredData.totalResponses}
            averageRating={filteredData.averageRating}
            responseRate={filteredData.responseRate}
            positiveComments={filteredData.positiveComments}
            negativeComments={filteredData.negativeComments}
            neutralComments={filteredData.neutralComments}
          />
        </div>

        {/* Data Visualizations Section */}
        <div className="mb-6">
          <DataVisualizations data={visualizationData} />
        </div>

        {/* Download Reports Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-2xl font-bold mb-4">Download Reports</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={handleExportData}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Faculty Performance Report</h3>
                  <p className="text-sm text-gray-500">
                    Comprehensive evaluation results by faculty
                  </p>
                </div>
                <Download className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div
              className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={handleExportData}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Course Comparison Report</h3>
                  <p className="text-sm text-gray-500">
                    Compare evaluation results across courses
                  </p>
                </div>
                <Download className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div
              className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={handleExportData}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Trend Analysis Report</h3>
                  <p className="text-sm text-gray-500">
                    Evaluation trends over multiple periods
                  </p>
                </div>
                <Download className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
