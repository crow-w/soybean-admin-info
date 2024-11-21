<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { fetchGetAllRoles } from '@/service/api';
import { $t } from '@/locales';
import { enableStatusOptions, userGenderOptions } from '@/constants/business';
// 改了用户名
defineOptions({
  name: 'BannerOperateDrawer'
});

interface Props {
  /** the type of operation */
  operateType: NaiveUI.TableOperateType;
  /** the edit row data */
  rowData?: Api.SystemManage.User | null;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const { formRef, validate, restoreValidation } = useNaiveForm();
const { defaultRequiredRule } = useFormRules();

const title = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: $t('page.bannerManagement.form.add'),
    edit: $t('page.bannerManagement.form.edit')
  };
  return titles[props.operateType];
});

type Model = Pick<Api.BannerManagement.Banner, 'imgUrl' | 'sort' | 'status' | 'remainingTime'>;

const model = ref(createDefaultModel());

function createDefaultModel(): Model {
  return {
    imgUrl: '',
    sort: 0,
    status: '1',
    remainingTime: 0
  };
}

type RuleKey = Extract<keyof Model, 'userName' | 'status'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  userName: defaultRequiredRule,
  status: defaultRequiredRule
};

/** the enabled role options */
const roleOptions = ref<CommonType.Option<string>[]>([]);

async function getRoleOptions() {
  const { error, data } = await fetchGetAllRoles();

  if (!error) {
    const options = data.map(item => ({
      label: item.roleName,
      value: item.roleCode
    }));

    // the mock data does not have the roleCode, so fill it
    // if the real request, remove the following code
    const userRoleOptions = model.value.userRoles.map(item => ({
      label: item,
      value: item
    }));
    // end

    roleOptions.value = [...userRoleOptions, ...options];
  }
}

function handleInitModel() {
  model.value = createDefaultModel();

  if (props.operateType === 'edit' && props.rowData) {
    Object.assign(model.value, props.rowData);
  }
}

function closeDrawer() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();
  // request
  window.$message?.success($t('common.updateSuccess'));
  closeDrawer();
  emit('submitted');
}

watch(visible, () => {
  if (visible.value) {
    handleInitModel();
    restoreValidation();
    getRoleOptions();
  }
});
</script>

<template>
  <NDrawer v-model:show="visible" display-directive="show" :width="360">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <NForm ref="formRef" :model="model" :rules="rules">
        <NFormItem :label="$t('page.bannerManagement.form.upload')" path="userName">
          <NUpload :default-file-list="fileList" list-type="image-card" />
        </NFormItem>
        <NFormItem :label="$t('page.bannerManagement.form.sort')" path="userName">
          <NInputNumber v-model="model.sort" />
        </NFormItem>
        <NFormItem :label="$t('page.bannerManagement.form.status')" path="userGender">
          <NSwitch v-model="model.status">
            <template #checked>上架</template>
            <template #unchecked>下架</template>
          </NSwitch>
        </NFormItem>
        <NFormItem v-if="model.status === '1'" :label="$t('page.bannerManagement.form.remainingTime')" path="nickName">
          <NInputNumber v-model="model.remainingTime" />
        </NFormItem>
      </NForm>
      <template #footer>
        <NSpace :size="16">
          <NButton @click="closeDrawer">{{ $t('common.cancel') }}</NButton>
          <NButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped></style>
