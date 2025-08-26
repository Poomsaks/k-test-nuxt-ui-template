<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import type { Member } from '~/types'
import { useRouter } from 'vue-router'

const router = useRouter()

defineProps<{
  members: Member[]
}>()

// ฟังก์ชันสร้าง dropdown items ของแต่ละ member
const getMemberActions = (member: Member): DropdownMenuItem[] => [
  {
    label: 'Edit member',
    onSelect: () => {
      console.log('Edit member id:', member.name)
      // sessionStorage.setItem('memberName', member.name)
      localStorage.setItem('memberName', member.name)
      // router.push(`/settings/members/edit/${member.name}`)
      router.push(`/settings/members/edit`)
    }
  },
  {
    label: 'Remove member',
    color: 'error' as const,
    onSelect: () => {
      console.log('Remove member id:', member.id)
      // ใส่ logic ลบ member ได้ที่นี่
    }
  }
]
</script>

<template>
  <ul role="list" class="divide-y divide-default">
    <li
      v-for="(member) in members"
      :key="member.id"
      class="flex items-center justify-between gap-3 py-3 px-4 sm:px-6"
    >
      <div class="flex items-center gap-3 min-w-0">
        <UAvatar
          v-bind="member.avatar"
          size="md"
        />

        <div class="text-sm min-w-0">
          <p class="text-highlighted font-medium truncate">
            {{ member.name }}
          </p>
          <p class="text-muted truncate">
            {{ member.username }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <USelect
          :model-value="member.role"
          :items="['member', 'owner']"
          color="neutral"
          :ui="{ value: 'capitalize', item: 'capitalize' }"
        />

        <UDropdownMenu :items="getMemberActions(member)" :content="{ align: 'end' }">
          <UButton
            icon="i-lucide-ellipsis-vertical"
            color="neutral"
            variant="ghost"
          />
        </UDropdownMenu>
      </div>
    </li>
  </ul>
</template>
