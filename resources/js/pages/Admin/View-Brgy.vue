<script setup lang="ts">
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/./components/ui/select/';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/./components/ui/table/';
import Pagination from '@/components/Pagination.vue';
import SkeletonCard from '@/components/SkeletonCard.vue';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/vue3';
import { useQuery, useQueryClient } from '@tanstack/vue-query';
import axios from 'axios';
import { FileText, Folder, LoaderCircle, MinusCircle, Pencil, Search, Trash2 } from 'lucide-vue-next';
import { ref, watchEffect } from 'vue';
import { toast } from 'vue-sonner';

const props = defineProps<{
    id: string;
}>();

const queryClient = useQueryClient();

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'View Barangay',
        href: '/admin/brgy-ordinances/' + props.id,
    },
];

const currentPage = ref(1);
const fileSearchData = ref<any[]>([]);
const searchQuery = ref<string>('');

const paginatorInfo = ref({
    currentPage: 1,
    lastPage: 1,
    hasMorePages: false,
});

const fetchFiles = async () => {
    const query = `
    query ($id: String!, $page: Int!, $first: Int!, $search: String) {
      brgyfiles(id: $id, page: $page, first: $first, search: $search) {
        brgyName {
          encrypted_id
          brgyname
        }
        filesListPaginated {
          data {
            encrypted_id
            barangayID
            title
            dateReceived
            status
            appropriation
            barangay {
              encrypted_id
              brgyname
            }
            file
          }
          paginatorInfo {
            currentPage
            lastPage
            total
            perPage
            hasMorePages
          }
        }
      }
    }
  `;

    const response = await axios.post(import.meta.env.VITE_APP_GRAPHQL_ENDPOINT, {
        query,
        variables: {
            id: props.id,
            page: currentPage.value,
            first: 20,
            search: searchQuery.value,
        },
    });

    return response.data.data;
};

const { data, isFetching } = useQuery({
    queryKey: ['fetchBrgyFiles', currentPage],
    queryFn: fetchFiles,
});

watchEffect(() => {
    if (data.value?.brgyfiles?.filesListPaginated) {
        fileSearchData.value = data.value.brgyfiles.filesListPaginated.data;
        paginatorInfo.value = data.value.brgyfiles.filesListPaginated.paginatorInfo;
    }
});

const isSearching = ref<boolean>(false);

const searchQuerybtn = () => {
    if (isSearching.value) return;
    isSearching.value = true;
    setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['fetchBrgyFiles'] });
        isSearching.value = false;
    }, 2000);
};

const goToNextPage = () => {
    if (currentPage.value < paginatorInfo.value.lastPage) {
        currentPage.value++;
    }
};

const goToPreviousPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
    }
};

const openDialog = ref(false);

function createFileDialog(id: string) {
    createForm.barangayID = id;
    openDialog.value = true;
}

const createForm = useForm({
    barangayID: '' as string,
    title: '' as string,
    dateReceived: '' as string,
    status: '' as string,
    file: null as any,
    appropriation: false as boolean,
});

const createFile = () => {
    createForm.post(route('create.brgy-file'), {
        onSuccess: () => {
            toast.success('File created and uploaded successfully');
            createForm.reset();
            openDialog.value = false;
            queryClient.invalidateQueries({ queryKey: ['fetchBrgyFiles'] });
        },
        onError: () => {
            toast.error('Error creating file');
            console.error('Error');
        },
    });
};

const handleFileChange = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const maxSizeInMB = 2;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

    if (file.size > maxSizeInBytes) {
        input.value = '';
        toast.error('File too large. Please select a smaller file.');
    }
    createForm.file = file;
    console.log('Selected file:', file);
};

const editDialog = ref(false);

function editFileDialog(id: string, barangayID: string, title: string, dateReceived: string, status: string, appropriation: boolean) {
    updateForm.id = id;
    updateForm.barangayID = barangayID;
    updateForm.title = title;
    updateForm.dateReceived = dateReceived;
    updateForm.status = status;
    updateForm.appropriation = appropriation;
    editDialog.value = true;
}

const updateForm = useForm({
    id: '' as string,
    barangayID: '' as string,
    title: '' as string,
    dateReceived: '' as string,
    status: '' as string,
    file: null as any,
    appropriation: false as boolean,
});

