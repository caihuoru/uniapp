<template>
    <view class="w-screen h-screen flex flex-col" :style="themeColor()">
        <view class="flex-1">
            <!-- #ifdef H5 -->
            <view class="h-[100rpx]"></view>
            <!-- #endif -->
            <view class="px-[60rpx] pt-[100rpx] mb-[100rpx]">
                <view class="font-bold text-lg">{{ t('bindMobile') }}</view>
            </view>
            <view class="px-[60rpx]">
                <u-form labelPosition="left" :model="formData" errorType='toast' :rules="rules" ref="formRef">
                    <u-form-item label="" prop="mobile" :border-bottom="true">
                        <u-input v-model="formData.mobile" border="none" clearable :placeholder="t('mobilePlaceholder')"/>
                    </u-form-item>
                    <view class="mt-[40rpx]">
                        <u-form-item label="" prop="mobile_code" :border-bottom="true">
                            <u-input v-model="formData.mobile_code" border="none" type="password" clearable :placeholder="t('codePlaceholder')">
                                <template #suffix>
                                    <sms-code :mobile="formData.mobile" type="bind_mobile" v-model="formData.mobile_key"></sms-code>
                                </template>
                            </u-input>
                        </u-form-item>
                    </view>
                    <view class="flex items-start mt-[30rpx]" v-if="!info && config.agreement_show">
                        <u-checkbox-group>
                            <u-checkbox :checked="isAgree" shape="shape" size="14" @change="agreeChange" :customStyle="{'marginTop': '4rpx'}" />
                        </u-checkbox-group>
                        <view class="text-xs text-gray-400 flex flex-wrap">
                            {{ t('agreeTips') }}
                            <view @click="redirect({ url: '/app/pages/auth/agreement?key=service' })">
                                <text class="text-primary">《{{ t('userAgreement') }}》</text>
                            </view>
                            <view @click="redirect({ url: '/app/pages/auth/agreement?key=privacy' })">
                                <text class="text-primary">《{{ t('privacyAgreement') }}》</text>
                            </view>
                        </view>
                    </view>
                    <view class="mt-[60rpx]">
                        <u-button type="primary" :loading="loading" :loadingText="t('binding')" @click="handleBind">
                            {{ t('bind') }}
                        </u-button>
                    </view>
                    <!-- #ifdef MP-WEIXIN -->
                    <view class="mt-[30rpx]">
                        <u-button type="primary" :plain="true" :text="t('weixinUserAuth')" open-type="getPhoneNumber" @getphonenumber="mobileAuth" v-if="info || (!info || !config.agreement_show || isAgree)"></u-button>
                        <u-button type="primary" :plain="true" :text="t('weixinUserAuth')" v-else @click="agreeTips"></u-button>
                    </view>
                    <!-- #endif -->
                </u-form>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
    import { ref, reactive, computed } from 'vue'
    import { t } from '@/locale'
    import { bind } from '@/app/api/auth'
    import { bindMobile } from '@/app/api/member'
    import useMemberStore from '@/stores/member'
    import useConfigStore from '@/stores/config'
    import { useLogin } from '@/hooks/useLogin'
    import { redirect } from '@/utils/common'

    const memberStore = useMemberStore()
    const info = computed(() => memberStore.info)

    const config = computed(() => {
        return useConfigStore().login
    })

    const loading = ref(false)
    const isAgree = ref(false)

    const formData = reactive({
        mobile: '',
        mobile_code: '',
        mobile_key: ''
    })

    uni.getStorageSync('openid') && (Object.assign(formData, { openid: uni.getStorageSync('openid') }))
    uni.getStorageSync('pid') && (Object.assign(formData, { pid: uni.getStorageSync('pid') }))

    const rules = {
        'mobile': [
            {

                type: 'string',
                required: true,
                message: t('mobilePlaceholder'),
                trigger: ['blur', 'change'],
            },
            {
                validator(rule, value, callback) {
                    let mobile = /^1[3-9]\d{9}$/;
                    if (!mobile.test(value)){
                        callback(new Error('请输入正确的手机号'))
                    } else {
                        callback()
                    }
                },
                message: t('mobileError'),
                trigger: ['change', 'blur'],
            }
        ],
        'mobile_code': {
            type: 'string',
            required: true,
            message: t('codePlaceholder'),
            trigger: ['blur', 'change']
        }
    }

    const agreeChange = () => {
        isAgree.value = !isAgree.value
    }

    const agreeTips = () => {
        uni.showToast({ title: `${t('pleaceAgree')}《${t('userAgreement')}》《${t('privacyAgreement')}》`, icon: 'none' })
    }

    const formRef = ref(null)

    const handleBind = () => {
        formRef.value.validate().then(() => {
            if (loading.value) return
            loading.value = true

            const request = info.value ? bindMobile : bind

            request(formData).then((res) => {
                if (info.value) {
                    memberStore.getMemberInfo()
                    redirect({ url: '/app/pages/member/personal', mode: 'redirectTo' })
                } else {
                    memberStore.setToken(res.data.token)
                    useLogin().handleLoginBack()
                }
            }).catch(() => {
                loading.value = false
            })
        })
    }


    const mobileAuth = (e) => {
        if (!isAgree.value && !info.value && config.value.agreement_show) {
            uni.showToast({ title: `${t('pleaceAgree')}《${t('userAgreement')}》《${t('privacyAgreement')}》`, icon: 'none' })
            return
        }

        if (e.detail.errMsg == 'getPhoneNumber:ok') {
            uni.showLoading({ title: '' })

            const request = info.value ? bindMobile : bind

            request({
                openid: formData.openid,
                mobile_code: e.detail.code
            }).then((res) => {
                uni.hideLoading()
                if (info.value) {
                    memberStore.getMemberInfo()
                    redirect({ url: '/app/pages/member/personal', mode: 'redirectTo' })
                } else {
                    memberStore.setToken(res.data.token)
                    useLogin().handleLoginBack()
                }
            }).catch(() => {
                uni.hideLoading()
            })
        }
    }
</script>

<style lang="scss" scoped></style>
