<script setup lang="ts">
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/vue3';

import SkeletonBox from '@/components/SkeletonBox.vue';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/vue-query';
import axios from 'axios';
import { FileBoxIcon, UserCircle2, Users2Icon } from 'lucide-vue-next';

const props = defineProps<{
    id: string;
}>();

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'View File',
        href: '/user/view-file/' + props.id,
    },
];

const fetchViewedFile = async () => {
    const query = `
    query ($id: String!) {
        userviewFile(id: $id) {
            file {
                municipalStatus
                provincialStatus
                title
                firstReadingDate
                publicHearingDate
                secondReadingDate
                thirdReadingDate
                ordinanceNumber
                finalOrdinanceNumber
                finalTitle
                enactmentDate
                lceapprovalDate
                transmittalDate
                spslapprovalDate
                postStatus
                publishStatus
                implementationDate
                file
                author {
                    name
                }
                coAuthors {
                    official {
                        name
                        position
                    }
                }
                category {
                    category
                }
            }
        }
    }
  `;

    const response = await axios.post(import.meta.env.VITE_APP_GRAPHQL_ENDPOINT, {
        query,
        variables: {
            id: props.id,
        },
    });

    return response.data.data;
};

const { data, isFetching } = useQuery({
    queryKey: ['userfetchViewedFile'],
    queryFn: fetchViewedFile,
});
</script>

