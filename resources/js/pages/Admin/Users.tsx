import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, router } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { type User as AppUser } from '@/types';
import { store, update, destroy } from '@/routes/admin/users';

interface Props {
  users: Array<{
    id: number;
    name: string;
    email: string;
    phone?: string | null;
    role: 'user' | 'admin';
    created_at: string;
  }>;
}

export default function Users({ users }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Props['users'][number] | null>(null);

  const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
    name: '',
    email: '',
    phone: '',
    role: 'user' as 'user' | 'admin',
    password: '',
  });

  const openCreateDialog = () => {
    setEditingUser(null);
    reset();
    clearErrors();
    setIsDialogOpen(true);
  };

  const openEditDialog = (user: Props['users'][number]) => {
    if (user.email === 'admin@area24one.com') {
      return;
    }
    setEditingUser(user);
    setData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: 'user',
      password: '',
    });
    clearErrors();
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      post(update.url(editingUser.id), {
        onSuccess: () => setIsDialogOpen(false),
      });
    } else {
      post(store.url(), {
        onSuccess: () => setIsDialogOpen(false),
      });
    }
  };

  const handleDelete = (id: number) => {
    const user = users.find((u) => u.id === id);
    if (user?.email === 'admin@area24one.com') return;
    if (confirm('Are you sure you want to delete this user?')) router.delete(destroy.url(id));
  };

  return (
    <AppLayout breadcrumbs={[{ title: 'Users', href: '/admin/users' }]}>
      <Head title="Manage Users" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Users</h1>
            <p className="text-muted-foreground">
              View and manage application users.
            </p>
          </div>
          <Button onClick={openCreateDialog} className="gap-2">
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => openEditDialog(user)}
                            disabled={user.email === 'admin@area24one.com'}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-500 hover:text-red-600"
                            onClick={() => handleDelete(user.id)}
                            disabled={user.email === 'admin@area24one.com'}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>{editingUser ? 'Edit User' : 'Create New User'}</DialogTitle>
              <DialogDescription>Manage user details.</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    value={data.name} 
                    onChange={(e) => setData('name', e.target.value)} 
                    placeholder="Full name"
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={data.email} 
                    onChange={(e) => setData('email', e.target.value)} 
                    placeholder="user@example.com"
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    id="phone" 
                    value={data.phone} 
                    onChange={(e) => setData('phone', e.target.value)} 
                    placeholder="Phone number"
                  />
                  {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <div className="text-sm text-muted-foreground">user</div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{editingUser ? 'Password (optional to change)' : 'Password'}</Label>
                <Input 
                  id="password" 
                  type="password"
                  value={data.password} 
                  onChange={(e) => setData('password', e.target.value)} 
                  placeholder={editingUser ? 'Leave blank to keep current' : 'Minimum 8 characters'}
                />
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                  {editingUser ? 'Save Changes' : 'Create User'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
