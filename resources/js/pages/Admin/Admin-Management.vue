<script setup lang="ts">
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/./components/ui/table';
import Skeleton from '@/components/Skeleton.vue';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/vue3';
import { useQuery, useQueryClient } from '@tanstack/vue-query';
import axios from 'axios';
import { LoaderCircle, MinusCircle, Pencil, Trash2, UserCircle2 } from 'lucide-vue-next';
import { ref } from 'vue';
import { toast } from 'vue-sonner';

const queryClient = useQueryClient();

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Management',
        href: '/admin/admin-management',
    },
];

const fetchAdmins = async () => {
    const query = `
    query {
      admins {
        encrypted_id
        name
        email
        role
        designation
      }
    }
  `;
    const response = await axios.post(import.meta.env.VITE_APP_GRAPHQL_ENDPOINT, { query });
    return response.data.data;
};

const { isPending, data } = useQuery({
    queryKey: ['fetchAdmins'],
    queryFn: fetchAdmins,
});

const openDialog = ref(false);

function createAdminDialog() {
    openDialog.value = true;
}

const createForm = useForm({
    name: '',
    email: '',
    password: '',
    designation: '',
});

const createAdmin = () => {
    createForm.post(route('create.admin'), {
        onSuccess: () => {
            toast.success('Admin account created successfully');
            createForm.reset();
            openDialog.value = false;
            queryClient.invalidateQueries({ queryKey: ['fetchAdmins'] });
        },
        onError: () => {
            toast.error('Email already exists');
            console.error('Error');
        },
    });
};

const editDialog = ref(false);

function editAdminDialog(id: string, name: string, email: string, designation: string) {
    updateForm.id = id;
    updateForm.name = name;
    updateForm.email = email;
    updateForm.designation = designation;
    editDialog.value = true;
}

const updateForm = useForm({
    id: '',
    name: '',
    email: '',
    password: '',
    designation: '',
});

const updateAdmin = () => {
    updateForm.patch(route('update.admin'), {
        onSuccess: () => {
            toast.success('Admin account updated successfully');
            updateForm.reset();
            editDialog.value = false;
            queryClient.invalidateQueries({ queryKey: ['fetchAdmins'] });
        },
        onError: () => {
            toast.error('Email already exists');
            console.error('Error');
        },
    });
};

const deleteDialog = ref(false);

function deleteAdminDialog(id: string) {
    deleteForm.id = id;
    deleteDialog.value = true;
}

const deleteForm = useForm({
    id: '',
});

const deleteAdmin = () => {
    deleteForm.delete(route('delete.admin'), {
        onSuccess: () => {
            toast.success('Admin account deleted successfully');
            deleteForm.reset();
            deleteDialog.value = false;
            queryClient.invalidateQueries({ queryKey: ['fetchAdmins'] });
        },
        onError: () => {
            toast.error('Deletion Error');
            console.error('Error');
        },
    });
};
</script>

