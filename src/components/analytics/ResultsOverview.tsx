import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowDown, ArrowUp, BarChart3, FileText, Users } from "lucide-react";

interface ResultsOverviewProps {
  totalResponses?: number;
  averageRating?: number;
  responseRate?: number;
  positiveComments?: number;
  negativeComments?: number;
  neutralComments?: number;
}

const ResultsOverview = ({
  totalResponses = 245,
  averageRating = 4.2,
  responseRate = 78,
  positiveComments = 156,
  negativeComments = 32,
  neutralComments = 57,
}: ResultsOverviewProps) => {
  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-6">Evaluation Results Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Responses Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              Total Responses
            </CardTitle>
            <CardDescription>Completed evaluations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold">{totalResponses}</span>
              <div className="flex items-center text-green-600 text-sm">
                <ArrowUp className="h-4 w-4 mr-1" />
                <span>12% from last period</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Average Rating Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-yellow-500" />
              Average Rating
            </CardTitle>
            <CardDescription>On a 5-point scale</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold">
                {averageRating.toFixed(1)}
              </span>
              <div className="flex items-center text-green-600 text-sm">
                <ArrowUp className="h-4 w-4 mr-1" />
                <span>0.3 from last period</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Response Rate Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-500" />
              Response Rate
            </CardTitle>
            <CardDescription>
              Percentage of students who responded
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold">{responseRate}%</span>
              <div className="flex items-center text-red-600 text-sm">
                <ArrowDown className="h-4 w-4 mr-1" />
                <span>3% from last period</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feedback Distribution */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Feedback Distribution</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex flex-col space-y-4">
            {/* Positive Comments */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span>Positive Comments</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium">{positiveComments}</span>
                <span className="text-gray-500 ml-2">
                  (
                  {Math.round(
                    (positiveComments /
                      (positiveComments + negativeComments + neutralComments)) *
                      100,
                  )}
                  %)
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-green-500 h-2.5 rounded-full"
                style={{
                  width: `${Math.round((positiveComments / (positiveComments + negativeComments + neutralComments)) * 100)}%`,
                }}
              ></div>
            </div>

            {/* Neutral Comments */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                <span>Neutral Comments</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium">{neutralComments}</span>
                <span className="text-gray-500 ml-2">
                  (
                  {Math.round(
                    (neutralComments /
                      (positiveComments + negativeComments + neutralComments)) *
                      100,
                  )}
                  %)
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-500 h-2.5 rounded-full"
                style={{
                  width: `${Math.round((neutralComments / (positiveComments + negativeComments + neutralComments)) * 100)}%`,
                }}
              ></div>
            </div>

            {/* Negative Comments */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <span>Negative Comments</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium">{negativeComments}</span>
                <span className="text-gray-500 ml-2">
                  (
                  {Math.round(
                    (negativeComments /
                      (positiveComments + negativeComments + neutralComments)) *
                      100,
                  )}
                  %)
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-red-500 h-2.5 rounded-full"
                style={{
                  width: `${Math.round((negativeComments / (positiveComments + negativeComments + neutralComments)) * 100)}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsOverview;
