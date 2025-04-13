import React, { useState, useEffect } from "react";
import { fetchData, insertData, updateData, deleteData } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PlusCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BackButton from "@/components/ui/back-button";
import SectionsList from "@/components/sections/SectionsList";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SectionsPage = () => {
  const [activeTab, setActiveTab] = useState("sections");
  const [isLoading, setIsLoading] = useState(true);
  const [sections, setSections] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [filteredSections, setFilteredSections] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  // Fetch data from Supabase
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Fetch departments
        const departmentData = await fetchData("departments");
        setDepartments(departmentData);

        // Fetch sections with department info
        const sectionData = await fetchData("sections");
        const sectionsWithDepartment = sectionData.map((section) => {
          const department = departmentData.find(
            (d) => d.id === section.department_id,
          );
          return {
            ...section,
            departmentName: department ? department.name : "Unknown Department",
          };
        });
        setSections(sectionsWithDepartment);
        setFilteredSections(sectionsWithDepartment);

        toast({
          title: "Success",
          description: "Data loaded successfully",
        });
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "Error",
          description: "Failed to load data. Using sample data instead.",
          variant: "destructive",
        });

        // Set default departments
        const defaultDepartments = [
          { id: "1", name: "Computer Science", code: "CS" },
          { id: "2", name: "Information Technology", code: "IT" },
          { id: "3", name: "Engineering", code: "ENG" },
        ];
        setDepartments(defaultDepartments);

        // Set default sections
        const defaultSections = [
          {
            id: "101",
            name: "Introduction to Programming",
            code: "CS101-A",
            department_id: "1",
            departmentName: "Computer Science",
          },
          {
            id: "102",
            name: "Data Structures",
            code: "CS201-B",
            department_id: "1",
            departmentName: "Computer Science",
          },
          {
            id: "103",
            name: "Web Development",
            code: "IT102-C",
            department_id: "2",
            departmentName: "Information Technology",
          },
        ];
        setSections(defaultSections);
        setFilteredSections(defaultSections);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [toast]);

  // Filter sections when department or search term changes
  useEffect(() => {
    let filtered = [...sections];
    if (selectedDepartment !== "all") {
      filtered = filtered.filter(
        (section) => section.department_id === selectedDepartment,
      );
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (section) =>
          section.code.toLowerCase().includes(term) ||
          section.name.toLowerCase().includes(term) ||
          section.departmentName.toLowerCase().includes(term),
      );
    }
    setFilteredSections(filtered);
  }, [selectedDepartment, searchTerm, sections]);

  return (
    <div className="container mx-auto py-8 px-4 bg-gray-50 min-h-screen">
      <BackButton toDashboard className="mb-4" />
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Sections & Instructors Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage class sections, instructors, and departments for the Faculty
            Evaluation System.
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
        <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-end md:space-x-4">
          <div className="space-y-2 w-full md:w-1/4">
            <label htmlFor="department-filter" className="text-sm font-medium">
              Department
            </label>
            <Select
              value={selectedDepartment}
              onValueChange={setSelectedDepartment}
            >
              <SelectTrigger id="department-filter">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((department) => (
                  <SelectItem key={department.id} value={department.id}>
                    {department.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 w-full md:w-1/3">
            <label htmlFor="search" className="text-sm font-medium">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search by name or code..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex space-x-2 w-full md:w-auto md:ml-auto">
            <Button
              onClick={() => {
                // Add department functionality will be implemented later
                toast({
                  title: "Coming Soon",
                  description:
                    "Department management will be implemented in the next update.",
                });
              }}
              variant="outline"
            >
              Add Department
            </Button>
          </div>
        </div>
      </div>

      <Tabs
        defaultValue="sections"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="sections">Sections</TabsTrigger>
            <TabsTrigger value="instructors">Instructors</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
          </TabsList>

          <div>
            {activeTab === "sections" && (
              <Button
                onClick={() => {
                  // Add section functionality will be implemented later
                  toast({
                    title: "Coming Soon",
                    description:
                      "Section management will be implemented in the next update.",
                  });
                }}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Section
              </Button>
            )}
          </div>
        </div>

        <TabsContent value="sections" className="space-y-6">
          <SectionsList
            sections={filteredSections}
            onEdit={() => {
              // Edit functionality will be implemented later
              toast({
                title: "Coming Soon",
                description:
                  "Section editing will be implemented in the next update.",
              });
            }}
            onDelete={() => {
              // Delete functionality will be implemented later
              toast({
                title: "Coming Soon",
                description:
                  "Section deletion will be implemented in the next update.",
              });
            }}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="instructors" className="space-y-6">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-lg font-semibold mb-2">Instructor Management</p>
            <p className="text-muted-foreground mb-6">
              Instructor management will be implemented in the next update.
            </p>
            <Button
              onClick={() => {
                toast({
                  title: "Coming Soon",
                  description:
                    "Instructor management will be implemented in the next update.",
                });
              }}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Instructor
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="departments" className="space-y-6">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-lg font-semibold mb-2">Department Management</p>
            <p className="text-muted-foreground mb-6">
              Department management will be implemented in the next update.
            </p>
            <Button
              onClick={() => {
                toast({
                  title: "Coming Soon",
                  description:
                    "Department management will be implemented in the next update.",
                });
              }}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Department
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SectionsPage;
