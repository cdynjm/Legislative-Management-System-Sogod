<script setup lang="ts">
import NavFooter from '@/components/NavFooter.vue';
import Button from '@/components/ui/button/Button.vue';
import { Head, Link } from '@inertiajs/vue3';
import { ref, watchEffect } from 'vue';

import Pagination from '@/components/Pagination.vue';
import SkeletonBox from '@/components/SkeletonBox.vue';
import SkeletonCard from '@/components/SkeletonCard.vue';
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useQuery, useQueryClient } from '@tanstack/vue-query';
import axios from 'axios';
import { Building2, EyeIcon, Folder, LoaderCircle, MapPin, MinusCircle, PenIcon, Search, UserIcon } from 'lucide-vue-next';

const queryClient = useQueryClient();

const currentPage = ref(1);
const fileSearchData = ref<any[]>([]);
const searchQuery = ref<string>('');

const paginatorInfo = ref({
    currentPage: 1,
    lastPage: 1,
    hasMorePages: false,
});

const guestFetchFiles = async () => {
    const query = `
    query ($page: Int, $first: Int!, $search: String)  {
      welcome(page: $page, first: $first, search: $search) {
        filesListPaginated {
          data {
            municipalStatus
            provincialStatus
            title
            ordinanceNumber
            finalTitle
            file
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
            page: currentPage.value,
            first: 30,
            search: searchQuery.value,
        },
    });

    return response.data.data;
};

const { data, isPending } = useQuery({
    queryKey: ['guestFetchFiles', currentPage],
    queryFn: guestFetchFiles,
});

watchEffect(() => {
    if (data.value?.welcome?.filesListPaginated) {
        fileSearchData.value = data.value.welcome.filesListPaginated.data;
        paginatorInfo.value = data.value.welcome.filesListPaginated.paginatorInfo;
    }
});

const isSearching = ref<boolean>(false);

const searchQuerybtn = () => {
    if (isSearching.value) return;
    isSearching.value = true;
    setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['guestFetchFiles'] });
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

const activeTab = ref<'municipal' | 'barangay'>('municipal');
</script>

<template>
    <Head title="Welcome">
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
    </Head>
    <div class="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
        <header class="mb-6 w-full not-has-[nav]:hidden lg:px-40">
            <nav class="flex w-full items-center justify-between gap-4">
                <!-- Logo + Labels -->
                <div class="flex items-center gap-3">
                    <img draggable="false" src="/app-logo.gif" alt="Logo" class="h-13 w-auto rounded-full shadow-xl" />

                    <!-- Labels -->
                    <div class="flex flex-col leading-tight">
                        <!-- Full label for sm and up -->
                        <div class="hidden flex-col sm:flex">
                            <span class="text-base text-[14px] font-semibold text-[#1b1b18] dark:text-white"> Legislative MS </span>
                            <span class="text-sm text-[12px] text-gray-500 dark:text-gray-400"> Legislative Management System </span>
                        </div>
                        <!-- LMS only for smaller than sm -->
                        <span class="block text-base font-semibold text-[#1b1b18] sm:hidden dark:text-white"> Sogod LMS </span>
                    </div>
                </div>

                <!-- Auth Buttons -->
                <div class="flex items-center gap-4">
                    <Link
                        :href="route('login')"
                        class="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                    >
                        Log in
                    </Link>
                    <Button class="inline-block rounded-sm"> LMS </Button>
                </div>
            </nav>
        </header>

        <div class="w-full lg:px-20 lg:pt-5">
            <div class="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                <!-- Municipal -->
                <Card
                    @click="activeTab = 'municipal'"
                    class="group relative cursor-pointer overflow-hidden border transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                    :class="activeTab === 'municipal' ? 'border-blue-500 bg-blue-50/50 shadow-sm' : 'bg-white'"
                >
                    <!-- active indicator bar -->
                    <div v-if="activeTab === 'municipal'" class="absolute top-0 left-0 h-full w-1 bg-blue-500" />

                    <CardContent class="flex items-center gap-4 p-5 py-2">
                        <!-- icon -->
                        <div
                            class="flex h-10 w-10 items-center justify-center rounded-lg"
                            :class="activeTab === 'municipal' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'"
                        >
                            <Building2 class="h-5 w-5" />
                        </div>

                        <!-- text -->
                        <div class="flex-1">
                            <div class="text-sm font-semibold text-gray-800">Municipal Ordinances</div>
                            <div class="text-muted-foreground text-xs">Active legislative records</div>
                        </div>

                        <!-- status dot -->
                        <div class="h-2.5 w-2.5 rounded-full" :class="activeTab === 'municipal' ? 'bg-blue-500' : 'bg-gray-300'" />
                    </CardContent>
                </Card>

                <!-- Barangay -->
                <Card
                    @click="activeTab = 'barangay'"
                    class="group relative cursor-pointer overflow-hidden border transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                    :class="activeTab === 'barangay' ? 'border-green-500 bg-green-50/50 shadow-sm' : 'bg-white'"
                >
                    <!-- active indicator bar -->
                    <div v-if="activeTab === 'barangay'" class="absolute top-0 left-0 h-full w-1 bg-green-500" />

                    <CardContent class="flex items-center gap-4 p-5 py-2">
                        <!-- icon -->
                        <div
                            class="flex h-10 w-10 items-center justify-center rounded-lg"
                            :class="activeTab === 'barangay' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'"
                        >
                            <MapPin class="h-5 w-5" />
                        </div>

                        <!-- text -->
                        <div class="flex-1">
                            <div class="text-sm font-semibold text-gray-800">Barangay Ordinances</div>
                            <div class="text-muted-foreground text-xs">List of Barangay Ordinances</div>
                        </div>

                        <!-- status dot -->
                        <div class="h-2.5 w-2.5 rounded-full" :class="activeTab === 'barangay' ? 'bg-green-500' : 'bg-gray-300'" />
                    </CardContent>
                </Card>
            </div>
        </div>

        <div class="flex min-h-screen w-full flex-col" v-if="activeTab === 'municipal'">
            <main class="w-full flex-1 lg:px-20">
                <Card class="mb-4 py-2 shadow-none">
                    <div class="mx-5">
                        <CardDescription class="items-center justify-center gap-2 text-center font-bold md:flex md:justify-between">
                            <div class="flex items-center justify-center gap-2 md:mb-0">
                                <Folder class="mb-[2px] h-auto w-5" />
                                List of Ordinances
                            </div>
                            <div class="hidden md:flex">Municipality of Sogod</div>
                        </CardDescription>
                    </div>
                </Card>
                <div class="my-4 flex w-full items-center gap-2 sm:w-auto">
                    <Input v-model="searchQuery" placeholder="Search..." class="w-full bg-white text-sm shadow-none sm:w-full" />
                    <Button @click="searchQuerybtn" :disabled="isSearching" class="flex items-center gap-1 text-sm">
                        <LoaderCircle v-if="isSearching" class="h-4 w-4 animate-spin" />
                        <Search v-else />
                    </Button>
                </div>
                <div class="grid grid-cols-1 gap-4" v-if="fileSearchData.length == 0 && !isPending">
                    <Card class="shadow-none">
                        <CardDescription class="flex items-center justify-center gap-2 text-[12px] text-red-500">
                            <MinusCircle class="h-auto w-5" /> No Data Found
                        </CardDescription>
                    </Card>
                </div>
                <div class="grid grid-cols-1 gap-4 xl:grid-cols-3">
                    <template v-if="isPending">
                        <Card class="shadow-none" v-for="n in 3" :key="n">
                            <CardHeader class="text-[14px]">
                                <SkeletonCard />
                            </CardHeader>
                            <CardContent class="grid gap-4">
                                <SkeletonBox />
                            </CardContent>
                        </Card>
                    </template>

                    <Card
                        v-else
                        class="group bg-background flex h-full flex-col overflow-hidden border py-0 shadow-lg transition-all duration-300 hover:-translate-y-1"
                        v-for="(files, index) in fileSearchData"
                        :key="index"
                    >
                        <!-- Header -->
                        <div class="border-b bg-gradient-to-r from-blue-50 to-sky-50 p-5">
                            <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                <div>
                                    <div class="text-muted-foreground text-xs tracking-wider uppercase">Ordinance Number</div>

                                    <Badge variant="secondary" class="mt-2 text-sm font-semibold">
                                        {{ files.ordinanceNumber ?? 'No Number' }}
                                    </Badge>
                                </div>

                                <Badge variant="outline" class="text-[12px] text-wrap uppercase">
                                    {{ files.category.category }}
                                </Badge>
                            </div>

                            <!-- Author -->
                            <div class="mt-5 flex items-center gap-3 rounded-lg border bg-white p-3 shadow-none">
                                <img
                                    draggable="false"
                                    :src="'/storage/profile/' + files.author.photo"
                                    class="h-12 w-12 rounded-full object-cover ring-2 ring-sky-100"
                                />

                                <div class="flex-1 text-[13px]">
                                    <p class="font-semibold">
                                        {{ files.author.name }}
                                    </p>

                                    <p class="text-muted-foreground text-xs">
                                        {{ files.author.position }}
                                    </p>
                                </div>

                                <div class="rounded-full bg-sky-100 p-2">
                                    <PenIcon class="h-4 w-4 text-sky-600" />
                                </div>
                            </div>
                        </div>

                        <CardContent class="flex-1 space-y-4 p-5 pb-0">
                            <!-- Title -->
                            <div>
                                <p class="line-clamp-3 text-[13px] leading-relaxed text-slate-700">
                                    {{ files.finalTitle == null ? files.title : files.finalTitle }}
                                </p>
                            </div>

                            <!-- Co Authors -->
                            <div>
                                <div class="mb-3 flex items-center gap-2">
                                    <UserIcon class="h-5 w-5 text-blue-600" />

                                    <span class="text-sm font-semibold text-blue-600"> Co-Authors </span>
                                </div>

                                <div class="bg-muted/30 max-h-32 items-center overflow-y-auto rounded-lg p-3">
                                    <template v-if="files.coAuthors?.length">
                                        <div v-for="(coauthor, index) in files.coAuthors" :key="index" class="mb-2 flex items-center gap-3 last:mb-0">
                                            <UserIcon class="h-5 w-5 text-blue-600" />

                                            <div>
                                                <p class="text-sm font-medium">
                                                    {{ coauthor.official.name }}
                                                </p>

                                                <p class="text-muted-foreground text-xs">
                                                    {{ coauthor.official.position }}
                                                </p>
                                            </div>
                                        </div>
                                    </template>

                                    <div v-else class="text-muted-foreground flex h-20 items-center justify-center text-sm">No co-authors</div>
                                </div>
                            </div>

                            <!-- Status -->
                            <div class="space-y-3">
                                <div class="flex items-center justify-between rounded-lg border p-3">
                                    <span class="text-muted-foreground text-sm"> Municipal Status </span>

                                    <Badge
                                        :class="
                                            files.municipalStatus == 1
                                                ? 'rounded-md bg-red-100 p-1 text-[12px] text-red-600'
                                                : 'rounded-md bg-green-100 p-1 text-[12px] text-green-600'
                                        "
                                    >
                                        {{ files.municipalStatus == 1 ? 'Draft Ordinance' : 'Approved' }}
                                    </Badge>
                                </div>

                                <div class="flex items-center justify-between rounded-lg border p-3">
                                    <span class="text-muted-foreground text-sm"> Provincial Status </span>

                                    <Badge
                                        :class="
                                            files.provincialStatus == 1
                                                ? 'rounded-md bg-red-100 p-1 text-[12px] text-red-600'
                                                : files.provincialStatus == 2
                                                  ? 'rounded-md bg-green-100 p-1 text-[12px] text-green-600'
                                                  : 'rounded-md bg-gray-100 p-1 text-[12px] text-gray-600'
                                        "
                                    >
                                        {{ files.provincialStatus == 1 ? 'Disapproved' : files.provincialStatus == 2 ? 'Approved' : 'Pending' }}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>

                        <!-- Footer -->
                        <CardFooter class="bg-muted/40 mt-auto flex items-center justify-between border-t px-5 pb-5">
                            <small class="text-muted-foreground text-xs text-wrap">
                                {{ formatDateTime(files.updated_at) }}
                            </small>

                            <Button variant="default" size="sm" class="gap-2 text-[12px]" as-child>
                                <a :href="'/storage/files/' + files.file" target="_blank">
                                    <EyeIcon class="h-4 w-4" />
                                </a>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
                <Pagination
                    :current-page="paginatorInfo.currentPage"
                    :last-page="paginatorInfo.lastPage"
                    @next="goToNextPage"
                    @previous="goToPreviousPage"
                />
            </main>
            <NavFooter />
        </div>

        <div class="flex min-h-screen w-full flex-col" v-if="activeTab === 'barangay'">
            <main class="w-full flex-1 lg:px-20">
                <Card class="mb-4 py-2 shadow-none">
                    <div class="mx-5">
                        <CardDescription class="items-center justify-center gap-2 text-center font-bold md:flex md:justify-between">
                            <div class="flex items-center justify-center gap-2 md:mb-0">
                                <Folder class="mb-[2px] h-auto w-5" />
                                List of Barangay Ordinances
                            </div>
                            <div class="hidden md:flex">Municipality of Sogod</div>
                        </CardDescription>
                    </div>
                </Card>
                <div class="my-4 flex w-full items-center gap-2 sm:w-auto">
                    <Input v-model="searchQuery" placeholder="Search..." class="w-full bg-white text-sm shadow-none sm:w-full" />
                    <Button @click="searchQuerybtn" :disabled="isSearching" class="flex items-center gap-1 text-sm">
                        <LoaderCircle v-if="isSearching" class="h-4 w-4 animate-spin" />
                        <Search v-else />
                    </Button>
                </div>
            </main>
            <NavFooter />
        </div>
    </div>
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
