<template>
    <view v-if="agreement" class="p-[30rpx]" :style="themeColor()">
        <u-parse :content="agreement.content" :tagStyle="{img: 'vertical-align: top;'}"></u-parse>
    </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getAgreementInfo } from '@/app/api/system'

const agreement = ref(null)

onLoad((option)=> {
    getAgreementInfo(option.key).then((res: AnyObject) => {
        agreement.value = res.data
        uni.setNavigationBarTitle({
            title: res.data.title
        })
    })
})
</script>

<style lang="scss">
</style>
