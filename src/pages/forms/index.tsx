import React, { useState, useEffect } from "react";
import { fetchData, insertData, updateData, deleteData } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Copy, Search } from "lucide-react";
import { format } from "date-fns";
import FormsList from "@/components/forms/FormsList";
import FormCreator from "@/components/forms/FormCreator";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import BackButton from "@/components/ui/back-button";

const FormsPage = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [showFormCreator, setShowFormCreator] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
<<<<<<< HEAD
  const [searchTerm, setSearchTerm] = useState("");

  const [forms, setForms] = useState<any[]>([]);
  const [archivedForms, setArchivedForms] = useState<any[]>([]);
  const [questionnaires, setQuestionnaires] = useState<
    { id: string; title: string }[]
  >([]);

  // Fetch forms and questionnaires from Supabase
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Fetch questionnaires first
        const questionnaireData = await fetchData("questionnaires");
        const formattedQuestionnaires = questionnaireData.map((item: any) => ({
          id: item.id,
          title: item.title || "Untitled Questionnaire",
        }));
        setQuestionnaires(formattedQuestionnaires);

        // Then fetch forms
        const formData = await fetchData("forms");

        // Format the data and separate active and archived forms
        const formattedData = formData.map((item: any) => {
          // Find the questionnaire title
          const questionnaire = formattedQuestionnaires.find(
            (q) => q.id === item.questionnaire_id,
          );

          return {
            id: item.id,
            title: item.title,
            questionnaire: item.questionnaire_id,
            questionnaireName: questionnaire
              ? questionnaire.title
              : "Unknown Questionnaire",
            section: item.section,
            status: item.status || "inactive",
            responses: item.responses || 0,
            createdAt: new Date(item.created_at),
            expiresAt: item.expires_at ? new Date(item.expires_at) : new Date(),
          };
        });

        // Split into active and archived forms
        setForms(formattedData.filter((form) => form.status === "active"));
        setArchivedForms(
          formattedData.filter((form) => form.status === "inactive"),
        );

        toast({
          title: "Success",
          description: "Forms and questionnaires loaded successfully",
        });
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "Error",
          description: "Failed to load forms. Please try again later.",
          variant: "destructive",
        });

        // Set default questionnaires
        setQuestionnaires([
          { id: "1", title: "Teaching Effectiveness Evaluation" },
          { id: "2", title: "Course Content Evaluation" },
          { id: "3", title: "Faculty Engagement Assessment" },
        ]);

        // Set default forms for demo if loading fails
        setForms([
          {
            id: "1",
            title: "End of Semester Evaluation",
            questionnaire: "1",
            questionnaireName: "Teaching Effectiveness Evaluation",
            section: "IT101-A",
            status: "active" as const,
            responses: 24,
            createdAt: new Date("2023-09-01"),
            expiresAt: new Date("2023-12-15"),
          },
          {
            id: "3",
            title: "Teaching Assistant Evaluation",
            questionnaire: "3",
            questionnaireName: "Faculty Engagement Assessment",
            section: "IT102-C",
            status: "active" as const,
            responses: 12,
            createdAt: new Date("2023-09-10"),
            expiresAt: new Date("2023-11-30"),
          },
        ]);

        // Set default archived forms
        setArchivedForms([
          {
            id: "2",
            title: "Mid-term Feedback",
            questionnaire: "2",
            questionnaireName: "Course Content Evaluation",
            section: "IT103-B",
            status: "inactive" as const,
            responses: 18,
            createdAt: new Date("2023-08-15"),
            expiresAt: new Date("2023-10-01"),
          },
          {
            id: "4",
            title: "Previous Semester Evaluation",
            questionnaire: "1",
            questionnaireName: "Teaching Effectiveness Evaluation",
            section: "IT101-D",
            status: "inactive" as const,
            responses: 45,
            createdAt: new Date("2023-01-15"),
            expiresAt: new Date("2023-05-30"),
          },
          {
            id: "5",
            title: "Department Chair Review",
            questionnaire: "3",
            questionnaireName: "Faculty Engagement Assessment",
            section: "IT102-A",
            status: "inactive" as const,
            responses: 12,
            createdAt: new Date("2023-02-10"),
            expiresAt: new Date("2023-03-10"),
          },
        ]);
