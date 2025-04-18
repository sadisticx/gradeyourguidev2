import React, { useState, useEffect } from "react";
import { fetchData, insertData, updateData, deleteData } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PlusCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BackButton from "@/components/ui/back-button";
import SectionsList from "@/components/sections/SectionsList";
import InstructorsList from "@/components/sections/InstructorsList";
import DepartmentsList from "@/components/sections/DepartmentsList";
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

        // Fetch instructors with department info
        const instructorData = await fetchData("instructors");
        const instructorsWithDetails = instructorData.map((instructor) => {
          const department = departmentData.find(
            (d) => d.id === instructor.department_id,
          );
          return {
            ...instructor,
            departmentName: department ? department.name : "Unknown Department",
            sections: [], // Will be populated with section data later
          };
        });

        // Fetch section-instructor relationships
        const sectionInstructorData = await fetchData("section_instructors");

        // Map sections to instructors
        const instructorsWithSections = instructorsWithDetails.map(
          (instructor) => {
            const assignedSections = sectionInstructorData
              .filter((si) => si.instructor_id === instructor.id)
              .map((si) => {
                const section = sectionsWithDepartment.find(
                  (s) => s.id === si.section_id,
                );
                return section || null;
              })
              .filter(Boolean);

            return {
              ...instructor,
              sections: assignedSections,
            };
          },
        );

        setInstructors(instructorsWithSections);

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
          {
            id: "1",
            name: "Bachelor of Science in Information Technology",
            code: "BSIT",
          },
          {
            id: "2",
            name: "Bachelor of Science in Hospitality Management",
            code: "BSHM",
          },
          {
            id: "3",
            name: "Bachelor of Science in Political Science",
            code: "BSPOLSCI",
          },
          { id: "4", name: "Bachelor of Science in Education", code: "BSED" },
          {
            id: "5",
            name: "Bachelor of Science in Business Administration",
            code: "BSBA",
          },
        ];
        setDepartments(defaultDepartments);

        // Set default sections
        const defaultSections = [
          {
            id: "101",
            name: "Introduction to Programming",
            code: "BSIT101-A",
            department_id: "1",
            departmentName: "Bachelor of Science in Information Technology",
          },
          {
            id: "102",
            name: "Food and Beverage Service",
            code: "BSHM101-A",
            department_id: "2",
            departmentName: "Bachelor of Science in Hospitality Management",
          },
          {
            id: "103",
            name: "Political Theories",
            code: "BSPOLSCI101-A",
            department_id: "3",
            departmentName: "Bachelor of Science in Political Science",
          },
          {
            id: "104",
            name: "Educational Psychology",
            code: "BSED101-A",
            department_id: "4",
            departmentName: "Bachelor of Science in Education",
          },
          {
            id: "105",
            name: "Principles of Management",
            code: "BSBA101-A",
            department_id: "5",
            departmentName: "Bachelor of Science in Business Administration",
          },
        ];
        setSections(defaultSections);
        setFilteredSections(defaultSections);

        // Set default instructors
        const defaultInstructors = [
          {
            id: "201",
            name: "Dr. John Smith",
            email: "john.smith@example.com",
            department_id: "1",
            departmentName: "Bachelor of Science in Information Technology",
            sections: [defaultSections[0]],
          },
          {
            id: "202",
            name: "Prof. Jane Doe",
            email: "jane.doe@example.com",
            department_id: "2",
            departmentName: "Bachelor of Science in Hospitality Management",
            sections: [defaultSections[1]],
          },
          {
            id: "203",
            name: "Dr. Robert Johnson",
            email: "robert.johnson@example.com",
            department_id: "3",
            departmentName: "Bachelor of Science in Political Science",
            sections: [defaultSections[2]],
          },
          {
            id: "204",
            name: "Prof. Maria Garcia",
            email: "maria.garcia@example.com",
            department_id: "4",
            departmentName: "Bachelor of Science in Education",
            sections: [defaultSections[3]],
          },
          {
            id: "205",
            name: "Dr. William Chen",
            email: "william.chen@example.com",
            department_id: "5",
            departmentName: "Bachelor of Science in Business Administration",
            sections: [defaultSections[4]],
          },
        ];
        setInstructors(defaultInstructors);
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
          <div className="flex justify-between items-center mb-4">
            <div></div>
            <Button
              onClick={() => {
                toast({
                  title: "Coming Soon",
                  description:
                    "Add instructor functionality will be implemented soon.",
                });
              }}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Instructor
            </Button>
          </div>

          <InstructorsList
            instructors={instructors}
            onEdit={() => {
              toast({
                title: "Coming Soon",
                description: "Instructor editing will be implemented soon.",
              });
            }}
            onDelete={() => {
              toast({
                title: "Coming Soon",
                description: "Instructor deletion will be implemented soon.",
              });
            }}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="departments" className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <div></div>
            <Button
              onClick={() => {
                toast({
                  title: "Coming Soon",
                  description:
                    "Add department functionality will be implemented soon.",
                });
              }}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Department
            </Button>
          </div>

          <DepartmentsList
            departments={departments}
            onEdit={() => {
              toast({
                title: "Coming Soon",
                description: "Department editing will be implemented soon.",
              });
            }}
            onDelete={() => {
              toast({
                title: "Coming Soon",
                description: "Department deletion will be implemented soon.",
              });
            }}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SectionsPage;
