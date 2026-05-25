<script setup lang="ts">
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/vue3';
import { ref } from 'vue';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/./components/ui/table/';
import Skeleton from '@/components/Skeleton.vue';
import SlowLink from '@/components/SlowLink.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useQuery, useQueryClient } from '@tanstack/vue-query';
import axios from 'axios';
import { Folder, LoaderCircle, MinusCircle, Pencil, Trash2 } from 'lucide-vue-next';
import { toast } from 'vue-sonner';

const queryClient = useQueryClient();

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'File Manager',
        href: '/admin/file-manager',
    },
];

const fetchCategories = async () => {
    const query = `
    query {
      categories {
        categoriesList {
            encrypted_id
            category
            parentID
            created_at
            totalFiles
        }
      }
    }
  `;
    const response = await axios.post(import.meta.env.VITE_APP_GRAPHQL_ENDPOINT, { query });
    return response.data.data;
};

const { isPending, data } = useQuery({
    queryKey: ['fetchCategories'],
    queryFn: fetchCategories,
});

const openDialog = ref(false);

function createCategoryDialog() {
    openDialog.value = true;
}

const createForm = useForm({
    category: '' as string,
});

const createCategory = () => {
    createForm.post(route('create.category'), {
        onSuccess: () => {
            toast.success('Category created successfully');
            createForm.reset();
            openDialog.value = false;
            queryClient.invalidateQueries({ queryKey: ['fetchCategories'] });
        },
        onError: () => {
            toast.error('Error creating category');
            console.error('Error');
        },
    });
};

const editDialog = ref(false);

function editCategoryDialog(id: string, category: string) {
    updateForm.id = id;
    updateForm.category = category;
    editDialog.value = true;
}

const updateForm = useForm({
    id: '' as string,
    category: '' as string,
});

const updateCategory = () => {
    updateForm.patch(route('update.category'), {
        onSuccess: () => {
            toast.success('Category updated successfully');
            updateForm.reset();
            editDialog.value = false;
            queryClient.invalidateQueries({ queryKey: ['fetchCategories'] });
        },
        onError: () => {
            toast.error('Error updating category');
            console.error('Error');
        },
    });
};

const deleteDialog = ref(false);

function deleteCategoryDialog(id: string) {
    deleteForm.id = id;
    deleteDialog.value = true;
}

const deleteForm = useForm({
    id: '',
});

const deleteCategory = () => {
    deleteForm.delete(route('delete.category'), {
        onSuccess: () => {
            toast.success('Category deleted successfully');
            deleteForm.reset();
            deleteDialog.value = false;
            queryClient.invalidateQueries({ queryKey: ['fetchCategories'] });
        },
        onError: () => {
            toast.error('Deletion Error');
            console.error('Error');
        },
    });
};
</script>

