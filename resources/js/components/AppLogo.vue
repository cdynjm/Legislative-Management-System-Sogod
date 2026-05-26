<script setup lang="ts">
import AppLogoIcon from '@/components/AppLogoIcon.vue';
import { useSidebar } from '@/components/ui/sidebar';

const { state } = useSidebar();
</script>

<template>
    <div
        class="flex aspect-square items-center justify-center rounded-full shadow-md transition-all"
        :class="state === 'collapsed' ? 'size-8' : 'size-10'"
    >
        <AppLogoIcon class="text-white transition-all dark:text-black" :class="state === 'collapsed' ? 'size-6' : 'size-8'" />
    </div>

    <div class="ml-1 grid flex-1 text-left text-sm">
        <div class="flex flex-col">
            <span class="truncate leading-none font-bold"> Sogod LMS </span>

            <span class="mt-[5px] text-[10px] leading-none font-thin"> Legislative Management System </span>
        </div>
    </div>
</template>
