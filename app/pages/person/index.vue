<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { getPaginationRowModel } from '@tanstack/table-core'
import type { Row } from '@tanstack/table-core'
import type { User } from '~/types'
import { useRouter } from 'vue-router'

const router = useRouter()

const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const toast = useToast()
const table = useTemplateRef('table')

const columnFilters = ref<[]>([])
const columnVisibility = ref()
const rowSelection = ref({ 1: true })

const { data, status } = await useFetch<User[]>('http://localhost:3002/api/person', {
  lazy: true
})

function getRowItems(row: Row<User>) {
  return [
    {
      type: 'label',
      label: 'Actions'
    },
    {
      label: 'Copy customer ID',
      icon: 'i-lucide-copy',
      onSelect() {
        navigator.clipboard.writeText(row.original._id.toString())
        toast.add({
          title: 'Copied to clipboard',
          description: 'Customer ID copied to clipboard'
        })
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Edit',
      icon: 'i-lucide-list',
      onSelect() {
        localStorage.setItem('customer', row.original._id.toString())
        router.push(`/person/edit`)
      }
    },
    {
      label: 'View customer',
      icon: 'i-lucide-wallet',
      onSelect() {
        localStorage.setItem('customer', row.original._id.toString())
        router.push(`/person/view`)
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Delete customer',
      icon: 'i-lucide-trash',
      color: 'error',
      onSelect() {
        console.log('row.original', row.original._id.toString())
        localStorage.setItem('customer', row.original._id.toString())
        router.push(`/person/delete`)
        toast.add({
          title: 'Customer deleted',
          description: 'The customer has been deleted.'
        })
      }
    }
  ]
}

const columns: TableColumn<User>[] = [
  {
    accessorKey: '_id',
    header: 'ID'
  },
  {
    accessorKey: 'name',
    header: 'Name'
  },
  {
    accessorKey: 'id_card',
    header: 'ID Card'
  },
  {
    accessorKey: 'lat',
    header: 'LAT',
    cell: ({ row }) =>
      h('div', { class: 'bg-yellow-100 text-center px-2 py-1 rounded' }, row.original.lat)
  },
  {
    accessorKey: 'long',
    header: 'LONG',
    cell: ({ row }) =>
      h('div', { class: 'bg-green-100 text-center px-2 py-1 rounded' }, row.original.long)
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return h(
        'div',
        { class: 'text-right' },
        h(
          UDropdownMenu,
          {
            content: {
              align: 'end'
            },
            items: getRowItems(row)
          },
          () =>
            h(UButton, {
              icon: 'i-lucide-ellipsis-vertical',
              color: 'neutral',
              variant: 'ghost',
              class: 'ml-auto'
            })
        )
      )
    }
  }
]


const statusFilter = ref('all')

const pagination = ref({
  pageIndex: 0,
  pageSize: 10
})

function goToAddPerson() {
  router.push('/person/add')
}
</script>

<template>
  <UDashboardPanel id="customers">
    <template #header>
      <UDashboardNavbar title="Customers">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <!-- <CustomersAddModal /> -->
          <UButton label="New customer" icon="i-lucide-plus" @click="goToAddPerson()" />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex flex-wrap items-center justify-between gap-1.5">
        <div class="flex flex-wrap items-center gap-1.5">
          <USelect
            v-model="statusFilter"
            :items="[
              { label: 'All', value: 'all' },
              { label: 'Subscribed', value: 'subscribed' },
              { label: 'Unsubscribed', value: 'unsubscribed' },
              { label: 'Bounced', value: 'bounced' }
            ]"
            :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
            placeholder="Filter status"
            class="min-w-28"
          />
        </div>
      </div>

      <UTable
        ref="table"
        v-model:column-filters="columnFilters"
        v-model:column-visibility="columnVisibility"
        v-model:row-selection="rowSelection"
        v-model:pagination="pagination"
        :pagination-options="{
          getPaginationRowModel: getPaginationRowModel()
        }"
        class="shrink-0"
        :data="data"
        :columns="columns"
        :loading="status === 'pending'"
        :ui="{
          base: 'table-fixed border-separate border-spacing-0',
          thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
          tbody: '[&>tr]:last:[&>td]:border-b-0',
          th: 'py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
          td: 'border-b border-default'
        }"
      />

      <div class="flex items-center justify-between gap-3 border-t border-default pt-4 mt-auto">
        <div class="text-sm text-muted">
          {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0 }} of
          {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }} row(s) selected.
        </div>

        <div class="flex items-center gap-1.5">
          <UPagination
            :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
            :items-per-page="table?.tableApi?.getState().pagination.pageSize"
            :total="table?.tableApi?.getFilteredRowModel().rows.length"
            @update:page="(p: number) => table?.tableApi?.setPageIndex(p - 1)"
          />
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
