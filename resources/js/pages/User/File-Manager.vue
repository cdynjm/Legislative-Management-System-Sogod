<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/vue3';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/./components/ui/table/';
import Skeleton from '@/components/Skeleton.vue';
import SlowLink from '@/components/SlowLink.vue';
import { useQuery } from '@tanstack/vue-query';
import axios from 'axios';
import { Folder, MinusCircle } from 'lucide-vue-next';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'File Manager',
        href: '/user/file-manager',
    },
];

const fetchCategories = async () => {
    const query = `
    query {
      usercategories {
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
    queryKey: ['userfetchCategories'],
    queryFn: fetchCategories,
});
</script>

<template>
    <Head title="File Manager" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="space-y-6 p-4">
            <div class="flex w-full items-center justify-between">
                <h6 class="text-md flex-1 font-bold">Committees</h6>
            </div>

            <div class="overflow-hidden rounded-md border bg-white">
                <Table>
                    <TableHeader class="bg-muted/40">
                        <TableRow class="text-[12px] [&>th]:py-4">
                            <TableHead class="text-muted-foreground]"> # </TableHead>

                            <TableHead class="text-muted-foreground"> Committee </TableHead>

                            <TableHead class="text-muted-foreground"> No. of Files </TableHead>

                            <TableHead class="text-muted-foreground"> Created </TableHead>
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
                        <TableRow v-else-if="data?.usercategories.categoriesList.length === 0">
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
                            v-for="(category, index) in data?.usercategories.categoriesList"
                            :key="category.id"
                            class="hover:bg-muted/30 transition"
                        >
                            <!-- Index -->
                            <TableCell class="text-muted-foreground font-medium">
                                {{ Number(index) + 1 }}
                            </TableCell>

                            <!-- Category -->
                            <TableCell class="w-[320px]">
                                <SlowLink :href="route('user.files', { id: category.encrypted_id })" prefetch class="group">
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