const updateFile = () => {
    updateForm.post(route('update.brgy-file', updateForm.id), {
        onSuccess: () => {
            toast.success('File updated successfully');
            updateForm.reset();
            editDialog.value = false;
            queryClient.invalidateQueries({ queryKey: ['fetchBrgyFiles'] });
        },
        onError: () => {
            toast.error('Error updating file');
            console.error('Error');
        },
    });
};

const handleEditFileChange = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const maxSizeInMB = 2;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

    if (file.size > maxSizeInBytes) {
        input.value = '';
        toast.error('File too large. Please select a smaller file.');
    }
    updateForm.file = file;
    console.log('Selected file:', file);
};

const deleteDialog = ref(false);

function deleteFileDialog(id: string) {
    deleteForm.id = id;
    deleteDialog.value = true;
}

const deleteForm = useForm({
    id: '',
});

const deleteFile = () => {
    deleteForm.delete(route('delete.brgy-file'), {
        onSuccess: () => {
            toast.success('File deleted successfully');
            deleteForm.reset();
            deleteDialog.value = false;
            queryClient.invalidateQueries({ queryKey: ['fetchBrgyFiles'] });
        },
        onError: () => {
            toast.error('Deletion Error');
            console.error('Error');
        },
    });
};
</script>

<template>
    <Head title="View Barangay" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="space-y-6 p-4">
            <!-- Top Right Add Button -->
            <div class="flex w-full items-center justify-between">
                <div v-if="isFetching">
                    <SkeletonCard />
                </div>

                <div class="flex w-full items-center justify-between" v-else>
                    <h6 class="flex items-center text-sm font-bold">
                        <Folder class="mr-2 h-8 w-8 flex-shrink-0 rounded-full border p-1 text-blue-500" fill="currentColor" />
                        {{ data?.brgyfiles.brgyName.brgyname }}
                    </h6>

                    <div class="flex items-center gap-4">
                        <Button @click="createFileDialog(data?.brgyfiles.brgyName.encrypted_id)" variant="secondary" class="text-[12px]">
                            + New File
                        </Button>
                    </div>
                </div>

                <Dialog v-model:open="openDialog">
                    <DialogContent class="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Add File</DialogTitle>
                            <DialogDescription>
                                Upload a new file for <b>{{ data?.brgyfiles.brgyName.brgyname }}</b>
                            </DialogDescription>
                        </DialogHeader>

                        <form @submit.prevent="createFile">
                            <div class="mb-4 grid gap-2">
                                <div class="grid grid-cols-1 items-center gap-2">
                                    <Label class="text-sm font-medium text-gray-700">Title</Label>
                                    <Input v-model="createForm.title" placeholder="File Title" class="col-span-3" required />
                                </div>
                                <div class="grid grid-cols-1 items-center gap-2">
                                    <Label class="text-sm font-medium text-gray-700">Date Received</Label>
                                    <Input v-model="createForm.dateReceived" type="date" class="col-span-3" required />
                                </div>
                                <div class="mb-4 grid grid-cols-1 items-center gap-2">
                                    <Label class="text-sm font-medium text-gray-700">Status</Label>
                                    <Select v-model="createForm.status" required>
                                        <SelectTrigger class="w-full">
                                            <SelectValue placeholder="Select Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="0">Draft</SelectItem>
                                            <SelectItem value="1">Returned</SelectItem>
                                            <SelectItem value="2">Approved</SelectItem>
                                            <SelectItem value="3">Referred to Committee</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div class="bg-muted/20 mb-4 rounded-lg border p-4">
                                    <div class="flex items-center justify-between">
                                        <div>
                                            <Label class="text-sm font-medium"> Need Appropriation? </Label>

                                            <p class="text-muted-foreground text-xs">For ordinance that requires funds.</p>
                                        </div>
                                        <input
                                            class="relative h-5 w-10 cursor-pointer appearance-none rounded-full bg-gray-300 transition before:absolute before:top-0.5 before:left-0.5 before:h-4 before:w-4 before:rounded-full before:bg-white before:transition before:content-[''] checked:bg-green-500 checked:before:translate-x-5"
                                            type="checkbox"
                                            v-model="createForm.appropriation"
                                            :checked="createForm.appropriation"
                                        />
                                    </div>
                                </div>

                                <div class="grid grid-cols-1 items-center gap-2">
                                    <Label class="text-sm font-medium text-gray-700">Upload File</Label>
                                    <Input type="file" @change="handleFileChange" class="col-span-3" accept=".pdf" required />
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
                            <DialogTitle>Edit File</DialogTitle>
                            <DialogDescription>
                                Edit or upload a new file for <b>{{ data?.brgyfiles.brgyName.brgyname }}</b>
                            </DialogDescription>
                        </DialogHeader>

                        <form @submit.prevent="updateFile">
                            <div class="mb-4 grid gap-2">
                                <div class="grid grid-cols-1 items-center gap-2">
                                    <Label class="text-sm font-medium text-gray-700">Title</Label>
                                    <Input v-model="updateForm.title" placeholder="File Title" class="col-span-3" required />
                                </div>
                                <div class="grid grid-cols-1 items-center gap-2">
                                    <Label class="text-sm font-medium text-gray-700">Date Received</Label>
                                    <Input v-model="updateForm.dateReceived" type="date" class="col-span-3" required />
                                </div>
                                <div class="mb-4 grid grid-cols-1 items-center gap-2">
                                    <Label class="text-sm font-medium text-gray-700">Status</Label>
                                    <Select v-model="updateForm.status" required>
                                        <SelectTrigger class="w-full">
                                            <SelectValue placeholder="Select Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="0">Draft</SelectItem>
                                            <SelectItem value="1">Returned</SelectItem>
                                            <SelectItem value="2">Approved</SelectItem>
                                            <SelectItem value="3">Referred to Committee</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div class="bg-muted/20 mb-4 rounded-lg border p-4">
                                    <div class="flex items-center justify-between">
                                        <div>
                                            <Label class="text-sm font-medium"> Need Appropriation? </Label>

                                            <p class="text-muted-foreground text-xs">For ordinance that requires funds.</p>
                                        </div>

                                        <input
                                            class="relative h-5 w-10 cursor-pointer appearance-none rounded-full bg-gray-300 transition before:absolute before:top-0.5 before:left-0.5 before:h-4 before:w-4 before:rounded-full before:bg-white before:transition before:content-[''] checked:bg-green-500 checked:before:translate-x-5"
                                            type="checkbox"
                                            v-model="updateForm.appropriation"
                                            :checked="updateForm.appropriation"
                                        />
                                    </div>
                                </div>

                                <div class="grid grid-cols-1 items-center gap-2">
                                    <Label class="text-sm font-medium text-gray-700">Update File</Label>
                                    <Input type="file" @change="handleEditFileChange" class="col-span-3" accept=".pdf" />
                                </div>
                            </div>

                            <DialogFooter>
                                <Button type="submit" class="cursor-pointer" :disabled="updateForm.processing">
                                    <LoaderCircle v-if="updateForm.processing" class="h-4 w-4 animate-spin" />
                                    Save
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                <Dialog v-model:open="deleteDialog">
                    <DialogContent class="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Delete File</DialogTitle>
                            <DialogDescription> Are you sure you want to delete this file? This action cannot be undone. </DialogDescription>
                        </DialogHeader>

                        <form action="" @submit.prevent="deleteFile">
                            <DialogFooter>
                                <Button type="submit" class="cursor-pointer" variant="destructive" :disabled="deleteForm.processing">
                                    <LoaderCircle v-if="deleteForm.processing" class="h-4 w-4 animate-spin" />
                                    Delete
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div class="flex w-full items-center gap-2 sm:w-auto">
                <Input v-model="searchQuery" placeholder="Search..." class="w-full text-sm sm:w-72" />
                <Button @click="searchQuerybtn" :disabled="isSearching" class="flex items-center gap-1 text-sm">
                    <LoaderCircle v-if="isSearching" class="h-4 w-4 animate-spin" />
                    <Search v-else />
                </Button>
            </div>

            <div class="overflow-hidden rounded-md border bg-white">
                <Table>
                    <TableHeader class="bg-muted/40">
                        <TableRow class="text-[12px] [&>th]:py-4">
                            <TableHead class="text-muted-foreground]"> # </TableHead>

                            <TableHead class="text-muted-foreground"> Title </TableHead>

                            <TableHead class="text-muted-foreground"> Status </TableHead>

                            <TableHead class="text-muted-foreground"> Date Received </TableHead>

                            <TableHead class="text-muted-foreground"> Appropriation </TableHead>

                            <TableHead class="text-muted-foreground text-center"> Actions </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody class="[&_tr:nth-child(even)]:bg-muted/20">
                        <TableRow v-if="isFetching">
                            <TableCell :colspan="7">
                                <SkeletonCard />
                            </TableCell>
                        </TableRow>

                        <TableRow v-else-if="fileSearchData.length === 0">
                            <TableCell colspan="10" class="text-muted-foreground py-14 text-center">
                                <MinusCircle class="mx-auto mb-2 h-6 w-6 text-red-500" />
                                No Data Found
                            </TableCell>
                        </TableRow>

                        <template v-else>
                            <TableRow v-for="(files, index) in fileSearchData" :key="index">
                                <!-- Index -->
                                <TableCell class="text-muted-foreground font-medium">
                                    {{ Number(index) + 1 }}
                                </TableCell>

                                <!-- Category -->
                                <TableCell class="w-[320px]">
                                    <a :href="'/storage/brgy-files/' + files.file" target="_blank">
                                        <div class="group-hover:bg-muted/40 flex items-center gap-3 rounded-lg p-2 transition">
                                            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50">
                                                <FileText class="h-6 w-6 text-red-500" />
                                            </div>

                                            <div class="space-y-1">
                                                <div class="text-sm font-semibold transition group-hover:text-red-600">
                                                    <p class="text-wrap">{{ files.title }}</p>
                                                </div>

                                                <div class="text-muted-foreground text-xs">Click to view file</div>
                                            </div>
                                        </div></a
                                    >
                                </TableCell>

                                <!-- Files count -->
                                <TableCell>
                                    <Badge
                                        :class="[
                                            'rounded-md p-1 text-[12px]',

                                            files.status == 0 && 'bg-gray-100 text-gray-600',
                                            files.status == 1 && 'bg-red-100 text-red-600',
                                            files.status == 2 && 'bg-green-100 text-green-600',
                                            files.status == 3 && 'bg-yellow-100 text-yellow-700',
                                        ]"
                                    >
                                        {{
                                            files.status == 0
                                                ? 'Draft'
                                                : files.status == 1
                                                  ? 'Returned'
                                                  : files.status == 2
                                                    ? 'Approved'
                                                    : files.status == 3
                                                      ? 'Referred to Committee'
                                                      : '-'
                                        }}
                                    </Badge>
                                </TableCell>

                                <TableCell class="text-muted-foreground text-[12px]">
                                    {{ formatDateTime(files.dateReceived) }}
                                </TableCell>

                                <TableCell class="text-muted-foreground text-[12px]">
                                    <div v-if="files.appropriation === '1'" class="space-y-1">
                                        <p class="font-medium text-green-600">Needs Appropriation</p>

                                        <p class="text-muted-foreground text-[13px] leading-snug">
                                            SB Members must take action within <b>60 days</b>
                                        </p>
                                    </div>

                                    <div v-else class="text-gray-400">
                                        <p class="text-muted-foreground text-[13px] leading-snug">
                                            SB Members must take action within <b>30 days</b>
                                        </p>
                                    </div>
                                </TableCell>

                                <TableCell class="text-center">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        class="h-8 w-8"
                                        @click="
                                            editFileDialog(
                                                files.encrypted_id,
                                                data?.brgyfiles.brgyName.encrypted_id,
                                                files.title,
                                                files.dateReceived,
                                                files.status,
                                                files.appropriation === '1' ? true : false,
                                            )
                                        "
                                    >
                                        <Pencil class="h-4 w-4" />
                                    </Button>

                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        class="text-destructive h-8 w-8"
                                        @click="deleteFileDialog(files.encrypted_id)"
                                    >
                                        <Trash2 class="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        </template>
                    </TableBody>
                </Table>
            </div>

            <Pagination
                :current-page="paginatorInfo.currentPage"
                :last-page="paginatorInfo.lastPage"
                @next="goToNextPage"
                @previous="goToPreviousPage"
            />
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

    return `${datePart}`;
}
</script>
