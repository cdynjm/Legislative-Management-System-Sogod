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
import { LoaderCircle, MapPin, MinusCircle, Pencil, Trash2 } from 'lucide-vue-next';
import { ref } from 'vue';
import { toast } from 'vue-sonner';

const queryClient = useQueryClient();

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Brgy Ordinances',
        href: '/admin/brgy-ordinances',
    },
];

const fetchBrgy = async () => {
    const query = `
    query {
      brgyordinances {
        brgyordinancesList {
          encrypted_id
          brgyname
        }
      }
    }
  `;
    const response = await axios.post(import.meta.env.VITE_APP_GRAPHQL_ENDPOINT, { query });
    return response.data.data;
};

const { isPending, data } = useQuery({
    queryKey: ['fetchBrgy'],
    queryFn: fetchBrgy,
});

const openDialog = ref(false);

function createBrgyDialog() {
    openDialog.value = true;
}

const createForm = useForm({
    brgyname: '',
});

const createBrgy = () => {
    createForm.post(route('create.brgy'), {
        onSuccess: () => {
            toast.success('Barangay created successfully');
            createForm.reset();
            openDialog.value = false;
            queryClient.invalidateQueries({ queryKey: ['fetchBrgy'] });
        },
    });
};

const editDialog = ref(false);

function editBrgyDialog(id: string, brgyname: string) {
    updateForm.id = id;
    updateForm.brgyname = brgyname;
    editDialog.value = true;
}

const updateForm = useForm({
    id: '',
    brgyname: '',
});

const updateBrgy = () => {
    updateForm.patch(route('update.brgy'), {
        onSuccess: () => {
            toast.success('Barangay updated successfully');
            updateForm.reset();
            editDialog.value = false;
            queryClient.invalidateQueries({ queryKey: ['fetchBrgy'] });
        },
    });
};

const deleteDialog = ref(false);

function deleteBrgyDialog(id: string) {
    deleteForm.id = id;
    deleteDialog.value = true;
}

const deleteForm = useForm({
    id: '',
});

const deleteBrgy = () => {
    deleteForm.delete(route('delete.brgy'), {
        onSuccess: () => {
            toast.success('Barangay deleted successfully');
            deleteForm.reset();
            deleteDialog.value = false;
            queryClient.invalidateQueries({ queryKey: ['fetchBrgy'] });
        },
        onError: () => {
            toast.error('Deletion Error');
            console.error('Error');
        },
    });
};
</script>

<template>
    <Head title="Brgy Ordinances" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="space-y-6 p-4">
            <!-- Top Right Add Button -->
            <div class="flex w-full items-center justify-between">
                <h6 class="text-md flex-1 font-bold">Barangay Ordinances</h6>

                <Dialog v-model:open="openDialog">
                    <DialogTrigger as-child>
                        <Button @click="createBrgyDialog" class="cursor-pointer text-[12px]"> + New </Button>
                    </DialogTrigger>
                    <DialogContent class="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Add Barangay</DialogTitle>
                            <DialogDescription> Enter details for a new barangay </DialogDescription>
                        </DialogHeader>

                        <form action="" @submit.prevent="createBrgy">
                            <div class="grid gap-4 py-4">
                                <div class="grid grid-cols-4 items-center gap-4">
                                    <Label class="text-right">Brgy Name</Label>
                                    <Input v-model="createForm.brgyname" placeholder="Barangay Name" class="col-span-3" required />
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
                            <DialogTitle>Edit Barangay</DialogTitle>
                            <DialogDescription> Update details for the barangay </DialogDescription>
                        </DialogHeader>

                        <form action="" @submit.prevent="updateBrgy">
                            <div class="grid gap-4 py-4">
                                <div class="grid grid-cols-4 items-center gap-4">
                                    <Label class="text-right">Brgy Name</Label>
                                    <Input v-model="updateForm.brgyname" placeholder="Barangay Name" class="col-span-3" required />
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
                            <DialogTitle>Delete Barangay</DialogTitle>
                            <DialogDescription> Are you sure you want to delete this barangay? This action cannot be undone. </DialogDescription>
                        </DialogHeader>

                        <form action="" @submit.prevent="deleteBrgy">
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

                            <TableHead> Brgy Name </TableHead>

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
                        <TableRow v-else-if="data?.brgyordinances.brgyordinancesList.length === 0">
                            <TableCell colspan="5" class="py-16">
                                <div class="text-muted-foreground flex flex-col items-center gap-3">
                                    <MinusCircle class="h-10 w-10 text-red-400" />

                                    <p class="text-sm">No barangays found</p>
                                </div>
                            </TableCell>
                        </TableRow>

                        <!-- Data -->
                        <TableRow v-else v-for="(brgy, index) in data?.brgyordinances.brgyordinancesList" :key="brgy.encrypted_id">
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
                                        <MapPin class="h-6 w-6 text-sky-600" />
                                    </div>

                                    <div>
                                        <p class="text-sm font-medium">
                                            {{ brgy.brgyname }}
                                        </p>
                                    </div>
                                </div>
                            </TableCell>

                            <!-- Actions -->
                            <TableCell class="text-center">
                                <div class="flex justify-center gap-2">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        class="hover:bg-sky-100"
                                        @click="editBrgyDialog(brgy.encrypted_id, brgy.brgyname)"
                                    >
                                        <Pencil class="h-4 w-4" />
                                    </Button>

                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        class="text-red-500 hover:bg-red-50"
                                        @click="deleteBrgyDialog(brgy.encrypted_id)"
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