<template>
    <Head title="File Manager" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="space-y-6 p-4">
            <!-- Top Right Add Button -->
            <div class="flex w-full items-center justify-between">
                <h6 class="text-md flex-1 font-bold">Committees</h6>

                <Dialog v-model:open="openDialog">
                    <DialogTrigger as-child>
                        <Button @click="createCategoryDialog" class="cursor-pointer text-[12px]"> + New </Button>
                    </DialogTrigger>
                    <DialogContent class="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Add Committee</DialogTitle>
                            <DialogDescription> Create a new committee for the files </DialogDescription>
                        </DialogHeader>

                        <form action="" @submit.prevent="createCategory">
                            <div class="grid gap-4 py-4">
                                <div class="grid grid-cols-1 items-center gap-4">
                                    <Label class="text-right">Committee</Label>
                                    <Input v-model="createForm.category" placeholder="Committee Name" class="col-span-3" required />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" class="cursor-pointer" :disabled="createForm.processing">
                                    <LoaderCircle v-if="createForm.processing" class="h-4 w-4 animate-spin" />
                                    Save</Button
                                >
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                <Dialog v-model:open="editDialog">
                    <DialogContent class="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Edit Committee</DialogTitle>
                            <DialogDescription> Edit the details of the selected committee </DialogDescription>
                        </DialogHeader>

                        <form action="" @submit.prevent="updateCategory">
                            <div class="grid gap-4 py-4">
                                <div class="grid grid-cols-1 items-center gap-4">
                                    <Label class="text-right">Committee</Label>
                                    <Input v-model="updateForm.category" placeholder="Committee Name" class="col-span-3" required />
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
                            <DialogTitle>Delete Committee</DialogTitle>
                            <DialogDescription> Are you sure you want to delete this committee? This action cannot be undone. </DialogDescription>
                        </DialogHeader>

                        <form action="" @submit.prevent="deleteCategory">
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

            <div class="overflow-hidden rounded-md border bg-white">
                <Table>
                    <TableHeader class="bg-muted/40">
                        <TableRow class="text-[12px] [&>th]:py-4">
                            <TableHead class="text-muted-foreground]"> # </TableHead>

                            <TableHead class="text-muted-foreground"> Committee </TableHead>

                            <TableHead class="text-muted-foreground"> No. of Files </TableHead>

                            <TableHead class="text-muted-foreground"> Created </TableHead>

                            <TableHead class="text-muted-foreground text-center"> Actions </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody class="[&_tr:nth-child(even)]:bg-muted/20">
                        <!-- Loading -->
                        <TableRow v-if="isPending">
                            <TableCell colspan="10" class="py-10 text-center">
                                <Skeleton />
                            </TableCell>
                        </TableRow>

                        <!-- Empty -->
                        <TableRow v-else-if="data?.categories.categoriesList.length === 0">
                            <TableCell colspan="5" class="py-14">
                                <div class="text-muted-foreground flex flex-col items-center gap-2">
                                    <MinusCircle class="h-8 w-8 text-red-500" />
                                    <small>No Data Found</small>
                                </div>
                            </TableCell>
                        </TableRow>

                        <!-- Data -->
                        <TableRow
                            v-else
                            v-for="(category, index) in data?.categories.categoriesList"
                            :key="category.id"
                            class="hover:bg-muted/30 transition"
                        >
                            <!-- Index -->
                            <TableCell class="text-muted-foreground font-medium">
                                {{ Number(index) + 1 }}
                            </TableCell>

                            <!-- Category -->
                            <TableCell class="w-[320px]">
                                <SlowLink :href="route('admin.files', { id: category.encrypted_id })" prefetch class="group">
                                    <div class="group-hover:bg-muted/40 flex items-center gap-3 rounded-lg p-2 transition">
                                        <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                                            <Folder class="h-6 w-6 text-blue-500" />
                                        </div>

                                        <div class="space-y-1">
                                            <div class="text-sm font-semibold transition group-hover:text-blue-600">
                                                {{ category.category }}
                                            </div>

                                            <div class="text-muted-foreground text-xs">Click to view files</div>
                                        </div>
                                    </div>
                                </SlowLink>
                            </TableCell>

                            <!-- Files count -->
                            <TableCell>
                                <span class="bg-muted inline-flex items-center rounded-full px-3 py-1 text-sm font-medium">
                                    {{ category.totalFiles }} files
                                </span>
                            </TableCell>

                            <!-- Date -->
                            <TableCell class="text-muted-foreground text-[12px]">
                                {{ formatDateTime(category.created_at) }}
                            </TableCell>

                            <!-- Actions -->
                            <TableCell class="text-center">
                                <div class="flex justify-center gap-2">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        class="h-9 w-9"
                                        @click="editCategoryDialog(category.encrypted_id, category.category)"
                                    >
                                        <Pencil class="h-4 w-4" />
                                    </Button>

                                    <Button size="icon" variant="ghost" class="h-9 w-9 text-destructive" @click="deleteCategoryDialog(category.encrypted_id)">
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

<script lang="ts">
function formatDateTime(dateInput: string | Date): string {
    const date = new Date(dateInput);

    const datePart = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    const timePart = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });

    return `${datePart} | ${timePart}`;
}
</script>
