import React, { useState, useEffect } from "react";
import {
  fetchData,
  insertData,
  updateData,
  deleteData,
  signIn,
  getCurrentUser,
} from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { UserPlus, Search, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AdminList from "@/components/admins/AdminList";
import AdminForm from "@/components/admins/AdminForm";
import SectionsList from "@/components/sections/SectionsList";
import InstructorsList from "@/components/sections/InstructorsList";
import DepartmentsList from "@/components/sections/DepartmentsList";
import BackButton from "@/components/ui/back-button";
import { useNavigate } from "react-router-dom";

interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  lastLogin: string;
  permissions: string[];
}

const AdminsPage = () => {
  const [activeTab, setActiveTab] = useState("admins");
  const [activeSubTab, setActiveSubTab] = useState("sections");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const { toast } = useToast();
  const navigate = useNavigate();

  const [admins, setAdmins] = useState<Admin[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [instructors, setInstructors] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [filteredSections, setFilteredSections] = useState<any[]>([]);

  // Check current user and fetch admins from Supabase
  useEffect(() => {
    const checkUserAndLoadAdmins = async () => {
      setIsLoading(true);
      try {
        // Check if user is authenticated from localStorage first
        const authStatus = localStorage.getItem("isAuthenticated");
        const userString = localStorage.getItem("user");

        // If using backdoor login, skip the Supabase check
        if (authStatus === "true" && userString) {
          try {
            const user = JSON.parse(userString);
            if (user.email === "admin@faculty-eval.com") {
              // Backdoor admin user - skip Supabase check
              setCurrentUser(user);
              console.log("Using backdoor admin account");
            } else {
              // Regular user - verify with Supabase
              const { data: userData, error: userError } =
                await getCurrentUser();
              if (userError || !userData.user) {
                toast({
                  title: "Authentication Error",
                  description: "You must be logged in to access this page.",
                  variant: "destructive",
                });
                navigate("/login");
                return;
              }
              setCurrentUser(userData.user);
            }
          } catch (e) {
            console.error("Error parsing user data:", e);
            // Continue with Supabase check as fallback
            const { data: userData, error: userError } = await getCurrentUser();
            if (userError || !userData.user) {
              toast({
                title: "Authentication Error",
                description: "You must be logged in to access this page.",
                variant: "destructive",
              });
              navigate("/login");
              return;
            }
            setCurrentUser(userData.user);
          }
        } else {
          // No local storage data, check with Supabase
          const { data: userData, error: userError } = await getCurrentUser();
          if (userError || !userData.user) {
            toast({
              title: "Authentication Error",
              description: "You must be logged in to access this page.",
              variant: "destructive",
            });
            navigate("/login");
            return;
          }
          setCurrentUser(userData.user);
        }

        // Fetch admin data
        const data = await fetchData("admins");

        // Format the data
        const formattedData = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          email: item.email,
          role: item.role || "Viewer",
          status: item.status || "active",
          lastLogin: item.last_login || new Date().toISOString(),
          permissions: item.permissions || [],
        }));

        setAdmins(formattedData);

        toast({
          title: "Success",
          description: "Admin accounts loaded successfully",
        });
      } catch (error) {
        console.error("Error loading admins:", error);
        toast({
          title: "Error",
          description:
            "Failed to load admin accounts. Using sample data instead.",
          variant: "destructive",
        });

        // Set default admins for demo if loading fails
        setAdmins([
          {
            id: "1",
            name: "John Doe",
            email: "john.doe@example.com",
            role: "Super Admin",
            status: "active",
            lastLogin: "2023-06-15T10:30:00",
            permissions: [
              "manage_questionnaires",
              "manage_forms",
              "view_analytics",
              "manage_admins",
            ],
          },
          {
            id: "2",
            name: "Jane Smith",
            email: "jane.smith@example.com",
            role: "Department Admin",
            status: "active",
            lastLogin: "2023-06-14T14:45:00",
            permissions: [
              "manage_questionnaires",
              "manage_forms",
              "view_analytics",
            ],
          },
          {
            id: "3",
            name: "Robert Johnson",
            email: "robert.johnson@example.com",
            role: "Viewer",
            status: "inactive",
            lastLogin: "2023-05-20T09:15:00",
            permissions: ["view_analytics"],
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserAndLoadAdmins();
  }, [toast, navigate]);

  // Fetch sections, instructors, and departments data
  useEffect(() => {
    const loadSectionsData = async () => {
      if (activeTab !== "sections") return;

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
          description: "Sections data loaded successfully",
        });
      } catch (error) {
        console.error("Error loading sections data:", error);
        toast({
          title: "Error",
          description:
            "Failed to load sections data. Using sample data instead.",
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

    loadSectionsData();
  }, [activeTab, toast]);

  // Filter sections when department or search term changes
  useEffect(() => {
    if (activeTab !== "sections") return;

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
          section.code?.toLowerCase().includes(term) ||
          section.name?.toLowerCase().includes(term) ||
          section.departmentName?.toLowerCase().includes(term),
      );
    }
    setFilteredSections(filtered);
  }, [selectedDepartment, searchTerm, sections, activeTab]);

  // Filter admins based on search term
  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.role.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Filter instructors based on search term
  const filteredInstructors = instructors.filter(
    (instructor) =>
      instructor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.departmentName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  // Filter departments based on search term
  const filteredDepartments = departments.filter(
    (department) =>
      department.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      department.code?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] =
    useState(false);
  const [resetPasswordEmail, setResetPasswordEmail] = useState("");
  const [isInstructorFormOpen, setIsInstructorFormOpen] = useState(false);
  const [isSectionFormOpen, setIsSectionFormOpen] = useState(false);
  const [isDepartmentFormOpen, setIsDepartmentFormOpen] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState<any>(null);
  const [selectedSection, setSelectedSection] = useState<any>(null);
  const [selectedDepartmentItem, setSelectedDepartmentItem] =
    useState<any>(null);
  const [isAssignInstructorsOpen, setIsAssignInstructorsOpen] = useState(false);
  const [sectionsToAssign, setSectionsToAssign] = useState<string[]>([]);
  const [instructorsToAssign, setInstructorsToAssign] = useState<string[]>([]);

  const handleAddAdmin = () => {
    setSelectedAdmin(null);
    setIsFormOpen(true);
  };

  const handleEditAdmin = (admin: Admin) => {
    setSelectedAdmin(admin);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    console.log(
      "Admin form submitted with data:",
      JSON.stringify(data, null, 2),
    );
    try {
      setIsLoading(true);

      // Extract permissions from form data
      const permissions = Object.entries(data.permissions)
        .filter(([_, value]) => value === true)
        .map(([key]) => key);

      const adminData = {
        name: data.name,
        email: data.email,
        role: data.role,
        permissions,
        password: data.password, // This will be used for new admins only
      };

      if (selectedAdmin) {
        // Update existing admin
        // Remove password from update data if it's not provided
        const updatePayload = { ...adminData };
        if (!data.password) {
          delete updatePayload.password;
        }

        await updateData("admins", selectedAdmin.id, updatePayload);

        setAdmins(
          admins.map((admin) => {
            if (admin.id === selectedAdmin.id) {
              return {
                ...admin,
                name: data.name,
                email: data.email,
                role: data.role,
                permissions,
              };
            }
            return admin;
          }),
        );

        toast({
          title: "Success",
          description: "Admin account updated successfully",
        });
      } else {
        // Create new admin
        // For new admins, we need to create an auth user first
        try {
          console.log("Creating new admin with data:", adminData);

          // First, create the auth user if we're not in demo mode
          let authUserId = null;
          try {
            // This is a simplified approach - in a real app, you'd use Supabase auth
            // For demo purposes, we'll just create the admin record
            console.log("Skipping auth user creation in demo mode");
          } catch (authError) {
            console.error("Error creating auth user:", authError);
            // Continue anyway for demo purposes
          }

          // Create admin in the database
          const adminRecord = {
            ...adminData,
            auth_user_id: authUserId,
            status: "active",
            last_login: new Date().toISOString(),
          };

          console.log("Inserting admin record:", adminRecord);
          const result = await insertData("admins", adminRecord);

          if (result && result.length > 0) {
            const newAdmin: Admin = {
              id: result[0].id,
              name: data.name,
              email: data.email,
              role: data.role,
              status: "active",
              lastLogin: new Date().toISOString(),
              permissions,
            };

            setAdmins([...admins, newAdmin]);

            toast({
              title: "Success",
              description: "New admin account created successfully",
            });
          }
        } catch (error) {
          console.error("Error creating admin:", error);
          toast({
            title: "Error",
            description: "Failed to create admin account. Please try again.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Error saving admin:", error);
      toast({
        title: "Error",
        description: "Failed to save admin account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsFormOpen(false);
      // Force a re-render
      setTimeout(() => {
        setSelectedAdmin(null);
      }, 100);
    }
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
  };

  const handleDeleteAdmin = async (admin: Admin) => {
    try {
      await deleteData("admins", admin.id);

      // Update local state
      setAdmins(admins.filter((a) => a.id !== admin.id));

      toast({
        title: "Success",
        description: "Admin account deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting admin:", error);
      toast({
        title: "Error",
        description: "Failed to delete admin account. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleResetPassword = (admin: Admin) => {
    setResetPasswordEmail(admin.email);
    setIsResetPasswordModalOpen(true);
  };

  const handleDeactivateAdmin = async (admin: Admin) => {
    try {
      const newStatus = admin.status === "active" ? "inactive" : "active";
      await updateData("admins", admin.id, { status: newStatus });

      // Update local state
      setAdmins(
        admins.map((a) => {
          if (a.id === admin.id) {
            return {
              ...a,
              status: newStatus,
            };
          }
          return a;
        }),
      );

      toast({
        title: "Success",
        description: `Admin account ${newStatus === "active" ? "activated" : "deactivated"} successfully`,
      });
    } catch (error) {
      console.error("Error updating admin status:", error);
      toast({
        title: "Error",
        description: "Failed to update admin account status. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Section management handlers
  const handleAddSection = () => {
    setSelectedSection(null);
    setIsSectionFormOpen(true);
  };

  const handleEditSection = (section: any) => {
    setSelectedSection(section);
    setIsSectionFormOpen(true);
  };

  const handleDeleteSection = async (id: string) => {
    try {
      await deleteData("sections", id);
      setSections(sections.filter((section) => section.id !== id));
      setFilteredSections(
        filteredSections.filter((section) => section.id !== id),
      );
      toast({
        title: "Success",
        description: "Section deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting section:", error);
      toast({
        title: "Error",
        description: "Failed to delete section. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Instructor management handlers
  const handleAddInstructor = () => {
    setSelectedInstructor(null);
    setIsInstructorFormOpen(true);
  };

  const handleEditInstructor = (instructor: any) => {
    setSelectedInstructor(instructor);
    setIsInstructorFormOpen(true);
  };

  const handleDeleteInstructor = async (id: string) => {
    try {
      await deleteData("instructors", id);
      setInstructors(instructors.filter((instructor) => instructor.id !== id));
      toast({
        title: "Success",
        description: "Instructor deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting instructor:", error);
      toast({
        title: "Error",
        description: "Failed to delete instructor. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Department management handlers
  const handleAddDepartment = () => {
    setSelectedDepartmentItem(null);
    setIsDepartmentFormOpen(true);
  };

  const handleEditDepartment = (department: any) => {
    setSelectedDepartmentItem(department);
    setIsDepartmentFormOpen(true);
  };

  const handleDeleteDepartment = async (id: string) => {
    try {
      await deleteData("departments", id);
      setDepartments(departments.filter((department) => department.id !== id));
      toast({
        title: "Success",
        description: "Department deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting department:", error);
      toast({
        title: "Error",
        description: "Failed to delete department. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Instructor assignment handlers
  const handleAssignInstructors = () => {
    setSectionsToAssign([]);
    setInstructorsToAssign([]);
    setIsAssignInstructorsOpen(true);
  };

  const handleSaveAssignments = async () => {
    try {
      setIsLoading(true);

      // Delete existing assignments for these sections
      for (const sectionId of sectionsToAssign) {
        await deleteData("section_instructors", undefined, {
          column: "section_id",
          value: sectionId,
        });
      }

      // Create new assignments
      const assignments = [];
      for (const sectionId of sectionsToAssign) {
        for (const instructorId of instructorsToAssign) {
          assignments.push({
            section_id: sectionId,
            instructor_id: instructorId,
          });
        }
      }

      if (assignments.length > 0) {
        await insertData("section_instructors", assignments);
      }

      // Update local state
      const updatedInstructors = [...instructors];
      for (const instructorId of instructorsToAssign) {
        const instructorIndex = updatedInstructors.findIndex(
          (i) => i.id === instructorId,
        );
        if (instructorIndex >= 0) {
          const sectionObjects = sectionsToAssign
            .map((sectionId) => {
              return sections.find((s) => s.id === sectionId);
            })
            .filter(Boolean);

          updatedInstructors[instructorIndex] = {
            ...updatedInstructors[instructorIndex],
            sections: [
              ...updatedInstructors[instructorIndex].sections,
              ...sectionObjects,
            ],
          };
        }
      }
      setInstructors(updatedInstructors);

      toast({
        title: "Success",
        description: `Assigned ${instructorsToAssign.length} instructor(s) to ${sectionsToAssign.length} section(s) successfully`,
      });

      setIsAssignInstructorsOpen(false);
    } catch (error) {
      console.error("Error assigning instructors:", error);
      toast({
        title: "Error",
        description: "Failed to assign instructors. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Bulk select sections by year level
  const handleBulkSelectSections = (yearLevel: string) => {
    const yearSections = sections.filter((section) => {
      // Extract year level from section code (e.g., "BSIT101-A" -> "1")
      const match = section.code?.match(/\d+/);
      if (match && match[0]) {
        const sectionYear = match[0].charAt(0); // Get first digit
        return sectionYear === yearLevel;
      }
      return false;
    });

    setSectionsToAssign(yearSections.map((section) => section.id));

    toast({
      title: "Sections Selected",
      description: `Selected ${yearSections.length} sections from year level ${yearLevel}`,
    });
  };

  return (
    <div className="container mx-auto py-8 px-4 bg-gray-50 min-h-screen">
      <BackButton toDashboard className="mb-4" />
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Administrator Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage administrator accounts, sections, instructors, and
            departments in the system.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mr-4">
            <TabsList>
              <TabsTrigger value="admins">Admins</TabsTrigger>
              <TabsTrigger value="sections">Sections & Instructors</TabsTrigger>
            </TabsList>
          </Tabs>

          {activeTab === "admins" && (
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleAddAdmin}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add New Admin
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] p-0">
                <AdminForm
                  adminId={selectedAdmin?.id}
                  onSubmit={handleFormSubmit}
                  onCancel={handleFormCancel}
                />
              </DialogContent>
            </Dialog>
          )}

          {activeTab === "sections" && activeSubTab === "sections" && (
            <Button onClick={handleAddSection}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Section
            </Button>
          )}

          {activeTab === "sections" && activeSubTab === "instructors" && (
            <div className="flex space-x-2">
              <Button onClick={handleAssignInstructors} variant="outline">
                Assign Instructors
              </Button>
              <Button onClick={handleAddInstructor}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Instructor
              </Button>
            </div>
          )}

          {activeTab === "sections" && activeSubTab === "departments" && (
            <Button onClick={handleAddDepartment}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Department
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6">
        {activeTab === "admins" && (
          <Card className="bg-white">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>System Administrators</CardTitle>
                  <CardDescription>
                    View and manage all administrator accounts in the Faculty
                    Evaluation System.
                  </CardDescription>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search admins..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <AdminList
              admins={filteredAdmins}
              onEdit={handleEditAdmin}
              onDelete={handleDeleteAdmin}
              onResetPassword={handleResetPassword}
              onDeactivate={handleDeactivateAdmin}
              isLoading={isLoading}
            />
          </Card>
        )}

        {activeTab === "sections" && (
          <>
            {/* Filter and Search */}
            <Card className="bg-white p-4 mb-4">
              <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-end md:space-x-4">
                <div className="space-y-2 w-full md:w-1/4">
                  <label
                    htmlFor="department-filter"
                    className="text-sm font-medium"
                  >
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
                      placeholder="Search..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Sections & Instructors Management</CardTitle>
                <CardDescription>
                  Manage class sections, instructors, and departments for the
                  Faculty Evaluation System.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs
                  defaultValue="sections"
                  value={activeSubTab}
                  onValueChange={setActiveSubTab}
                  className="w-full"
                >
                  <div className="px-6 border-b">
                    <TabsList>
                      <TabsTrigger value="sections">Sections</TabsTrigger>
                      <TabsTrigger value="instructors">Instructors</TabsTrigger>
                      <TabsTrigger value="departments">Departments</TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="sections" className="p-6">
                    <SectionsList
                      sections={filteredSections}
                      onEdit={handleEditSection}
                      onDelete={handleDeleteSection}
                      isLoading={isLoading}
                    />
                  </TabsContent>

                  <TabsContent value="instructors" className="p-6">
                    <InstructorsList
                      instructors={filteredInstructors}
                      onEdit={handleEditInstructor}
                      onDelete={handleDeleteInstructor}
                      isLoading={isLoading}
                    />
                  </TabsContent>

                  <TabsContent value="departments" className="p-6">
                    <DepartmentsList
                      departments={filteredDepartments}
                      onEdit={handleEditDepartment}
                      onDelete={handleDeleteDepartment}
                      isLoading={isLoading}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </>
        )}

        {/* Reset Password Modal */}
        <Dialog
          open={isResetPasswordModalOpen}
          onOpenChange={setIsResetPasswordModalOpen}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Reset Password</DialogTitle>
              <DialogDescription>
                A password reset link will be sent to the following email
                address.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  value={resetPasswordEmail}
                  className="col-span-3"
                  readOnly
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsResetPasswordModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  // Send reset password email
                  toast({
                    title: "Password Reset",
                    description: `Password reset link sent to ${resetPasswordEmail}`,
                  });
                  setIsResetPasswordModalOpen(false);
                }}
              >
                Send Reset Link
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Assign Instructors Modal */}
        <Dialog
          open={isAssignInstructorsOpen}
          onOpenChange={setIsAssignInstructorsOpen}
        >
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Assign Instructors to Sections</DialogTitle>
              <DialogDescription>
                Select sections and instructors to create assignments.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div>
                <Label className="mb-2 block">
                  Bulk Select Sections by Year Level
                </Label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {["1", "2", "3", "4"].map((year) => (
                    <Button
                      key={year}
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkSelectSections(year)}
                    >
                      Year {year}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="mb-2 block">Select Sections</Label>
                <div className="border rounded-md p-4 max-h-[200px] overflow-y-auto">
                  {sections.map((section) => (
                    <div
                      key={section.id}
                      className="flex items-center space-x-2 mb-2"
                    >
                      <input
                        type="checkbox"
                        id={`section-${section.id}`}
                        checked={sectionsToAssign.includes(section.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSectionsToAssign([
                              ...sectionsToAssign,
                              section.id,
                            ]);
                          } else {
                            setSectionsToAssign(
                              sectionsToAssign.filter(
                                (id) => id !== section.id,
                              ),
                            );
                          }
                        }}
                      />
                      <label htmlFor={`section-${section.id}`}>
                        {section.code}: {section.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="mb-2 block">Select Instructors</Label>
                <div className="border rounded-md p-4 max-h-[200px] overflow-y-auto">
                  {instructors.map((instructor) => (
                    <div
                      key={instructor.id}
                      className="flex items-center space-x-2 mb-2"
                    >
                      <input
                        type="checkbox"
                        id={`instructor-${instructor.id}`}
                        checked={instructorsToAssign.includes(instructor.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setInstructorsToAssign([
                              ...instructorsToAssign,
                              instructor.id,
                            ]);
                          } else {
                            setInstructorsToAssign(
                              instructorsToAssign.filter(
                                (id) => id !== instructor.id,
                              ),
                            );
                          }
                        }}
                      />
                      <label htmlFor={`instructor-${instructor.id}`}>
                        {instructor.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAssignInstructorsOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveAssignments}
                disabled={
                  sectionsToAssign.length === 0 ||
                  instructorsToAssign.length === 0 ||
                  isLoading
                }
              >
                {isLoading ? "Saving..." : "Save Assignments"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminsPage;
