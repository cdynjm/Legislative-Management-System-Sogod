<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/vue3';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/./components/ui/table/';
import Skeleton from '@/components/Skeleton.vue';
import { useQuery } from '@tanstack/vue-query';
import axios from 'axios';
import { MinusCircle } from 'lucide-vue-next';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Elected Officials',
        href: '/user/elected-officials',
    },
];

const fetchOfficials = async () => {
    const query = `
    query {
      userofficials {
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
    queryKey: ['userfetchOfficials'],
    queryFn: fetchOfficials,
});
</script>

<template>
    <Head title="Elected Officials" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="space-y-6 p-4">
            <div class="flex w-full items-center justify-between">
                <h6 class="text-md flex-1 font-bold">Elected Officials</h6>
            </div>

            <div class="overflow-hidden rounded-md border bg-white">
                <Table>
                    <TableHeader class="bg-muted/40">
                        <TableRow class="text-[12px] [&>th]:py-4">
                            <TableHead class="text-muted-foreground"> # </TableHead>

                            <TableHead class="text-muted-foreground"> Official </TableHead>

                            <TableHead class="text-muted-foreground"> Position </TableHead>

                            <TableHead class="text-muted-foreground"> Address </TableHead>

                            <TableHead class="text-muted-foreground text-center"> Status </TableHead>
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
                        <TableRow v-else-if="data?.userofficials.length === 0">
                            <TableCell colspan="10" class="py-14">
                                <div class="text-muted-foreground flex flex-col items-center gap-2">
                                    <MinusCircle class="h-8 w-8 text-red-500" />

                                    <small class="text-sm"> No officials found </small>
                                </div>
                            </TableCell>
                        </TableRow>

                        <!-- Data -->
                        <TableRow v-else v-for="(official, index) in data?.userofficials" :key="official.id" class="hover:bg-muted/30 transition">
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
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    </AppLayout>
</template>