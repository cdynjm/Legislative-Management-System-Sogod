<script setup lang="ts">
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import UserInfo from '@/components/UserInfo.vue';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItemType } from '@/types';
import { LogOut, LucideUserCircle, User2Icon } from 'lucide-vue-next';

import { type SharedData, type User } from '@/types';
import { Link, router, usePage } from '@inertiajs/vue3';

import AppLogoIcon from '@/components/AppLogoIcon.vue';
import SlowLink from '@/components/SlowLink.vue';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
const page = usePage<SharedData>();
const user = page.props.auth.user as User;

withDefaults(
    defineProps<{
        breadcrumbs?: BreadcrumbItemType[];
    }>(),
    {
        breadcrumbs: () => [],
    },
);

const handleLogout = () => {
    router.flushAll();
};
</script>

<template>
    <header
        class="border-sidebar-border/70 flex h-16 items-center justify-between gap-2 border-b px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4"
    >
        <!-- Left: Sidebar trigger + breadcrumbs -->
        <div class="flex items-center gap-2">
            <SidebarTrigger class="-ml-1" />
            <template v-if="breadcrumbs && breadcrumbs.length > 0">
                <Breadcrumbs :breadcrumbs="breadcrumbs" class="hidden md:block" />
            </template>
            <div class="flex items-center gap-2 md:hidden block">
                <div class="flex aspect-square size-10 items-center justify-center rounded-full shadow-sm">
                    <AppLogoIcon class="size-10 text-white dark:text-black" />
                </div>
                <p class="text-[14px] leading-none font-bold text-gray-600">Sogod LMS</p>
            </div>
        </div>
        <!-- Right: Profile (no dropdown) -->
        <DropdownMenu>
            <DropdownMenuTrigger as-child>
                <Button variant="outline">
                    <div class="flex items-center gap-3">
                        <span class="text-sm font-medium text-gray-800 dark:text-white">Hi, {{ user.name.split(' ')[0] }}</span>
                        <LucideUserCircle class="text-blue-500" />
                    </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent class="mt-2 mr-5 w-56">
                <DropdownMenuLabel>
                    <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <UserInfo :user="user" :show-email="true" />
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <SlowLink :href="route('profile.edit')">
                            <span>Profile</span>
                        </SlowLink>
                        <DropdownMenuShortcut><User2Icon /></DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link method="post" :href="route('logout')" @click="handleLogout" as="button">
                            <span>Log Out</span>
                        </Link>
                        <DropdownMenuShortcut><LogOut /></DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    </header>
</template>
