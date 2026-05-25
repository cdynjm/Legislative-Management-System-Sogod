<script setup lang="ts">
import { ref, watchEffect } from 'vue';

import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/vue3';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/./components/ui/table/';
import Pagination from '@/components/Pagination.vue';
import Skeleton from '@/components/Skeleton.vue';
import SkeletonCard from '@/components/SkeletonCard.vue';
import SlowLink from '@/components/SlowLink.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useQuery, useQueryClient } from '@tanstack/vue-query';
import axios from 'axios';
import { EyeIcon, Folder, LoaderCircle, MinusCircle, Search } from 'lucide-vue-next';

const props = defineProps<{
    id: string;
}>();

const queryClient = useQueryClient();

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Files',
        href: '/admin/files/' + props.id,
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
      userfiles(id: $id, page: $page, first: $first, search: $search) {
        categoryName {
          encrypted_id
          category
        }
        authors {
          encrypted_id
          name
        }
        filesListPaginated {
          data {
            encrypted_id
            municipalStatus
            provincialStatus
            title
            firstReadingDate
            secondReadingDate
            thirdReadingDate
            ordinanceNumber
            finalTitle
            enactmentDate
            lceapprovalDate
            transmittalDate
            spslapprovalDate
            postStatus
            publishStatus
            file
            updated_at
            author {
              encrypted_id
              name
              position
              photo
            }
            coAuthors {
              official {
                encrypted_id
                name
                position
              }
            }
          }
          paginatorInfo {
            currentPage
            lastPage
            total
            perPage
            hasMorePages
          }
        }
        subCategoriesList {
          encrypted_id
          category
          parentID
          created_at
          totalFiles
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
    queryKey: ['userfetchFiles', currentPage],
    queryFn: fetchFiles,
});

watchEffect(() => {
    if (data.value?.userfiles?.filesListPaginated) {
        fileSearchData.value = data.value.userfiles.filesListPaginated.data;
        paginatorInfo.value = data.value.userfiles.filesListPaginated.paginatorInfo;
    }
});

const isSearching = ref<boolean>(false);

const searchQuerybtn = () => {
    if (isSearching.value) return;
    isSearching.value = true;
    setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['userfetchFiles'] });
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
</script>