<template>
    <Head title="Admin Management" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="space-y-6 p-4">
            <!-- Top Right Add Button -->
            <div class="flex w-full items-center justify-between">
                <h6 class="text-md flex-1 font-bold">Administrators</h6>

                <Dialog v-model:open="openDialog">
                    <DialogTrigger as-child>
                        <Button @click="createAdminDialog" class="cursor-pointer text-[12px]"> + New </Button>
                    </DialogTrigger>
                    <DialogContent class="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Add Admin</DialogTitle>
                            <DialogDescription> Enter details for a new admin </DialogDescription>
                        </DialogHeader>

                        <form action="" @submit.prevent="createAdmin">
                            <div class="grid gap-4 py-4">
                                <div class="grid grid-cols-4 items-center gap-4">
                                    <Label class="text-right">Name</Label>
                                    <Input v-model="createForm.name" placeholder="John Doe" class="col-span-3" required />
                                </div>
                                <div class="grid grid-cols-4 items-center gap-4">
                                    <Label class="text-right">Designation</Label>
                                    <Input v-model="createForm.designation" placeholder="Designation" class="col-span-3" required />
                                </div>
                                <div class="grid grid-cols-4 items-center gap-4">
                                    <Label class="text-right">Email</Label>
                                    <Input v-model="createForm.email" type="email" placeholder="john@example.com" class="col-span-3" required />
                                </div>
                                <div class="grid grid-cols-4 items-center gap-4">
                                    <Label class="text-start">Password</Label>
                                    <Input v-model="createForm.password" placeholder="Password" type="password" class="col-span-3" required />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" class="cursor-pointer" :disabled="createForm.processing">
                                    <LoaderCircle v-if="createForm.processing" class="h-4 w-4 animate-spin" />
                                    Save
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                <Dialog v-model:open="editDialog">
                    <DialogContent class="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Edit Admin</DialogTitle>
                            <DialogDescription> Update details for the admin </DialogDescription>
                        </DialogHeader>

                        <form action="" @submit.prevent="updateAdmin">
                            <div class="grid gap-4 py-4">
                                <div class="grid grid-cols-4 items-center gap-4">
                                    <Label class="text-right">Name</Label>
                                    <Input v-model="updateForm.name" placeholder="John Doe" class="col-span-3" required />
                                </div>
                                <div class="grid grid-cols-4 items-center gap-4">
                                    <Label class="text-right">Designation</Label>
                                    <Input v-model="updateForm.designation" placeholder="Designation" class="col-span-3" required />
                                </div>
                                <div class="grid grid-cols-4 items-center gap-4">
                                    <Label class="text-right">Email</Label>
                                    <Input v-model="updateForm.email" type="email" placeholder="john@example.com" class="col-span-3" required />
                                </div>
                                <div class="grid grid-cols-4 items-center gap-4">
                                    <Label class="text-start">Change Password</Label>
                                    <Input v-model="updateForm.password" placeholder="Password" type="password" class="col-span-3" />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" class="cursor-pointer" :disabled="updateForm.processing">
                                    <LoaderCircle v-if="updateForm.processing" class="h-4 w-4 animate-spin" />
                                    Save</Button
                                >
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                <Dialog v-model:open="deleteDialog">
                    <DialogContent class="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Delete Admin</DialogTitle>
                            <DialogDescription> Are you sure you want to delete this admin? This action cannot be undone. </DialogDescription>
                        </DialogHeader>

                        <form action="" @submit.prevent="deleteAdmin">
                            <DialogFooter>
                                <Button type="submit" class="cursor-pointer" variant="destructive" :disabled="deleteForm.processing">
                                    <LoaderCircle v-if="deleteForm.processing" class="h-4 w-4 animate-spin" />
                                    Delete</Button
                                >
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div class="bg-background overflow-hidden rounded-md border">
                <Table>
                    <TableHeader class="sticky top-0 z-10 bg-slate-50">
                        <TableRow class="text-[12px] [&>th]:py-4">
                            <TableHead class=""> # </TableHead>

                            <TableHead> User </TableHead>

                            <TableHead> Email Address </TableHead>

                            <TableHead> Designation </TableHead>

                            <TableHead> Role </TableHead>

                            <TableHead class="text-center"> Actions </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody class="[&>tr:nth-child(even)]:bg-muted/20 [&>tr:hover]:bg-sky-50/40">
                        <!-- Loading -->
                        <TableRow v-if="isPending">
                            <TableCell colspan="5" class="py-10">
                                <Skeleton />
                            </TableCell>
                        </TableRow>

                        <!-- Empty -->
                        <TableRow v-else-if="data?.admins.length === 0">
                            <TableCell colspan="5" class="py-16">
                                <div class="text-muted-foreground flex flex-col items-center gap-3">
                                    <MinusCircle class="h-10 w-10 text-red-400" />

                                    <p class="text-sm">No administrators found</p>
                                </div>
                            </TableCell>
                        </TableRow>

                        <!-- Data -->
                        <TableRow v-else v-for="(admin, index) in data?.admins" :key="admin.encrypted_id">
                            <!-- Index -->
                            <TableCell>
                                <span class="text-muted-foreground text-sm font-medium">
                                    {{ Number(index) + 1 }}
                                </span>
                            </TableCell>

                            <!-- User -->
                            <TableCell>
                                <div class="flex items-center gap-3">
                                    <div class="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100">
                                        <UserCircle2 class="h-6 w-6 text-sky-600" />
                                    </div>

                                    <div>
                                        <p class="text-sm font-medium">
                                            {{ admin.name }}
                                        </p>

                                        <p class="text-muted-foreground text-xs">Administrator</p>
                                    </div>
                                </div>
                            </TableCell>

                            <!-- Email -->
                            <TableCell>
                                <span class="text-sm text-slate-600">
                                    {{ admin.email }}
                                </span>
                            </TableCell>

                            <!-- Designation -->
                            <TableCell>
                                <span class="text-sm text-slate-600">
                                    {{ admin.designation }}
                                </span>
                            </TableCell>

                            <!-- Role -->
                            <TableCell>
                                <Badge class="rounded-md bg-sky-100 p-1 text-[12px] text-sky-700">
                                    {{ admin.role == 1 ? 'Admin' : 'User' }}
                                </Badge>
                            </TableCell>

                            <!-- Actions -->
                            <TableCell class="text-center">
                                <div class="flex justify-center gap-2">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        class="hover:bg-sky-100"
                                        @click="editAdminDialog(admin.encrypted_id, admin.name, admin.email, admin.designation)"
                                    >
                                        <Pencil class="h-4 w-4" />
                                    </Button>

                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        class="text-red-500 hover:bg-red-50"
                                        @click="deleteAdminDialog(admin.encrypted_id)"
                                    >
                                        <Trash2 class="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    </AppLayout>
</template>