<template>
    <Head title="View File" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="space-y-6 p-4">
            <Card class="w-full shadow-none outline-none" v-if="isFetching">
                <CardHeader>
                    <SkeletonBox />
                </CardHeader>
            </Card>

            <Card class="bg-background w-full border shadow-none" v-else>
                <CardHeader class="bg-muted/20 space-y-4 border-b">
                    <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <!-- MAIN INFO -->
                        <div class="space-y-4">
                            <!-- Ordinance numbers -->
                            <div class="flex flex-wrap gap-3">
                                <div class="bg-muted/40 rounded-lg border px-4 py-2">
                                    <div class="text-muted-foreground text-[11px] tracking-wide uppercase">Ordinance No.</div>

                                    <div class="text-sm font-semibold">
                                        {{ data?.userviewFile.file.ordinanceNumber ?? '-' }}
                                    </div>
                                </div>

                                <div class="rounded-lg border border-blue-100 bg-blue-50 px-4 py-2">
                                    <div class="text-[11px] tracking-wide text-blue-500 uppercase">Final Ordinance No.</div>

                                    <div class="text-sm font-semibold text-blue-700">
                                        {{ data?.userviewFile.file.finalOrdinanceNumber ?? '-' }}
                                    </div>
                                </div>
                            </div>

                            <!-- Category -->
                            <div class="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                                {{ data?.userviewFile.file.category.category }}
                            </div>

                            <!-- Title -->
                            <div>
                                <p class="ms-2 text-[14px] leading-snug">
                                    {{ data?.userviewFile.file.title ?? 'Untitled File' }}
                                </p>
                            </div>
                        </div>

                        <!-- STATUS BADGES -->
                        <div class="flex flex-col gap-2 md:items-end">
                            <div
                                class="rounded-full px-3 py-1 text-xs font-medium"
                                :class="data?.userviewFile.file.municipalStatus == 1 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'"
                            >
                                Municipal: {{ data?.userviewFile.file.municipalStatus == 1 ? 'Draft' : 'Approved' }}
                            </div>

                            <div
                                class="rounded-full px-3 py-1 text-xs font-medium"
                                :class="data?.userviewFile.file.provincialStatus == 2 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'"
                            >
                                Provincial:
                                {{
                                    data?.userviewFile.file.provincialStatus == 2
                                        ? 'Approved'
                                        : data?.userviewFile.file.provincialStatus == 1
                                          ? 'Disapproved'
                                          : 'No Status'
                                }}
                            </div>
                        </div>
                    </div>
                </CardHeader>

                <CardContent class="space-y-6 p-6">
                    <!-- AUTHOR SECTION -->
                    <div class="bg-muted/20 space-y-3 rounded-lg border p-4">
                        <div class="flex items-center gap-2 text-sm font-medium">
                            <UserCircle2 class="h-5 w-5 text-blue-500" />
                            Author Information
                        </div>

                        <div class="text-muted-foreground text-sm">
                            <span class="text-foreground font-medium">
                                {{ data?.userviewFile.file.author.name }}
                            </span>
                        </div>
                    </div>

                    <!-- CO AUTHORS -->
                    <div class="space-y-3 rounded-lg border p-4">
                        <div class="flex items-center gap-2 text-sm font-medium">
                            <Users2Icon class="h-5 w-5 text-blue-500" />
                            Co-Authors
                        </div>

                        <div class="space-y-2">
                            <div v-if="!data?.userviewFile.file.coAuthors?.length" class="text-muted-foreground text-sm italic">No co-authors</div>

                            <div
                                v-for="(coauthor, index) in data?.userviewFile.file.coAuthors"
                                :key="index"
                                class="bg-muted/30 flex items-center justify-between rounded-md px-3 py-2 text-sm"
                            >
                                <div class="flex items-center gap-2">
                                    <div class="h-2 w-2 rounded-full bg-sky-500" />
                                    <span class="font-medium">{{ coauthor.official.name }}</span>
                                </div>
                                <span class="text-muted-foreground text-xs">
                                    {{ coauthor.official.position }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- FINAL TITLE -->
                    <div class="space-y-2 rounded-lg border p-4">
                        <div class="flex items-center gap-2 text-sm font-medium">
                            <FileBoxIcon class="h-4 w-4 text-green-500" />
                            Final Title
                        </div>

                        <p class="text-muted-foreground text-sm leading-relaxed">
                            {{ data?.userviewFile.file.finalTitle ?? '-' }}
                        </p>
                    </div>

                    <!-- DATES -->
                    <div class="space-y-3 rounded-lg border p-4">
                        <div class="text-sm font-medium">Timeline</div>

                        <div class="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
                            <div
                                v-for="(label, key) in {
                                    '1st Reading': 'firstReadingDate',
                                    'Public Hearing': 'publicHearingDate',
                                    '2nd Reading': 'secondReadingDate',
                                    '3rd Reading': 'thirdReadingDate',
                                    Enactment: 'enactmentDate',
                                    'LCE Approval': 'lceapprovalDate',
                                    Transmittal: 'transmittalDate',
                                    'SPSL Approval': 'spslapprovalDate',
                                }"
                                :key="key"
                                class="bg-muted/20 flex justify-between rounded-md px-3 py-2"
                            >
                                <span class="text-muted-foreground">{{ key }}</span>
                                <span class="font-medium">
                                    {{ data?.userviewFile.file[label] ? formatDate(data?.userviewFile.file[label]) : '-' }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- FLAGS -->
                    <div class="flex flex-wrap gap-3 text-sm">
                        <div class="bg-muted rounded-md px-3 py-1">
                            Post:
                            <span class="font-medium">
                                {{ data?.userviewFile.file.postStatus == 1 ? 'Posted' : 'Not Posted' }}
                            </span>
                        </div>

                        <div class="bg-muted rounded-md px-3 py-1">
                            Publish:
                            <span class="font-medium">
                                {{ data?.userviewFile.file.publishStatus == 1 ? 'Published' : 'Not Published' }}
                            </span>
                        </div>
                        <div class="bg-muted rounded-md px-3 py-1">
                            Implementation:
                            <span class="font-medium">
                                {{ data?.userviewFile.file.implementationDate ? formatDate(data?.userviewFile.file.implementationDate) : '-' }}
                            </span>
                        </div>
                    </div>
                </CardContent>

                <CardFooter class="bg-muted/10 flex justify-end border-t p-4">
                    <Button size="sm" class="text-xs">
                        <a :href="`/storage/files/${data?.userviewFile.file.file}`" target="_blank"> Open File </a>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    </AppLayout>
</template>

<script lang="ts">
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