<template>
    <Head title="Files" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="space-y-6 p-4">
            <div class="flex w-full items-center justify-between">
                <div v-if="isFetching">
                    <SkeletonCard />
                </div>

                <div v-else>
                    <h6 class="text-md flex items-center font-bold">
                        <Folder class="mr-2 h-8 w-8 flex-shrink-0 rounded-full border p-1 text-blue-500" fill="currentColor" />
                        {{ data?.userfiles.categoryName.category }}
                    </h6>
                </div>
            </div>

            <div class="flex w-full items-center gap-2 sm:w-auto">
                <Input v-model="searchQuery" placeholder="Search..." class="w-full text-sm sm:w-72" />
                <Button @click="searchQuerybtn" :disabled="isSearching" class="flex items-center gap-1 text-sm">
                    <LoaderCircle v-if="isSearching" class="h-4 w-4 animate-spin" />
                    <Search v-else />
                </Button>
            </div>

            <div class="space-y-6">
                <!-- Sub Categories Table -->
                <div class="overflow-hidden rounded-md border bg-white">
                    <Table>
                        <TableHeader class="bg-muted/40">
                            <TableRow class="[&>th]:py-4">
                                <TableHead class="text-muted-foreground"><small>#</small></TableHead>
                                <TableHead class="text-muted-foreground"><small>Category</small></TableHead>
                                <TableHead class="text-muted-foreground"><small>No. of Files</small></TableHead>
                                <TableHead class="text-muted-foreground"><small>Created</small></TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody class="[&_tr:nth-child(even)]:bg-muted/20">
                            <TableRow v-if="isFetching">
                                <TableCell colspan="10" class="py-10 text-center">
                                    <Skeleton />
                                </TableCell>
                            </TableRow>

                            <TableRow v-else-if="data?.userfiles.subCategoriesList.length === 0">
                                <TableCell colspan="5" class="text-muted-foreground py-14 text-center">
                                    <MinusCircle class="mx-auto mb-2 h-6 w-6 text-red-500" />
                                    No categories found
                                </TableCell>
                            </TableRow>

                            <TableRow
                                v-else
                                v-for="(category, index) in data?.userfiles.subCategoriesList"
                                :key="category.id"
                                class="hover:bg-muted/30 transition"
                            >
                                <TableCell class="text-muted-foreground">{{ Number(index) + 1 }}</TableCell>

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

                                <TableCell>
                                    <span class="bg-muted inline-flex rounded-full px-3 py-1 text-sm">
                                        {{ category.totalFiles }}
                                    </span>
                                </TableCell>

                                <TableCell class="text-muted-foreground text-[12px]">
                                    {{ formatDateTime(category.created_at) }}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                <!-- Files Table -->
                <div class="overflow-hidden rounded-md border bg-white">
                    <Table>
                        <TableHeader class="bg-muted/40">
                            <TableRow class="[&>th]:py-4">
                                <TableHead class="text-muted-foreground text-center"><small>#</small></TableHead>
                                <TableHead class="text-muted-foreground"><small>File Info</small></TableHead>
                                <TableHead class="text-muted-foreground"><small>Co-Authors</small></TableHead>
                                <TableHead class="text-muted-foreground"><small>Status</small></TableHead>
                                <TableHead class="text-muted-foreground"><small>Updated</small></TableHead>
                                <TableHead class="text-muted-foreground text-center"><small>Actions</small></TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody class="[&_tr:nth-child(even)]:bg-muted/20">
                            <TableRow v-if="isFetching">
                                <TableCell :colspan="7">
                                    <SkeletonCard />
                                </TableCell>
                            </TableRow>

                            <TableRow v-else-if="fileSearchData.length === 0">
                                <TableCell :colspan="7" class="py-20 text-center"> No data found </TableCell>
                            </TableRow>

                            <template v-else>
                                <TableRow v-for="(files, index) in fileSearchData" :key="index">
                                    <!-- Index -->
                                    <TableCell class="text-muted-foreground text-center font-medium">
                                        {{ Number(index) + 1 }}
                                    </TableCell>

                                    <!-- Author + Title -->
                                    <TableCell class="max-w-[300px]">
                                        <div class="space-y-4">
                                            <div class="flex items-center gap-3">
                                                <img
                                                    draggable="false"
                                                    :src="'/storage/profile/' + files.author.photo"
                                                    class="h-10 w-10 rounded-full object-cover ring-2 ring-sky-100"
                                                />

                                                <div>
                                                    <p class="text-[13px] font-medium">
                                                        {{ files.author.name }}
                                                    </p>

                                                    <p class="text-muted-foreground text-xs">
                                                        {{ files.author.position }}
                                                    </p>
                                                </div>
                                            </div>

                                            <Badge variant="secondary" class="w-fit text-[12px]">
                                                <span class="font-bold">{{ files.ordinanceNumber ?? '-' }}</span>
                                            </Badge>

                                            <p class="mt-2 line-clamp-3 text-[13px] leading-relaxed text-wrap text-slate-700">
                                                {{ files.finalTitle ?? files.title }}
                                            </p>
                                        </div>
                                    </TableCell>

                                    <!-- Co Authors -->
                                    <TableCell class="w-[220px]">
                                        <div class="bg-muted/20 max-h-32 overflow-y-auto rounded-lg p-3">
                                            <template v-if="files.coAuthors.length">
                                                <div v-for="(coauthor, i) in files.coAuthors" :key="i" class="mb-3 flex gap-3 last:mb-0">
                                                    <div class="mt-1 h-2 w-2 rounded-full bg-sky-500" />

                                                    <div>
                                                        <p class="text-xs font-medium">
                                                            {{ coauthor.official.name }}
                                                        </p>

                                                        <p class="text-muted-foreground text-[11px]">
                                                            {{ coauthor.official.position }}
                                                        </p>
                                                    </div>
                                                </div>
                                            </template>

                                            <div v-else class="text-muted-foreground flex h-16 items-center justify-start text-xs">No co-authors</div>
                                        </div>
                                    </TableCell>

                                    <!-- Status -->
                                    <TableCell>
                                        <div class="space-y-3">
                                            <div class="flex flex-col gap-2">
                                                <Badge
                                                    :class="
                                                        files.municipalStatus == 1
                                                            ? 'rounded-md bg-red-100 p-1 text-[12px] text-red-600'
                                                            : 'rounded-md bg-green-100 p-1 text-[12px] text-green-600'
                                                    "
                                                >
                                                    {{ files.municipalStatus == 1 ? 'Draft' : 'Approved' }}
                                                </Badge>

                                                <Badge
                                                    :class="
                                                        files.provincialStatus == 1
                                                            ? 'rounded-md bg-red-100 p-1 text-[12px] text-red-600'
                                                            : files.provincialStatus == 2
                                                              ? 'rounded-md bg-green-100 p-1 text-[12px] text-green-600'
                                                              : 'rounded-md bg-gray-100 p-1 text-[12px] text-gray-600'
                                                    "
                                                >
                                                    {{
                                                        files.provincialStatus == 1
                                                            ? 'Disapproved'
                                                            : files.provincialStatus == 2
                                                              ? 'Approved'
                                                              : 'Pending'
                                                    }}
                                                </Badge>
                                            </div>

                                            <div class="text-muted-foreground text-[12px]">
                                                <div>
                                                    3rd Reading:
                                                    {{ files.thirdReadingDate ? formatDate(files.thirdReadingDate) : 'No date' }}
                                                </div>

                                                <div>
                                                    2nd Reading:
                                                    {{ files.secondReadingDate ? formatDate(files.secondReadingDate) : 'No date' }}
                                                </div>

                                                <div>
                                                    1st Reading:
                                                    {{ files.firstReadingDate ? formatDate(files.firstReadingDate) : 'No date' }}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>

                                    <!-- Updated -->
                                    <TableCell>
                                        <div class="text-muted-foreground text-xs">
                                            {{ formatDateTime(files.updated_at) }}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div class="flex justify-center gap-2">
                                            <SlowLink :href="route('user.view-file', { id: files.encrypted_id })" prefetch>
                                                <Button size="icon" variant="ghost" class="h-8 w-8">
                                                    <EyeIcon class="h-4 w-4" />
                                                </Button>
                                            </SlowLink>

                                            <a :href="'/storage/files/' + files.file" target="_blank">
                                                <Button size="icon" variant="ghost" class="h-8 w-8 font-bold"> PDF </Button>
                                            </a>
                                        </div>
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

function formatDate(dateInput: string | Date): string {
    const date = new Date(dateInput);

    const datePart = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    return `${datePart}`;
}
</script>
