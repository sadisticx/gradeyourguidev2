import React, { useState } from "react";
import {
  Eye,
  MoreHorizontal,
  Link,
  Copy,
  Edit,
  Trash2,
  Power,
  PowerOff,
  Plus,
} from "lucide-react";
import { format } from "date-fns";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FormData {
  id: string;
  title: string;
  questionnaire: string;
  section: string;
  status: "active" | "inactive";
  responses: number;
  createdAt: Date;
  expiresAt: Date;
}

interface FormsListProps {
  forms?: FormData[];
  onActivateForm?: (id: string) => void;
  onDeactivateForm?: (id: string) => void;
  onDeleteForm?: (id: string) => void;
  onEditForm?: (id: string) => void;
  onViewForm?: (id: string) => void;
  onCopyLink?: (id: string) => void;
  isLoading?: boolean;
}

const FormsList = ({
  forms = [],
  onActivateForm = () => {},
  onDeactivateForm = () => {},
  onDeleteForm = () => {},
  onEditForm = () => {},
  onViewForm = () => {},
  onCopyLink = () => {},
  isLoading = false,
}: FormsListProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);

  const handleStatusChange = (
    id: string,
    currentStatus: "active" | "inactive",
  ) => {
    // Find the form and update its status locally
    const updatedForms = forms.map((form) => {
      if (form.id === id) {
        return {
          ...form,
          status: currentStatus === "active" ? "inactive" : "active",
        };
      }
      return form;
    });

    // Call the appropriate callback
    if (currentStatus === "active") {
      onDeactivateForm(id);
    } else {
      onActivateForm(id);
    }
  };

  const handleDeleteClick = (id: string) => {
    setSelectedFormId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedFormId) {
      onDeleteForm(selectedFormId);
      setDeleteDialogOpen(false);
      setSelectedFormId(null);
    }
  };

  return (
    <div className="w-full bg-white rounded-md shadow">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Evaluation Forms</h2>
          <Button>Create New Form</Button>
        </div>

        <Table>
          <TableCaption>List of all evaluation forms</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Questionnaire</TableHead>
              <TableHead>Section</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Responses</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-6 text-muted-foreground"
                >
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2">Loading forms...</p>
                </TableCell>
              </TableRow>
            ) : forms.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-6 text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center p-8">
                    <p className="mb-2 text-lg font-semibold">No forms found</p>
                    <p className="mb-6 text-sm text-gray-500">
                      Create your first form to get started
                    </p>
                    <Button
                      onClick={() =>
                        document.querySelector("button:has(.Plus)")?.click()
                      }
                      className="mt-2"
                    >
                      <Plus className="mr-2 h-4 w-4" /> Create New Form
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              forms.map((form) => (
                <TableRow key={form.id}>
                  <TableCell className="font-medium">{form.title}</TableCell>
                  <TableCell>{form.questionnaire}</TableCell>
                  <TableCell>{form.section}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={form.status === "active"}
                        onCheckedChange={() =>
                          handleStatusChange(form.id, form.status)
                        }
                      />
                      <Badge
                        variant={
                          form.status === "active" ? "default" : "secondary"
                        }
                      >
                        {form.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>{form.responses}</TableCell>
                  <TableCell>{format(form.createdAt, "MMM d, yyyy")}</TableCell>
                  <TableCell>{format(form.expiresAt, "MMM d, yyyy")}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onViewForm(form.id)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onCopyLink(form.id)}>
                          <Link className="mr-2 h-4 w-4" />
                          Copy Link
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEditForm(form.id)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Form
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {form.status === "active" ? (
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(form.id, form.status)
                            }
                          >
                            <PowerOff className="mr-2 h-4 w-4" />
                            Deactivate
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(form.id, form.status)
                            }
                          >
                            <Power className="mr-2 h-4 w-4" />
                            Activate
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDeleteClick(form.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this evaluation form? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FormsList;