=======

  const [forms, setForms] = useState<any[]>([]);
  const [archivedForms, setArchivedForms] = useState<any[]>([]);
  
  // Fetch forms from Supabase
  useEffect(() => {
    const loadForms = async () => {
      setIsLoading(true);
      try {
        const data = await fetchData('forms');
        
        // Format the data and separate active and archived forms
        const formattedData = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          questionnaire: item.questionnaire_id, // This should be replaced with the actual questionnaire title in a real app
          section: item.section,
          status: item.status || 'inactive',
          responses: item.responses || 0,
          createdAt: new Date(item.created_at),
          expiresAt: item.expires_at ? new Date(item.expires_at) : new Date()
        }));
        
        // Split into active and archived forms
        setForms(formattedData.filter(form => form.status === 'active'));
        setArchivedForms(formattedData.filter(form => form.status === 'inactive'));
        
        toast({
          title: "Success",
          description: "Forms loaded successfully"
        });
      } catch (error) {
        console.error('Error loading forms:', error);
        toast({
          title: "Error",
          description: "Failed to load forms. Please try again later.",
          variant: "destructive"
        });
        
        // Set default forms for demo if loading fails
        setForms([
    {
      id: "1",
      title: "End of Semester Evaluation",
      questionnaire: "Standard Faculty Evaluation",
      section: "CS101-A",
      status: "active" as const,
      responses: 24,
      createdAt: new Date("2023-09-01"),
      expiresAt: new Date("2023-12-15"),
    },
    {
      id: "2",
      title: "Mid-term Feedback",
      questionnaire: "Quick Feedback Form",
      section: "MATH202-B",
      status: "inactive" as const,
      responses: 18,
      createdAt: new Date("2023-08-15"),
      expiresAt: new Date("2023-10-01"),
    },
    {
      id: "3",
      title: "Teaching Assistant Evaluation",
      questionnaire: "TA Performance Review",
      section: "PHYS303-C",
      status: "active" as const,
      responses: 12,
      createdAt: new Date("2023-09-10"),
      expiresAt: new Date("2023-11-30"),
    },
  ]);

>>>>>>> 88aa6c009c924915bc547b81baa3eba92061fd2e
      } finally {
        setIsLoading(false);
      }
    };
<<<<<<< HEAD

    loadData();
  }, [toast]);
=======
    
    loadForms();
  }, [toast]);
  
  // Default archived forms for fallback
    {
      id: "4",
      title: "Previous Semester Evaluation",
      questionnaire: "Standard Faculty Evaluation",
      section: "ENG101-D",
      status: "inactive" as const,
      responses: 45,
      createdAt: new Date("2023-01-15"),
      expiresAt: new Date("2023-05-30"),
    },
    {
      id: "5",
      title: "Department Chair Review",
      questionnaire: "Leadership Assessment",
      section: "ADMIN-A",
      status: "inactive" as const,
      responses: 12,
      createdAt: new Date("2023-02-10"),
      expiresAt: new Date("2023-03-10"),
    },
  ]);
>>>>>>> 88aa6c009c924915bc547b81baa3eba92061fd2e

  const [selectedForm, setSelectedForm] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState("");

