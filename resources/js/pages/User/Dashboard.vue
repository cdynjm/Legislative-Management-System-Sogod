<script setup lang="ts">
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/./components/ui/table/';
import SkeletonCard from '@/components/SkeletonCard.vue';
import SlowLink from '@/components/SlowLink.vue';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/vue3';
import { useQuery } from '@tanstack/vue-query';
import axios from 'axios';
import { Calendar1Icon, EyeIcon, File, Folder, UserCheck } from 'lucide-vue-next';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/user/dashboard',
    },
];

const fetchDashboard = async () => {
    const query = `
        query {
            userdashboard {
                officialsCount
                categoriesCount
                filesCount
                files {
                    municipalStatus
                    provincialStatus
                    title
                    ordinanceNumber
                    finalOrdinanceNumber
                    finalTitle
                    file
                    firstReadingDate
                    publicHearingDate
                    secondReadingDate
                    thirdReadingDate
                    enactmentDate
                    lceapprovalDate
                    transmittalDate
                    spslapprovalDate
                    implementationDate
                    updated_at
                    author {
                        name
                        photo
                        position
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

    const response = await axios.post(import.meta.env.VITE_APP_GRAPHQL_ENDPOINT, { query });
    return response.data.data;
};

const { isPending, data } = useQuery({
    queryKey: ['userfetchDashboard'],
    queryFn: fetchDashboard,
});
</script>

<template>
    <Head title="Dashboard" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
            <SlowLink :href="route('user.file-manager')" prefetch>
                <Card class="pt-0 shadow-none">
                    <CardHeader class="flex items-center justify-between bg-blue-50 py-2">
                        <CardTitle class="text-[13px]">Committees</CardTitle>
                        <Folder class="text-muted-foreground h-5 w-5" />
                    </CardHeader>
                    <CardContent v-if="isPending">
                        <SkeletonCard />
                    </CardContent>
                    <CardContent v-else>
                        <p class="text-2xl font-bold">{{ data?.userdashboard.categoriesCount }}</p>
                    </CardContent>
                </Card>
            </SlowLink>

            <SlowLink :href="route('user.file-manager')" prefetch>
                <Card class="pt-0 shadow-none">
                    <CardHeader class="flex items-center justify-between bg-red-50 py-2">
                        <CardTitle class="text-[13px]">Files</CardTitle>
                        <File class="text-muted-foreground h-5 w-5" />
                    </CardHeader>
                    <CardContent v-if="isPending">
                        <SkeletonCard />
                    </CardContent>
                    <CardContent v-else>
                        <p class="text-2xl font-bold">{{ data?.userdashboard.filesCount }}</p>
                    </CardContent>
                </Card>
            </SlowLink>

            <SlowLink :href="route('user.elected-officials')" prefetch>
                <Card class="pt-0 shadow-none">
                    <CardHeader class="flex items-center justify-between bg-orange-50 py-2">
                        <CardTitle class="text-[13px]">Officials</CardTitle>
                        <UserCheck class="text-muted-foreground h-5 w-5" />
                    </CardHeader>
                    <CardContent v-if="isPending">
                        <SkeletonCard />
                    </CardContent>
                    <CardContent v-else>
                        <p class="text-2xl font-bold">{{ data?.userdashboard.officialsCount }}</p>
                    </CardContent>
                </Card>
            </SlowLink>
        </div>

        <div class="grid grid-cols-1 gap-4 p-4 py-0">
            <Card class="py-2 shadow-none">
                <div class="mx-5">
                    <CardDescription class="items-center justify-center gap-2 text-center font-bold md:flex md:justify-between">
                        <div class="flex items-center justify-center gap-2 md:mb-0">
                            <Folder class="mb-[2px] h-auto w-5" />
                            Recent Ordinances
                        </div>
                        <div class="hidden md:flex">Municipality of Sogod</div>
                    </CardDescription>
                </div>
            </Card>
        </div>

        <div class="bg-background m-4 overflow-hidden rounded-md border">
            <Table>
                <TableHeader class="sticky top-0 z-10 bg-slate-50">
                    <TableRow class="text-[12px] [&>th]:py-4">
                        <TableHead class="text-center"> # </TableHead>

                        <TableHead class=""> Ordinance </TableHead>

                        <TableHead> Committee </TableHead>

                        <TableHead> Co-Authors </TableHead>

                        <TableHead> Status </TableHead>

                        <TableHead> Updated </TableHead>

                        <TableHead class="text-center"> File </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody class="[&>tr:nth-child(even)]:bg-muted/20 [&>tr:hover]:bg-sky-50/40">
                    <TableRow v-if="isPending">
                        <TableCell :colspan="7">
                            <SkeletonCard />
                        </TableCell>
                    </TableRow>

                    <TableRow v-else-if="data?.userdashboard.files.length === 0">
                        <TableCell :colspan="7" class="py-20 text-center"> No data found </TableCell>
                    </TableRow>

                    <template v-else>
                        <TableRow v-for="(files, index) in data.userdashboard.files" :key="index" class="align-top">
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
                                        <span class="font-bold">{{ files.finalOrdinanceNumber ?? files.ordinanceNumber }}</span>
                                    </Badge>

                                    <p class="mt-2 line-clamp-3 text-[13px] leading-relaxed text-wrap text-slate-700">
                                        {{ files.finalTitle ?? files.title }}
                                    </p>
                                </div>
                            </TableCell>

                            <!-- Category -->
                            <TableCell>
                                <Badge variant="outline" class="text-[12px] uppercase">
                                    {{ files.category.category }}
                                </Badge>
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
                                            {{ files.municipalStatus == 1 ? 'Draft | Municipal' : 'Approved | Municipal' }}
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
                                                    ? 'Disapproved | Provincial'
                                                    : files.provincialStatus == 2
                                                      ? 'Approved | Provincial'
                                                      : 'Pending | Provincial'
                                            }}
                                        </Badge>
                                    </div>

                                    <Accordion type="single" collapsible>
                                        <AccordionItem value="dates" class="rounded-md border">
                                            <Button variant="ghost" size="sm" class="w-full justify-start" as-child>
                                                <AccordionTrigger class="flex items-center gap-2 text-[12px]">
                                                    <Calendar1Icon class="text-muted-foreground" />
                                                    <span class="text-muted-foreground">View Timeline Dates</span>
                                                </AccordionTrigger>
                                            </Button>

                                            <AccordionContent>
                                                <Table class="text-[12px]">
                                                    <TableBody>
                                                        <TableRow>
                                                            <TableCell class="font-medium">Implementation</TableCell>
                                                            <TableCell>
                                                                {{ files.implementationDate ? formatDate(files.implementationDate) : '-' }}
                                                            </TableCell>
                                                        </TableRow>

                                                        <TableRow>
                                                            <TableCell class="font-medium">SPSL Approval</TableCell>
                                                            <TableCell>
                                                                {{ files.spslapprovalDate ? formatDate(files.spslapprovalDate) : '-' }}
                                                            </TableCell>
                                                        </TableRow>

                                                        <TableRow>
                                                            <TableCell class="font-medium">Transmittal</TableCell>
                                                            <TableCell>
                                                                {{ files.transmittalDate ? formatDate(files.transmittalDate) : '-' }}
                                                            </TableCell>
                                                        </TableRow>

                                                        <TableRow>
                                                            <TableCell class="font-medium">LCE Approval</TableCell>
                                                            <TableCell>
                                                                {{ files.lceapprovalDate ? formatDate(files.lceapprovalDate) : '-' }}
                                                            </TableCell>
                                                        </TableRow>

                                                        <TableRow>
                                                            <TableCell class="font-medium">Enactment</TableCell>
                                                            <TableCell>
                                                                {{ files.enactmentDate ? formatDate(files.enactmentDate) : '-' }}
                                                            </TableCell>
                                                        </TableRow>

                                                        <TableRow>
                                                            <TableCell class="font-medium">3rd Reading</TableCell>
                                                            <TableCell>
                                                                {{ files.thirdReadingDate ? formatDate(files.thirdReadingDate) : '-' }}
                                                            </TableCell>
                                                        </TableRow>

                                                        <TableRow>
                                                            <TableCell class="font-medium">2nd Reading</TableCell>
                                                            <TableCell>
                                                                {{ files.secondReadingDate ? formatDate(files.secondReadingDate) : '-' }}
                                                            </TableCell>
                                                        </TableRow>

                                                        <TableRow>
                                                            <TableCell class="font-medium">Public Hearing</TableCell>
                                                            <TableCell>
                                                                {{ files.publicHearingDate ? formatDate(files.publicHearingDate) : '-' }}
                                                            </TableCell>
                                                        </TableRow>

                                                        <TableRow>
                                                            <TableCell class="font-medium">1st Reading</TableCell>
                                                            <TableCell>
                                                                {{ files.firstReadingDate ? formatDate(files.firstReadingDate) : '-' }}
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                </div>
                            </TableCell>

                            <!-- Updated -->
                            <TableCell>
                                <div class="text-muted-foreground text-xs">
                                    {{ formatDateTime(files.updated_at) }}
                                </div>
                            </TableCell>

                            <!-- File -->
                            <TableCell class="text-center">
                                <Button variant="default" size="sm" class="gap-2 text-[12px]" as-child>
                                    <a :href="'/storage/files/' + files.file" target="_blank">
                                        <EyeIcon class="h-4 w-4" />
                                    </a>
                                </Button>
                            </TableCell>
                        </TableRow>
                    </template>
                </TableBody>
            </Table>
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
