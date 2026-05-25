<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/vue3';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Reports',
        href: '/admin/report',
    },
];
</script>

<template>
    <Head title="Reports" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="space-y-6 p-4">
            <!-- Top Right Add Button -->
            <div class="flex w-full items-center justify-between">
                <h6 class="text-md flex-1 font-bold">Reports</h6>
            </div>
        </div>
    </AppLayout>
</template>
