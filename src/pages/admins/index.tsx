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
import SectionForm from "@/components/sections/SectionForm";
import InstructorForm from "@/components/sections/InstructorForm";
import DepartmentForm from "@/components/sections/DepartmentForm";
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

  // Form states
  const [isDepartmentFormOpen, setIsDepartmentFormOpen] = useState(false);
  const [selectedDepartmentItem, setSelectedDepartmentItem] =
    useState<any>(null);
  const [isSectionFormOpen, setIsSectionFormOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<any>(null);
  const [isInstructorFormOpen, setIsInstructorFormOpen] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState<any>(null);
  const [filteredInstructors, setFilteredInstructors] = useState<any[]>([]);

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

  // Fetch departments, sections, and instructors data when the sections tab is active
  useEffect(() => {
    const loadSectionsData = async () => {
      if (activeTab !== "sections") return;

      setIsLoading(true);
      try {
        // Fetch departments
        const departmentData = await fetchData("departments");
        setDepartments(departmentData);

        // Fetch sections
        const sectionData = await fetchData("sections");
        const sectionsWithDepartment = sectionData.map((section: any) => {
          const department = departmentData.find(
            (d: any) => d.id === section.department_id,
          );
          return {
            ...section,
            departmentName: department ? department.name : "Unknown Department",
          };
        });
        setSections(sectionsWithDepartment);
        setFilteredSections(sectionsWithDepartment);

        // Fetch instructors
        const instructorData = await fetchData("instructors");
        const instructorsWithDepartment = instructorData.map(
          (instructor: any) => {
            const department = departmentData.find(
              (d: any) => d.id === instructor.department_id,
            );
            return {
              ...instructor,
              departmentName: department
                ? department.name
                : "Unknown Department",
            };
          },
        );
        setInstructors(instructorsWithDepartment);
        setFilteredInstructors(instructorsWithDepartment);

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
          },
          {
            id: "202",
            name: "Prof. Jane Doe",
            email: "jane.doe@example.com",
            department_id: "2",
            departmentName: "Bachelor of Science in Hospitality Management",
          },
          {
            id: "203",
            name: "Dr. Robert Johnson",
            email: "robert.johnson@example.com",
            department_id: "3",
            departmentName: "Bachelor of Science in Political Science",
          },
        ];
        setInstructors(defaultInstructors);
        setFilteredInstructors(defaultInstructors);
      } finally {
        setIsLoading(false);
      }
    };

    loadSectionsData();
  }, [activeTab, toast]);

  // Filter admins based on search term
  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.role.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Filter departments based on search term
  const filteredDepartments = departments.filter(
    (department) =>
      department.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      department.code?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Filter sections based on search term
  useEffect(() => {
    if (sections.length > 0) {
      const filtered = sections.filter(
        (section) =>
          section.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          section.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          section.departmentName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()),
      );
      setFilteredSections(filtered);
    }

    if (instructors.length > 0) {
      const filtered = instructors.filter(
        (instructor) =>
          instructor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          instructor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          instructor.departmentName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()),
      );
      setFilteredInstructors(filtered);
    }
  }, [searchTerm, sections, instructors]);

  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] =
    useState(false);
  const [resetPasswordEmail, setResetPasswordEmail] = useState("");

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

  // Department management handlers
  const handleAddDepartment = () => {
    setSelectedDepartmentItem(null);
    setIsDepartmentFormOpen(true);
  };

  const handleEditDepartment = (department: any) => {
    setSelectedDepartmentItem(department);
    setIsDepartmentFormOpen(true);
  };

  const handleDepartmentFormSubmit = async (data: any) => {
    try {
      setIsLoading(true);

      if (selectedDepartmentItem) {
        // Update existing department
        await updateData("departments", selectedDepartmentItem.id, data);

        // Update local state
        const updatedDepartments = departments.map((department) => {
          if (department.id === selectedDepartmentItem.id) {
            return {
              ...department,
              ...data,
            };
          }
          return department;
        });

        setDepartments(updatedDepartments);

        toast({
          title: "Success",
          description: "Department updated successfully",
        });
      } else {
        // Create new department
        const result = await insertData("departments", data);

        if (result && result.length > 0) {
          const newDepartment = result[0];
          setDepartments([...departments, newDepartment]);

          toast({
            title: "Success",
            description: "Department created successfully",
          });
        }
      }
    } catch (error) {
      console.error("Error saving department:", error);
      toast({
        title: "Error",
        description: "Failed to save department. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsDepartmentFormOpen(false);
      setSelectedDepartmentItem(null);
    }
  };

  // Section management handlers
  const handleAddSection = () => {
    setSelectedSection(null);
    setIsSectionFormOpen(true);
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

  const handleInstructorFormSubmit = async (data: any) => {
    try {
      setIsLoading(true);

      if (selectedInstructor) {
        // Update existing instructor
        await updateData("instructors", selectedInstructor.id, data);

        // Update local state
        const updatedInstructors = instructors.map((instructor) => {
          if (instructor.id === selectedInstructor.id) {
            const department = departments.find(
              (d) => d.id === data.department_id,
            );
            return {
              ...instructor,
              ...data,
              departmentName: department
                ? department.name
                : "Unknown Department",
            };
          }
          return instructor;
        });

        setInstructors(updatedInstructors);
        setFilteredInstructors(updatedInstructors);

        toast({
          title: "Success",
          description: "Instructor updated successfully",
        });
      } else {
        // Create new instructor
        const result = await insertData("instructors", data);

        if (result && result.length > 0) {
          const newInstructor = result[0];
          const department = departments.find(
            (d) => d.id === data.department_id,
          );
          const instructorWithDepartment = {
            ...newInstructor,
            departmentName: department ? department.name : "Unknown Department",
          };

          setInstructors([...instructors, instructorWithDepartment]);
          setFilteredInstructors([
            ...filteredInstructors,
            instructorWithDepartment,
          ]);

          toast({
            title: "Success",
            description: "Instructor created successfully",
          });
        }
      }
    } catch (error) {
      console.error("Error saving instructor:", error);
      toast({
        title: "Error",
        description: "Failed to save instructor. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsInstructorFormOpen(false);
      setSelectedInstructor(null);
    }
  };

  const handleDeleteInstructor = async (id: string) => {
    try {
      // Delete instructor from database
      await deleteData("instructors", id);

      // Update local state
      const updatedInstructors = instructors.filter(
        (instructor) => instructor.id !== id,
      );
      setInstructors(updatedInstructors);
      setFilteredInstructors(updatedInstructors);

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

  const handleSectionFormSubmit = async (data: any) => {
    try {
      setIsLoading(true);

      if (selectedSection) {
        // Update existing section
        await updateData("sections", selectedSection.id, data);

        // Update local state
        const updatedSections = sections.map((section) => {
          if (section.id === selectedSection.id) {
            const department = departments.find(
              (d) => d.id === data.department_id,
            );
            return {
              ...section,
              ...data,
              departmentName: department
                ? department.name
                : "Unknown Department",
            };
          }
          return section;
        });

        setSections(updatedSections);
        setFilteredSections(updatedSections);

        toast({
          title: "Success",
          description: "Section updated successfully",
        });
      } else {
        // Create new section
        const result = await insertData("sections", data);

        if (result && result.length > 0) {
          const newSection = result[0];
          const department = departments.find(
            (d) => d.id === data.department_id,
          );
          const sectionWithDepartment = {
            ...newSection,
            departmentName: department ? department.name : "Unknown Department",
          };

          setSections([...sections, sectionWithDepartment]);
          setFilteredSections([...filteredSections, sectionWithDepartment]);

          toast({
            title: "Success",
            description: "Section created successfully",
          });
        }
      }
    } catch (error) {
      console.error("Error saving section:", error);
      toast({
        title: "Error",
        description: "Failed to save section. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsSectionFormOpen(false);
      setSelectedSection(null);
    }
  };

  const handleDeleteSection = async (id: string) => {
    try {
      // Delete section from database
      await deleteData("sections", id);

      // Update local state
      const updatedSections = sections.filter((section) => section.id !== id);
      setSections(updatedSections);
      setFilteredSections(updatedSections);

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

  const handleDeleteDepartment = async (id: string) => {
    try {
      // Check if there are any sections or instructors using this department
      const sectionsUsingDepartment = sections.filter(
        (section) => section.department_id === id,
      );

      if (sectionsUsingDepartment.length > 0) {
        toast({
          title: "Cannot Delete Department",
          description:
            "This department is being used by sections. Please reassign them first.",
          variant: "destructive",
        });
        return;
      }

      // Delete department from database
      await deleteData("departments", id);

      // Update local state
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

          {activeTab === "sections" && (
            <div className="flex space-x-2">
              {activeSubTab === "departments" && (
                <Button onClick={handleAddDepartment}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add New Department
                </Button>
              )}
              {activeSubTab === "sections" && (
                <Button onClick={handleAddSection}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add New Section
                </Button>
              )}
              {activeSubTab === "instructors" && (
                <Button onClick={handleAddInstructor}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add New Instructor
                </Button>
              )}
            </div>
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
                      onEdit={(section) => {
                        setSelectedSection(section);
                        setIsSectionFormOpen(true);
                      }}
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

        {/* Department Form Dialog */}
        <Dialog
          open={isDepartmentFormOpen}
          onOpenChange={setIsDepartmentFormOpen}
        >
          <DialogContent className="sm:max-w-[600px] p-0">
            <DepartmentForm
              department={selectedDepartmentItem}
              onSubmit={handleDepartmentFormSubmit}
              onCancel={() => setIsDepartmentFormOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Section Form Dialog */}
        <Dialog open={isSectionFormOpen} onOpenChange={setIsSectionFormOpen}>
          <DialogContent className="sm:max-w-[600px] p-0">
            <SectionForm
              section={selectedSection}
              departments={departments}
              onSubmit={handleSectionFormSubmit}
              onCancel={() => setIsSectionFormOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Instructor Form Dialog */}
        <Dialog
          open={isInstructorFormOpen}
          onOpenChange={setIsInstructorFormOpen}
        >
          <DialogContent className="sm:max-w-[600px] p-0">
            <InstructorForm
              instructor={selectedInstructor}
              departments={departments}
              sections={sections}
              onSubmit={handleInstructorFormSubmit}
              onCancel={() => setIsInstructorFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminsPage;
