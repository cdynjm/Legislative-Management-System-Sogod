<script setup lang="ts">
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/vue3';
import { ref } from 'vue';

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/./components/ui/select/';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/./components/ui/table/';
import Skeleton from '@/components/Skeleton.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useQuery, useQueryClient } from '@tanstack/vue-query';
import axios from 'axios';
import { LoaderCircle, MinusCircle, Pencil, Trash2 } from 'lucide-vue-next';
import { toast } from 'vue-sonner';

const queryClient = useQueryClient();

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Elected Officials',
        href: '/admin/elected-officials',
    },
];

const fetchOfficials = async () => {
    const query = `
    query {
      officials {
        encrypted_id
        name
        address
        position
        status
        photo
        user {
           email
        }
      }
    }
  `;
    const response = await axios.post(import.meta.env.VITE_APP_GRAPHQL_ENDPOINT, { query });
    return response.data.data;
};

const { isPending, data } = useQuery({
    queryKey: ['fetchOfficials'],
    queryFn: fetchOfficials,
});

const openDialog = ref(false);

function createOfficialDialog() {
    openDialog.value = true;
}

const createForm = useForm({
    name: '',
    address: '',
    position: '',
    status: '',
    email: '',
    password: '',
    picture: null as any,
});

const createOfficial = () => {
    createForm.post(route('create.official'), {
        onSuccess: () => {
            toast.success('Official created successfully');
            createForm.reset();
            openDialog.value = false;
            queryClient.invalidateQueries({ queryKey: ['fetchOfficials'] });
        },
        onError: () => {
            toast.error('Email already exists');
            console.error('Error');
        },
    });
};

const editDialog = ref(false);

function editOfficialDialog(id: string, name: string, address: string, position: string, status: string, email: string) {
    updateForm.id = id;
    updateForm.name = name;
    updateForm.address = address;
    updateForm.position = position;
    updateForm.status = status;
    updateForm.email = email;
    editDialog.value = true;
}

const updateForm = useForm({
    id: '',
    name: '',
    address: '',
    position: '',
    status: '',
    email: '',
    password: '',
    picture: null as any,
});

const updateOfficial = () => {
    updateForm.post(route('update.official'), {
        onSuccess: () => {
            toast.success('Official updated successfully');
            updateForm.reset();
            editDialog.value = false;
            queryClient.invalidateQueries({ queryKey: ['fetchOfficials'] });
        },
        onError: () => {
            toast.error('Email already exists');
            console.error('Error');
        },
    });
};

const deleteDialog = ref(false);

function deleteOfficialDialog(id: string) {
    deleteForm.id = id;
    deleteDialog.value = true;
}

const deleteForm = useForm({
    id: '',
});

const deleteOfficial = () => {
    deleteForm.delete(route('delete.official'), {
        onSuccess: () => {
            toast.success('Official deleted successfully');
            deleteForm.reset();
            deleteDialog.value = false;
            queryClient.invalidateQueries({ queryKey: ['fetchOfficials'] });
        },
        onError: () => {
            toast.error('Deletion Error');
            console.error('Error');
        },
    });
};

const handlePictureChange = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    const maxSizeInMB = 2;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

    if (file.type.startsWith('image')) {
        try {
            if (file.size > maxSizeInBytes) {
                input.value = ''; // Clear input
                toast.error('File too large. Please select a smaller file.');
            }
            const compressedFile = await compressImage(file, {
                quality: 0.3,
                type: file.type,
            });
            createForm.picture = compressedFile;
        } catch (err) {
            console.error('Compression error:', err);
        }
    }
};

const handleUpdatePictureChange = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    const maxSizeInMB = 2;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

    if (file.type.startsWith('image')) {
        try {
            if (file.size > maxSizeInBytes) {
                input.value = ''; // Clear input
                toast.error('File too large. Please select a smaller file.');
            }
            const compressedFile = await compressImage(file, {
                quality: 0.3,
                type: file.type,
            });
            updateForm.picture = compressedFile;
        } catch (err) {
            console.error('Compression error:', err);
        }
    }
};
</script>