<<<<<<< HEAD
  // Filter forms based on search term
  const filteredForms = forms.filter(
    (form) =>
      form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.questionnaireName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredArchivedForms = archivedForms.filter(
    (form) =>
      form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.questionnaireName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleActivateForm = async (id: string) => {
    try {
      await updateData("forms", id, { status: "active" });

      // Find the form in archived forms
      const formToActivate = archivedForms.find((form) => form.id === id);
      if (formToActivate) {
        // Update local state
        const updatedForm = { ...formToActivate, status: "active" };
        setForms([...forms, updatedForm]);
        setArchivedForms(archivedForms.filter((form) => form.id !== id));

        toast({
          title: "Success",
          description: "Form activated successfully",
        });
      }
    } catch (error) {
      console.error("Error activating form:", error);
      toast({
        title: "Error",
        description: "Failed to activate form. Please try again.",
        variant: "destructive",
=======
  const handleActivateForm = async (id: string) => {
    try {
      await updateData('forms', id, { status: 'active' });
      
      // Find the form in archived forms
      const formToActivate = archivedForms.find(form => form.id === id);
      if (formToActivate) {
        // Update local state
        const updatedForm = { ...formToActivate, status: 'active' };
        setForms([...forms, updatedForm]);
        setArchivedForms(archivedForms.filter(form => form.id !== id));
        
        toast({
          title: "Success",
          description: "Form activated successfully"
        });
      }
    } catch (error) {
      console.error('Error activating form:', error);
      toast({
        title: "Error",
        description: "Failed to activate form. Please try again.",
        variant: "destructive"
>>>>>>> 88aa6c009c924915bc547b81baa3eba92061fd2e
      });
    }
  };

  const handleDeactivateForm = async (id: string) => {
    try {
<<<<<<< HEAD
      await updateData("forms", id, { status: "inactive" });

      // Find the form in active forms
      const formToDeactivate = forms.find((form) => form.id === id);
      if (formToDeactivate) {
        // Update local state
        const updatedForm = { ...formToDeactivate, status: "inactive" };
        setArchivedForms([...archivedForms, updatedForm]);
        setForms(forms.filter((form) => form.id !== id));

        toast({
          title: "Success",
          description: "Form deactivated successfully",
        });
      }
    } catch (error) {
      console.error("Error deactivating form:", error);
      toast({
        title: "Error",
        description: "Failed to deactivate form. Please try again.",
        variant: "destructive",
=======
      await updateData('forms', id, { status: 'inactive' });
      
      // Find the form in active forms
      const formToDeactivate = forms.find(form => form.id === id);
      if (formToDeactivate) {
        // Update local state
        const updatedForm = { ...formToDeactivate, status: 'inactive' };
        setArchivedForms([...archivedForms, updatedForm]);
        setForms(forms.filter(form => form.id !== id));
        
        toast({
          title: "Success",
          description: "Form deactivated successfully"
        });
      }
    } catch (error) {
      console.error('Error deactivating form:', error);
      toast({
        title: "Error",
        description: "Failed to deactivate form. Please try again.",
        variant: "destructive"
>>>>>>> 88aa6c009c924915bc547b81baa3eba92061fd2e
      });
    }
  };

  const handleDeleteForm = async (id: string) => {
    try {
<<<<<<< HEAD
      await deleteData("forms", id);

      // Update local state
      setForms(forms.filter((form) => form.id !== id));
      setArchivedForms(archivedForms.filter((form) => form.id !== id));

      toast({
        title: "Success",
        description: "Form deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting form:", error);
      toast({
        title: "Error",
        description: "Failed to delete form. Please try again.",
        variant: "destructive",
=======
      await deleteData('forms', id);
      
      // Update local state
      setForms(forms.filter(form => form.id !== id));
      setArchivedForms(archivedForms.filter(form => form.id !== id));
      
      toast({
        title: "Success",
        description: "Form deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting form:', error);
      toast({
        title: "Error",
        description: "Failed to delete form. Please try again.",
        variant: "destructive"
>>>>>>> 88aa6c009c924915bc547b81baa3eba92061fd2e
      });
    }
  };

  const handleEditForm = (id: string) => {
    const formToEdit = [...forms, ...archivedForms].find(
      (form) => form.id === id,
    );
    if (formToEdit) {
      setSelectedForm(formToEdit);
      setShowFormCreator(true);
    }
  };

  const handleViewForm = (id: string) => {
    const formToView = [...forms, ...archivedForms].find(
      (form) => form.id === id,
    );
    if (formToView) {
      setSelectedForm(formToView);
      setIsViewModalOpen(true);
    }
  };

  const handleCopyLink = (id: string) => {
    const form = [...forms, ...archivedForms].find((form) => form.id === id);
    if (form) {
      // Use the current window location to create a proper link to the form response page
      const baseUrl = window.location.origin;
      const link = `${baseUrl}/student/evaluation/${id}?section=${form.section}`;
      setCopiedLink(link);
      setIsCopyModalOpen(true);
      navigator.clipboard
        .writeText(link)
        .catch((err) => console.error("Could not copy text: ", err));
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      setIsLoading(true);
<<<<<<< HEAD

=======
      
>>>>>>> 88aa6c009c924915bc547b81baa3eba92061fd2e
      const formData = {
        title: data.title || `Evaluation Form ${forms.length + 1}`,
        questionnaire_id: data.questionnaire,
        section: data.section,
        status: data.isActive ? "active" : "inactive",
<<<<<<< HEAD
        expires_at: data.endDate?.toISOString(),
        created_at: data.startDate?.toISOString() || new Date().toISOString(),
      };

      if (selectedForm) {
        // Update existing form
        await updateData("forms", selectedForm.id, formData);

        // Find the questionnaire name
        const questionnaireName =
          questionnaires.find((q) => q.id === data.questionnaire)?.title ||
          "Unknown Questionnaire";

=======
        expires_at: data.endDate?.toISOString()
      };
      
      if (selectedForm) {
        // Update existing form
        await updateData('forms', selectedForm.id, formData);
        
>>>>>>> 88aa6c009c924915bc547b81baa3eba92061fd2e
        const updatedForm = {
          ...selectedForm,
          ...{
            title: data.title,
            questionnaire: data.questionnaire,
<<<<<<< HEAD
            questionnaireName,
            section: data.section,
            status: data.isActive ? "active" : "inactive",
            expiresAt: data.endDate,
          },
        };

        // Update local state based on status
        if (data.isActive) {
          setForms(
            forms.map((form) =>
              form.id === selectedForm.id ? updatedForm : form,
            ),
          );
          setArchivedForms(
            archivedForms.filter((form) => form.id !== selectedForm.id),
          );
        } else {
          setArchivedForms(
            archivedForms.map((form) =>
              form.id === selectedForm.id ? updatedForm : form,
            ),
          );
          setForms(forms.filter((form) => form.id !== selectedForm.id));
        }

        toast({
          title: "Success",
          description: "Form updated successfully",
        });
      } else {
        // Add new form
        const result = await insertData("forms", formData);

        if (result && result.length > 0) {
          // Find the questionnaire name
          const questionnaireName =
            questionnaires.find((q) => q.id === data.questionnaire)?.title ||
            "Unknown Questionnaire";

=======
            section: data.section,
            status: data.isActive ? "active" : "inactive",
            expiresAt: data.endDate
          }
        };
        
        // Update local state based on status
        if (data.isActive) {
          setForms(forms.map(form => form.id === selectedForm.id ? updatedForm : form));
          setArchivedForms(archivedForms.filter(form => form.id !== selectedForm.id));
        } else {
          setArchivedForms(archivedForms.map(form => form.id === selectedForm.id ? updatedForm : form));
          setForms(forms.filter(form => form.id !== selectedForm.id));
        }
        
        toast({
          title: "Success",
          description: "Form updated successfully"
        });
      } else {
        // Add new form
        const result = await insertData('forms', formData);
        
        if (result && result.length > 0) {
>>>>>>> 88aa6c009c924915bc547b81baa3eba92061fd2e
          const newForm = {
            id: result[0].id,
            title: data.title || `Evaluation Form ${forms.length + 1}`,
            questionnaire: data.questionnaire,
<<<<<<< HEAD
            questionnaireName,
            section: data.section,
            status: data.isActive ? "active" : "inactive",
            responses: 0,
            createdAt: data.startDate || new Date(),
            expiresAt: data.endDate,
          };

=======
            section: data.section,
            status: data.isActive ? "active" : "inactive",
            responses: 0,
            createdAt: new Date(),
            expiresAt: data.endDate
          };
          
>>>>>>> 88aa6c009c924915bc547b81baa3eba92061fd2e
          // Add to appropriate list based on status
          if (data.isActive) {
            setForms([...forms, newForm]);
          } else {
            setArchivedForms([...archivedForms, newForm]);
          }
<<<<<<< HEAD

          toast({
            title: "Success",
            description: "New form created successfully",
=======
          
          toast({
            title: "Success",
            description: "New form created successfully"
>>>>>>> 88aa6c009c924915bc547b81baa3eba92061fd2e
          });
        }
      }
    } catch (error) {
<<<<<<< HEAD
      console.error("Error saving form:", error);
      toast({
        title: "Error",
        description: "Failed to save form. Please try again.",
        variant: "destructive",
=======
      console.error('Error saving form:', error);
      toast({
        title: "Error",
        description: "Failed to save form. Please try again.",
        variant: "destructive"
>>>>>>> 88aa6c009c924915bc547b81baa3eba92061fd2e
      });
    } finally {
      setIsLoading(false);
      setSelectedForm(null);
      setShowFormCreator(false);
      setActiveTab("list");
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 bg-gray-50 min-h-screen">
      <BackButton toDashboard className="mb-4" />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Form Distribution</h1>
        {activeTab === "list" && !showFormCreator && (
          <Button onClick={() => setShowFormCreator(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Form
          </Button>
        )}
      </div>

      {!showFormCreator ? (
        <Tabs
          defaultValue="list"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="list">Active Forms</TabsTrigger>
              <TabsTrigger value="archived">Archived Forms</TabsTrigger>
            </TabsList>

            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search forms..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <TabsContent value="list" className="space-y-6">
            <FormsList
              forms={filteredForms}
              onActivateForm={handleActivateForm}
              onDeactivateForm={handleDeactivateForm}
              onDeleteForm={handleDeleteForm}
              onEditForm={handleEditForm}
              onViewForm={handleViewForm}
              onCopyLink={handleCopyLink}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="archived" className="space-y-6">
            <FormsList
              forms={filteredArchivedForms}
              onActivateForm={handleActivateForm}
              onDeleteForm={handleDeleteForm}
              onViewForm={handleViewForm}
              onCopyLink={handleCopyLink}
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center mb-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowFormCreator(false);
                setActiveTab("list");
                setSelectedForm(null);
              }}
              className="mr-2"
            >
              Back to Forms
            </Button>
            <h2 className="text-2xl font-semibold">
              {selectedForm
                ? "Edit Evaluation Form"
                : "Create New Evaluation Form"}
            </h2>
          </div>

          <FormCreator
            onSubmit={handleFormSubmit}
            initialData={selectedForm}
            questionnaires={questionnaires}
          />
        </div>
      )}

      {/* View Form Details Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Form Details</DialogTitle>
            <DialogDescription>
              View details for this evaluation form.
            </DialogDescription>
          </DialogHeader>
          {selectedForm && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium">Title</h3>
                  <p>{selectedForm.title}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Status</h3>
                  <Badge
                    variant={
                      selectedForm.status === "active" ? "default" : "secondary"
                    }
                  >
                    {selectedForm.status === "active" ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Questionnaire</h3>
                  <p>
                    {selectedForm.questionnaireName ||
                      selectedForm.questionnaire}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Section</h3>
                  <p>{selectedForm.section}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Created</h3>
                  <p>{format(selectedForm.createdAt, "MMM d, yyyy")}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Expires</h3>
                  <p>{format(selectedForm.expiresAt, "MMM d, yyyy")}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Responses</h3>
                  <p>{selectedForm.responses}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                setIsViewModalOpen(false);
                handleEditForm(selectedForm.id);
              }}
            >
              Edit Form
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Copy Link Modal */}
      <Dialog open={isCopyModalOpen} onOpenChange={setIsCopyModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Form Link</DialogTitle>
            <DialogDescription>
              This link has been copied to your clipboard.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <Input value={copiedLink} readOnly className="flex-1" />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => navigator.clipboard.writeText(copiedLink)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCopyModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FormsPage;
