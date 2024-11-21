<script setup lang="tsx">
import { NButton, NPopconfirm, NTag } from 'naive-ui';
import { $t } from '@/locales';
import { useAppStore } from '@/store/modules/app';
import { bannerTypeRecord } from '@/constants/business';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { fetchGetBannerList } from '@/service/api/banner-manage';
import BannerOperateDrawer from './modules/banner-operate-drawer.vue';

const appStore = useAppStore();

const { columns, columnChecks, data, getData, getDataByPage, loading, mobilePagination } = useTable({
  apiFn: fetchGetBannerList,
  apiParams: {
    current: 1,
    size: 10
  },
  columns: () => [
    {
      type: 'selection',
      align: 'center',
      width: 48
    },
    {
      key: 'imgUrl',
      title: $t('page.bannerManagement.form.imgUrl'),
      align: 'center',
      minWidth: 100,
      render: row => <n-image style="width: 50px; height: 50px;" src={row.imgUrl} />
    },
    {
      key: 'sort',
      title: $t('page.bannerManagement.form.sort'),
      align: 'center',
      windth: 48
    },
    {
      key: 'status',
      title: $t('page.bannerManagement.form.status'),
      align: 'center',
      width: 100,
      render: row => {
        if (row.status === null) {
          return null;
        }

        const tagMap: Record<Api.Common.EnableStatus, NaiveUI.ThemeColor> = {
          1: 'success',
          2: 'error'
        };

        const label = $t(bannerTypeRecord[row.status]);

        return <NTag type={tagMap[row.status]}>{label}</NTag>;
      }
    },
    {
      key: 'remainingTime',
      title: `${$t('page.bannerManagement.form.remainingTime')}(天)`,
      align: 'center',
      width: 150
    },
    {
      key: 'updateTime',
      title: $t('page.bannerManagement.form.updateTime'),
      align: 'center',
      maxWidth: 100
    },
    {
      key: 'createTime',
      title: $t('page.bannerManagement.form.careateTime'),
      align: 'center',
      maxWidth: 100
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 130,
      render: row => (
        <div class="flex-center gap-8px">
          <NButton type="primary" ghost size="small" onClick={() => edit(row.id)}>
            {$t('common.edit')}
          </NButton>
          <NPopconfirm onPositiveClick={() => handleDelete(row.id)}>
            {{
              default: () => $t('common.confirmDelete'),
              trigger: () => (
                <NButton type="error" ghost size="small">
                  {$t('common.delete')}
                </NButton>
              )
            }}
          </NPopconfirm>
        </div>
      )
    }
  ]
});

const {
  drawerVisible,
  operateType,
  editingData,
  handleAdd,
  handleEdit,
  checkedRowKeys,
  onBatchDeleted,
  onDeleted
  // closeDrawer
} = useTableOperate(data, getData);

async function handleBatchDelete() {
  // request
  console.log(checkedRowKeys.value);

  onBatchDeleted();
}

function handleDelete(id: number) {
  // request
  console.log(id);

  onDeleted();
}

function edit(id: number) {
  handleEdit(id);
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <NCard
      :title="$t('page.bannerManagement.form.title')"
      :bordered="false"
      size="small"
      class="sm:flex-1-hidden card-wrapper"
    >
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading"
          @add="handleAdd"
          @delete="handleBatchDelete"
          @refresh="getData"
        />
      </template>
      <NDataTable
        v-model:checked-row-keys="checkedRowKeys"
        :columns="columns"
        :data="data"
        size="small"
        :flex-height="!appStore.isMobile"
        :scroll-x="962"
        :loading="loading"
        remote
        :row-key="row => row.id"
        :pagination="mobilePagination"
        class="sm:h-full"
      />
      <BannerOperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="getDataByPage"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
