import React, { useState } from "react";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  UserPlus,
  Lock,
  UserX,
} from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  lastLogin: string;
  permissions: string[];
}

interface AdminListProps {
  admins?: Admin[];
  onEdit?: (admin: Admin) => void;
  onDelete?: (admin: Admin) => void;
  onResetPassword?: (admin: Admin) => void;
  onDeactivate?: (admin: Admin) => void;
  isLoading?: boolean;
}

const AdminList = ({
  admins = [],
  onEdit = () => {},
  onDelete = () => {},
  onResetPassword = () => {},
  onDeactivate = () => {},
  isLoading = false,
}: AdminListProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);

  const handleDeleteClick = (admin: Admin) => {
    setSelectedAdmin(admin);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedAdmin) {
      onDelete(selectedAdmin);
      setDeleteDialogOpen(false);
      setSelectedAdmin(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="w-full bg-white rounded-md shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Administrator Accounts</h2>
      </div>

      <Table>
        <TableCaption>
          List of all administrator accounts in the system.
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Login</TableHead>
            <TableHead>Permissions</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center py-6 text-muted-foreground"
              >
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2">Loading admin accounts...</p>
              </TableCell>
            </TableRow>
          ) : admins.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center py-6 text-muted-foreground"
              >
                <div className="flex flex-col items-center justify-center p-8">
                  <p className="mb-2 text-lg font-semibold">
                    No admin accounts found
                  </p>
                  <p className="mb-6 text-sm text-gray-500">
                    Add your first admin account to get started
                  </p>
                  <Button
                    onClick={() =>
                      onEdit({
                        id: "",
                        name: "",
                        email: "",
                        role: "",
                        status: "active",
                        lastLogin: "",
                        permissions: [],
                      })
                    }
                    className="mt-2"
                  >
                    <UserPlus className="mr-2 h-4 w-4" /> Add New Admin
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            admins.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell className="font-medium">{admin.name}</TableCell>
                <TableCell>{admin.email}</TableCell>
                <TableCell>{admin.role}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      admin.status === "active" ? "default" : "secondary"
                    }
                    className={
                      admin.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }
                  >
                    {admin.status === "active" ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(admin.lastLogin)}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {admin.permissions.map((permission, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {permission.split("_").join(" ")}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => onEdit(admin)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onResetPassword(admin)}>
                        <Lock className="mr-2 h-4 w-4" />
                        Reset Password
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onDeactivate(admin)}
                        className={
                          admin.status === "active"
                            ? "text-amber-600"
                            : "text-green-600"
                        }
                      >
                        <UserX className="mr-2 h-4 w-4" />
                        {admin.status === "active" ? "Deactivate" : "Activate"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteClick(admin)}
                        className="text-red-600"
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

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the admin account for{" "}
              {selectedAdmin?.name}? This action cannot be undone.
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

export default AdminList;
