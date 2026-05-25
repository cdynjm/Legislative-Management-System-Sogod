<script setup lang="ts">
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import SlowLink from './SlowLink.vue';

defineProps<{
  items: NavItem[];
}>();

</script>

<template>
  <SidebarGroup class="px-2 py-0">
    <SidebarGroupLabel>Pages</SidebarGroupLabel>
    <SidebarMenu>
      <SidebarMenuItem v-for="item in items" :key="item.title">
        <SidebarMenuButton 
          as-child 
          :is-active="route().current(item.href)"
          :tooltip="item.title"
        >
          <SlowLink :href="route(item.href)" prefetch>
            <component :is="item.icon" class="text-gray-500" />
            <span class="text-[13px]">{{ item.title }}</span>
          </SlowLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarGroup>
</template>
