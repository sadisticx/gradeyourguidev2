import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, PieChart } from "lucide-react";
import { cn } from "@/lib/utils";

interface DataVisualizationsProps {
  data?: {
    ratingDistribution?: { rating: number; count: number }[];
    facultyComparison?: { name: string; averageRating: number }[];
    trendData?: { month: string; averageRating: number }[];
    feedbackCategories?: { category: string; percentage: number }[];
  };
}

const DataVisualizations = ({
  data = {
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
  },
}: DataVisualizationsProps) => {
  const [activeTab, setActiveTab] = useState("ratings");

  // Calculate max values for scaling visualizations
  const maxRatingCount = Math.max(
    ...(data.ratingDistribution?.map((item) => item.count) || [0]),
  );
  const maxFacultyRating = Math.max(
    ...(data.facultyComparison?.map((item) => item.averageRating) || [0]),
  );

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-6">
        Evaluation Data Visualizations
      </h2>

      <Tabs
        defaultValue="ratings"
        className="w-full"
        onValueChange={setActiveTab}
      >
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="ratings" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              <span>Rating Distribution</span>
            </TabsTrigger>
            <TabsTrigger value="faculty" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              <span>Faculty Comparison</span>
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center gap-2">
              <LineChart className="h-4 w-4" />
              <span>Rating Trends</span>
            </TabsTrigger>
            <TabsTrigger value="feedback" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              <span>Feedback Categories</span>
            </TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <button className="px-3 py-1 text-sm border rounded-md hover:bg-gray-50">
              Export CSV
            </button>
            <button className="px-3 py-1 text-sm border rounded-md hover:bg-gray-50">
              Print
            </button>
          </div>
        </div>

        <TabsContent value="ratings" className="mt-2">
          <Card>
            <CardHeader>
              <CardTitle>Rating Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-end justify-around gap-4 pt-10">
                {data.ratingDistribution?.map((item) => (
                  <div key={item.rating} className="flex flex-col items-center">
                    <div className="text-sm font-medium mb-2">{item.count}</div>
                    <div
                      className="bg-blue-500 w-16 rounded-t-md"
                      style={{
                        height: `${(item.count / maxRatingCount) * 300}px`,
                      }}
                    />
                    <div className="mt-2 font-medium">{item.rating} Stars</div>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center text-sm text-gray-500">
                Based on{" "}
                {data.ratingDistribution?.reduce(
                  (sum, item) => sum + item.count,
                  0,
                ) || 0}{" "}
                total responses
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faculty" className="mt-2">
          <Card>
            <CardHeader>
              <CardTitle>Faculty Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex flex-col justify-between gap-4">
                {data.facultyComparison?.map((item) => (
                  <div key={item.name} className="flex items-center gap-4">
                    <div
                      className="w-32 font-medium truncate"
                      title={item.name}
                    >
                      {item.name}
                    </div>
                    <div className="flex-1 h-8 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full flex items-center justify-end pr-2"
                        style={{ width: `${(item.averageRating / 5) * 100}%` }}
                      >
                        <span className="text-xs font-bold text-white">
                          {item.averageRating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center text-sm text-gray-500">
                Average ratings across all evaluation criteria
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="mt-2">
          <Card>
            <CardHeader>
              <CardTitle>Rating Trends Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex flex-col">
                <div className="flex-1 relative">
                  {/* Y-axis labels */}
                  <div className="absolute left-0 top-0 bottom-0 w-10 flex flex-col justify-between">
                    <span className="text-xs text-gray-500">5.0</span>
                    <span className="text-xs text-gray-500">4.0</span>
                    <span className="text-xs text-gray-500">3.0</span>
                    <span className="text-xs text-gray-500">2.0</span>
                    <span className="text-xs text-gray-500">1.0</span>
                  </div>

                  {/* Grid lines */}
                  <div className="absolute left-10 right-0 top-0 bottom-0">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="absolute w-full border-t border-gray-200"
                        style={{ top: `${i * 25}%` }}
                      />
                    ))}
                  </div>

                  {/* Line chart */}
                  <div className="absolute left-12 right-0 top-0 bottom-0 flex items-end">
                    <svg
                      className="w-full h-full"
                      viewBox={`0 0 ${(data.trendData?.length || 1) * 100} 400`}
                      preserveAspectRatio="none"
                    >
                      <polyline
                        points={data.trendData
                          ?.map(
                            (point, index) =>
                              `${index * 100 + 50},${400 - (point.averageRating / 5) * 400}`,
                          )
                          .join(" ")}
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="3"
                      />
                      {data.trendData?.map((point, index) => (
                        <circle
                          key={index}
                          cx={index * 100 + 50}
                          cy={400 - (point.averageRating / 5) * 400}
                          r="6"
                          fill="#3b82f6"
                        />
                      ))}
                    </svg>
                  </div>
                </div>

                {/* X-axis labels */}
                <div className="h-8 ml-12 flex justify-between">
                  {data.trendData?.map((point, index) => (
                    <div key={index} className="text-xs text-gray-500">
                      {point.month}
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6 text-center text-sm text-gray-500">
                Average rating trend over the past 6 months
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback" className="mt-2">
          <Card>
            <CardHeader>
              <CardTitle>Feedback Category Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex justify-center items-center">
                <div className="relative w-64 h-64">
                  {/* Simple pie chart visualization */}
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    {
                      data.feedbackCategories?.reduce(
                        (acc, item, index, array) => {
                          const startAngle = acc.total;
                          const endAngle = startAngle + item.percentage * 3.6; // 3.6 = 360/100

                          // Calculate the SVG arc path
                          const x1 =
                            50 + 50 * Math.cos((startAngle * Math.PI) / 180);
                          const y1 =
                            50 + 50 * Math.sin((startAngle * Math.PI) / 180);
                          const x2 =
                            50 + 50 * Math.cos((endAngle * Math.PI) / 180);
                          const y2 =
                            50 + 50 * Math.sin((endAngle * Math.PI) / 180);

                          const largeArcFlag = item.percentage > 50 ? 1 : 0;

                          const colors = ["#22c55e", "#3b82f6", "#ef4444"];

                          acc.paths.push(
                            <path
                              key={index}
                              d={`M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                              fill={colors[index % colors.length]}
                            />,
                          );

                          acc.total = endAngle;
                          return acc;
                        },
                        { paths: [] as React.ReactNode[], total: 0 },
                      ).paths
                    }
                  </svg>
                </div>

                <div className="ml-8">
                  {data.feedbackCategories?.map((item, index) => {
                    const colors = ["#22c55e", "#3b82f6", "#ef4444"];
                    return (
                      <div key={index} className="flex items-center mb-4">
                        <div
                          className="w-4 h-4 rounded-full mr-2"
                          style={{
                            backgroundColor: colors[index % colors.length],
                          }}
                        />
                        <div className="mr-2">{item.category}:</div>
                        <div className="font-bold">{item.percentage}%</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="mt-6 text-center text-sm text-gray-500">
                Distribution of feedback sentiment categories
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataVisualizations;
