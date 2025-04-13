import React, { useState } from "react";
import { Eye, Edit, Trash2, MoreHorizontal, Mail } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface InstructorsListProps {
  instructors: any[];
  onEdit: (instructor: any) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

const InstructorsList: React.FC<InstructorsListProps> = ({
  instructors = [],
  onEdit,
  onDelete,
  isLoading = false,
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState<any>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const handleDeleteClick = (instructor: any) => {
    setSelectedInstructor(instructor);
    setDeleteDialogOpen(true);
  };

  const handleViewClick = (instructor: any) => {
    setSelectedInstructor(instructor);
    setViewDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedInstructor) {
      onDelete(selectedInstructor.id);
      setDeleteDialogOpen(false);
      setSelectedInstructor(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Assigned Sections</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-6 text-muted-foreground"
                >
                  Loading instructors...
                </TableCell>
              </TableRow>
            ) : instructors.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-6 text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center p-8">
                    <p className="mb-2 text-lg font-semibold">
                      No instructors found
                    </p>
                    <p className="mb-6 text-sm text-gray-500">
                      Create your first instructor to get started
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              instructors.map((instructor) => (
                <TableRow key={instructor.id}>
                  <TableCell className="font-medium">
                    {instructor.name}
                  </TableCell>
                  <TableCell>{instructor.email || "N/A"}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{instructor.departmentName}</Badge>
                  </TableCell>
                  <TableCell>
                    {instructor.sections && instructor.sections.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {instructor.sections.length > 3 ? (
                          <>
                            <Badge variant="secondary">
                              {instructor.sections[0].code}
                            </Badge>
                            <Badge variant="secondary">
                              {instructor.sections[1].code}
                            </Badge>
                            <Badge variant="secondary">
                              +{instructor.sections.length - 2} more
                            </Badge>
                          </>
                        ) : (
                          instructor.sections.map((section) => (
                            <Badge key={section.id} variant="secondary">
                              {section.code}
                            </Badge>
                          ))
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">None</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleViewClick(instructor)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(instructor)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(instructor)}
                          className="text-destructive focus:text-destructive"
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the instructor "
              {selectedInstructor?.name}"? This action cannot be undone.
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

      {/* View Instructor Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Instructor Details</DialogTitle>
            <DialogDescription>
              View details for {selectedInstructor?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedInstructor && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium">Name</h3>
                  <p>{selectedInstructor.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Email</h3>
                  <p>{selectedInstructor.email || "N/A"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Department</h3>
                  <Badge variant="outline">
                    {selectedInstructor.departmentName}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Created</h3>
                  <p>
                    {selectedInstructor.created_at
                      ? format(
                          new Date(selectedInstructor.created_at),
                          "MMM d, yyyy",
                        )
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Assigned Sections</h3>
                {selectedInstructor.sections &&
                selectedInstructor.sections.length > 0 ? (
                  <div className="grid grid-cols-1 gap-2">
                    {selectedInstructor.sections.map((section) => (
                      <div key={section.id} className="p-2 border rounded-md">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium">{section.code}</span>{" "}
                            - {section.name}
                          </div>
                          <Badge variant="outline">
                            {section.departmentName}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No sections assigned</p>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                setViewDialogOpen(false);
                onEdit(selectedInstructor);
              }}
            >
              Edit Instructor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InstructorsList;
