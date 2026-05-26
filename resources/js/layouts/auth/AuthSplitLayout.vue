<script setup lang="ts">
import { Link } from '@inertiajs/vue3';

defineProps<{
    title?: string;
    description?: string;
}>();
</script>

<template>
    <div class="bg-muted/30 flex min-h-screen items-center justify-center p-6">
        <div class="w-full max-w-4xl overflow-hidden rounded-md border bg-white shadow-2xl">
            <div class="grid grid-cols-1 md:grid-cols-2">
                <!-- LEFT SIDE -->
                <div
                    class="relative flex flex-1 items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-5 text-white md:p-10"
                >
                    <!-- glow -->
                    <div class="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
                    <div class="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl" />

                    <!-- logo -->
                    <div class="relative z-10 flex flex-col items-center justify-center">
                        <Link :href="route('home')" class="flex flex-col items-center md:gap-3">
                            <div class="relative flex items-center justify-center">
                                <div class="absolute h-32 w-32 rounded-full bg-blue-500/25 blur-3xl md:h-96 md:w-96" />

                                <div class="absolute h-24 w-24 rounded-full bg-sky-400/20 blur-2xl md:h-72 md:w-72" />

                                <img
                                    draggable="false"
                                    src="/app-logo.gif"
                                    class="relative z-10 h-20 w-20 rounded-full object-cover shadow-2xl drop-shadow-[0_20px_35px_rgba(59,130,246,0.35)] transition duration-300 hover:-translate-y-1 md:h-80 md:w-80"
                                    alt="Logo"
                                />
                            </div>

                            <div class="mt-2 flex flex-col text-center">
                                <span class="text-[16px] font-semibold tracking-wide whitespace-nowrap"> LEGISLATIVE MS </span>

                                <span class="text-[12px] text-gray-400"> Legislative Management System </span>
                            </div>
                        </Link>
                    </div>
                </div>

                <!-- RIGHT SIDE -->
                <div class="flex flex-col justify-center p-8 my-4 sm:p-10">
                    <div class="mx-4 mb-6 flex items-start justify-between gap-4">
                        <div>
                            <h1 v-if="title" class="md:text-2xl text-lg font-semibold tracking-tight text-gray-900">
                                {{ title }}
                            </h1>

                            <p v-if="description" class="text-muted-foreground text-xs md:text-sm">
                                {{ description }}
                            </p>
                        </div>

                        <img
                            draggable="false"
                            src="/hello.png"
                            class="h-13 w-13 shrink-0 object-cover transition duration-300 hover:-translate-y-1"
                            alt="Logo"
                        />
                    </div>

                    <div class="mx-4">
                        <slot />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