<template>
    <Head title="Elected Officials" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="space-y-6 p-4">
            <!-- Top Right Add Button -->
            <div class="flex w-full items-center justify-between">
                <h6 class="text-md flex-1 font-bold">Elected Officials</h6>

                <Dialog v-model:open="openDialog">
                    <DialogTrigger as-child>
                        <Button @click="createOfficialDialog" class="cursor-pointer text-[12px]"> + New </Button>
                    </DialogTrigger>
                    <DialogContent class="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Add Official</DialogTitle>
                            <DialogDescription> Enter details for a new official </DialogDescription>
                        </DialogHeader>

                        <form action="" @submit.prevent="createOfficial">
                            <div class="grid gap-4 py-4">
                                <div class="grid grid-cols-1 items-center gap-2">
                                    <Label class="text-right">Name</Label>
                                    <Input v-model="createForm.name" placeholder="John Doe" class="col-span-3" required />
                                </div>

                                <div class="grid grid-cols-1 items-center gap-2">
                                    <Label class="text-right">Address</Label>
                                    <Input v-model="createForm.address" placeholder="Address" class="col-span-3" required />
                                </div>

                                <div class="grid grid-cols-1 items-center gap-2">
                                    <Label class="text-right">Position</Label>
                                    <Select v-model="createForm.position" class="col-span-3" required>
                                        <SelectTrigger class="w-full">
                                            <SelectValue placeholder="Select a position" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Positions</SelectLabel>
                                                <SelectItem value="Mayor"> Mayor </SelectItem>
                                                <SelectItem value="Vice Mayor"> Vice Mayor </SelectItem>
                                                <SelectItem value="SB Member"> SB Member </SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div class="grid grid-cols-1 items-center gap-2">
                                    <Label class="text-right">Status</Label>
                                    <Select v-model="createForm.status" class="col-span-3" required>
                                        <SelectTrigger class="w-full">
                                            <SelectValue placeholder="Select a status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Status</SelectLabel>
                                                <SelectItem value="1"> Active </SelectItem>
                                                <SelectItem value="2"> Inactive </SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div class="grid grid-cols-1 items-center gap-2">
                                    <Label class="text-right">Picture</Label>
                                    <Input type="file" class="col-span-3" @change="handlePictureChange" accept="image/*" required />
                                </div>

                                <div class="grid grid-cols-1 items-center gap-2">
                                    <Label class="text-right">Email</Label>
                                    <Input v-model="createForm.email" type="email" placeholder="john@example.com" class="col-span-3" required />
                                </div>
                                <div class="grid grid-cols-1 items-center gap-2">
                                    <Label class="text-start">Password</Label>
                                    <Input v-model="createForm.password" placeholder="Password" type="password" class="col-span-3" required />
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
                            <DialogTitle>Edit Official</DialogTitle>
                            <DialogDescription> Update the details of the official </DialogDescription>
                        </DialogHeader>

                        <form action="" @submit.prevent="updateOfficial">
                            <div class="grid gap-4 py-4">
                                <div class="grid grid-cols-1 items-center gap-1">
                                    <Label class="text-right">Name</Label>
                                    <Input v-model="updateForm.name" placeholder="John Doe" class="col-span-3" required />
                                </div>

                                <div class="grid grid-cols-1 items-center gap-1">
                                    <Label class="text-right">Address</Label>
                                    <Input v-model="updateForm.address" placeholder="Address" class="col-span-3" required />
                                </div>

                                <div class="grid grid-cols-1 items-center gap-1">
                                    <Label class="text-right">Position</Label>
                                    <Select v-model="updateForm.position" class="col-span-3" required>
                                        <SelectTrigger class="w-full">
                                            <SelectValue placeholder="Select a position" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Positions</SelectLabel>
                                                <SelectItem value="Mayor"> Mayor </SelectItem>
                                                <SelectItem value="Vice Mayor"> Vice Mayor </SelectItem>
                                                <SelectItem value="SB Member"> SB Member </SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div class="grid grid-cols-1 items-center gap-1">
                                    <Label class="text-right">Status</Label>
                                    <Select v-model="updateForm.status" class="col-span-3" required>
                                        <SelectTrigger class="w-full">
                                            <SelectValue placeholder="Select a status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Status</SelectLabel>
                                                <SelectItem value="1"> Active </SelectItem>
                                                <SelectItem value="2"> Inactive </SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div class="grid grid-cols-1 items-center gap-1">
                                    <Label class="text-left">Change Picture</Label>
                                    <Input type="file" class="col-span-3" @change="handleUpdatePictureChange" accept="image/*" />
                                </div>

                                <div class="grid grid-cols-1 items-center gap-1">
                                    <Label class="text-right">Email</Label>
                                    <Input v-model="updateForm.email" type="email" placeholder="john@example.com" class="col-span-3" required />
                                </div>
                                <div class="grid grid-cols-1 items-center gap-1">
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
                            <DialogTitle>Delete Official</DialogTitle>
                            <DialogDescription> Are you sure you want to delete this official? This action cannot be undone. </DialogDescription>
                        </DialogHeader>

                        <form action="" @submit.prevent="deleteOfficial">
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
                        <TableRow class="[&>th]:py-4 text-[12px]">
                            <TableHead class="text-muted-foreground">
                                #
                            </TableHead>

                            <TableHead class="text-muted-foreground">
                                Official
                            </TableHead>

                            <TableHead class="text-muted-foreground">
                                Position
                            </TableHead>

                            <TableHead class="text-muted-foreground">
                                Address
                            </TableHead>

                            <TableHead class="text-muted-foreground text-center">
                                Status
                            </TableHead>

                            <TableHead class="text-muted-foreground text-center">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody class="[&_tr:nth-child(even)]:bg-muted/20">
                        <!-- Loading -->
                        <TableRow v-if="isPending">
                            <TableCell colspan="10" class="py-10">
                                <Skeleton />
                            </TableCell>
                        </TableRow>

                        <!-- Empty -->
                        <TableRow v-else-if="data?.officials.length === 0">
                            <TableCell colspan="10" class="py-14">
                                <div class="text-muted-foreground flex flex-col items-center gap-2">
                                    <MinusCircle class="h-8 w-8 text-red-500" />

                                    <small class="text-sm"> No officials found </small>
                                </div>
                            </TableCell>
                        </TableRow>

                        <!-- Data -->
                        <TableRow v-else v-for="(official, index) in data?.officials" :key="official.id" class="hover:bg-muted/30 transition">
                            <!-- Number -->
                            <TableCell class="text-muted-foreground font-medium">
                                {{ Number(index) + 1 }}
                            </TableCell>

                            <!-- Profile -->
                            <TableCell class="py-4">
                                <div class="flex items-center gap-4">
                                    <img
                                        draggable="false"
                                        :src="'/storage/profile/' + official.photo"
                                        class="ring-muted h-12 w-12 rounded-full object-cover ring-2"
                                    />

                                    <div class="space-y-1">
                                        <div class="text-sm font-semibold">
                                            {{ official.name }}
                                        </div>

                                        <div class="text-muted-foreground text-xs">
                                            {{ official.user.email }}
                                        </div>
                                    </div>
                                </div>
                            </TableCell>

                            <!-- Position -->
                            <TableCell>
                                <div class="inline-flex rounded-lg bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                                    {{ official.position }}
                                </div>
                            </TableCell>

                            <!-- Address -->
                            <TableCell class="max-w-[260px]">
                                <p class="text-muted-foreground line-clamp-2 text-sm">
                                    {{ official.address }}
                                </p>
                            </TableCell>

                            <!-- Status -->
                            <TableCell class="text-center">
                                <span
                                    v-if="official.status == 1"
                                    class="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700"
                                >
                                    ● Active
                                </span>

                                <span v-else class="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                                    ● Inactive
                                </span>
                            </TableCell>

                            <!-- Actions -->
                            <TableCell class="text-center">
                                <div class="flex justify-center gap-2">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        class="h-9 w-9"
                                        @click="
                                            editOfficialDialog(
                                                official.encrypted_id,
                                                official.name,
                                                official.address,
                                                official.position,
                                                official.status,
                                                official.user.email,
                                            )
                                        "
                                    >
                                        <Pencil class="h-4 w-4" />
                                    </Button>

                                    <Button size="icon" variant="ghost" class="h-9 w-9 text-destructive" @click="deleteOfficialDialog(official.encrypted_id)">
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
type CompressOptions = {
    quality?: number;
    type?: string;
};

const compressImage = async (file: File, { quality = 0.3, type = 'image/jpeg' }: CompressOptions): Promise<File> => {
    const imageBitmap = await createImageBitmap(file);
    const canvas = document.createElement('canvas');
    canvas.width = imageBitmap.width;
    canvas.height = imageBitmap.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    ctx.drawImage(imageBitmap, 0, 0);

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));

    if (!blob) throw new Error('Image compression failed: blob is null');

    return new File([blob], file.name, { type: blob.type });
};
</script>
