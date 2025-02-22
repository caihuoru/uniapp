<template>
	<view :style="themeColor()">
		<u-loading-page :loading="loading" loadingText="" bg-color="#f7f7f7"></u-loading-page>

		<view v-show="!loading">
			<!-- #ifdef MP-WEIXIN -->
			<top-tabbar v-if="!isShowTopTabbar" :title="data.title" />
			<!-- #endif -->

			<!-- 自定义模板渲染 -->
			<view class="diy-template-wrap bg-index" v-if="data.pageMode != 'fixed'" :style="pageStyle">

				<diy-group :data="data" :pullDownRefreshCount="pullDownRefreshCount"></diy-group>

			</view>

			<!-- 固定模板渲染 -->
			<view class="fixed-template-wrap" v-if="data.pageMode == 'fixed'">

				<fixed-group :data="data" :pullDownRefreshCount="pullDownRefreshCount"></fixed-group>

			</view>

		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, reactive, computed } from 'vue';
	import { onLoad, onShow, onPullDownRefresh, onPageScroll } from '@dcloudio/uni-app';
	import { getDiyInfo } from '@/app/api/diy';
	import useDiyStore from '@/app/stores/diy';
	import { useShare } from '@/hooks/useShare'
	import { img } from '@/utils/common';
    import diyGroup from '@/addon/components/diy/group/index.vue'
    import fixedGroup from '@/addon/components/fixed/group/index.vue'

	const { setShare, onShareAppMessage, onShareTimeline } = useShare()
	onShareAppMessage()
	onShareTimeline()

	const loading = ref(true);
	const diyStore = useDiyStore();
	const pullDownRefreshCount = ref(0)
	let isShowTopTabbar = ref(false);

	const diyData = reactive({
		pageMode: 'diy',
		title: '',
		global: {},
		value: []
	})

	const data = computed(() => {
		if (diyStore.mode == 'decorate') {
			return diyStore;
		} else {
			return diyData;
		}
	})

	const id = ref(0)
	const name = ref('')
    const template = ref('')

	onLoad(option => {
		// #ifdef H5
		// 装修模式
		diyStore.mode = option.mode || '';
		if (diyStore.mode == 'decorate') {
			loading.value = false;
		}
		// #endif
		id.value = option.id || '';
		name.value = option.name || '';
        template.value = option.template || '';
	});

	onShow(() => {
		// 装修模式
		if (diyStore.mode == 'decorate') {
			diyStore.init();
		} else {
			getDiyInfo({
				id: id.value,
                name: name.value,
                template: template.value
			}).then((res : any) => {
				if (res.data.value) {
					let data = res.data;
					diyData.pageMode = data.mode;
					diyData.title = data.title;

					let sources = JSON.parse(data.value);
					diyData.global = sources.global;
					diyData.value = sources.value;
					diyData.value.forEach((item, index) => {
						item.pageStyle = '';
                        if(item.pageStartBgColor) {
                            if (item.pageStartBgColor && item.pageEndBgColor) item.pageStyle += `background:linear-gradient(${item.pageGradientAngle},${item.pageStartBgColor},${item.pageEndBgColor});`;
                            else item.pageStyle += 'background-color:' + item.pageStartBgColor + ';';
                        }

                        if (item.margin) {
							item.pageStyle += 'padding-top:' + item.margin.top * 2 + 'rpx' + ';';
							item.pageStyle += 'padding-bottom:' + item.margin.bottom * 2 + 'rpx' + ';';
							item.pageStyle += 'padding-right:' + item.margin.both * 2 + 'rpx' + ';';
							item.pageStyle += 'padding-left:' + item.margin.both * 2 + 'rpx' + ';';
						}
					});
					// 控制自定义头部是否出现 | 微信小程序
					isShowTopTabbar.value = diyData.value.some((item)=>{
						return item && item.position && item.position == 'top_fixed'
					})
					uni.setNavigationBarTitle({
						title: diyData.title
					})
				}

				let share = res.data.share ? JSON.parse(res.data.share) : null;
				setShare(share);

				loading.value = false;
			});
		}
	});

    const pageStyle = computed(()=>{
        var style = '';
        if (data.value.global.pageStartBgColor && data.value.global.pageEndBgColor) style += `background:linear-gradient(${data.value.global.pageGradientAngle},${data.value.global.pageStartBgColor},${data.value.global.pageEndBgColor});`;
        else style += 'background-color:' + data.value.global.pageStartBgColor + ';';

        style += 'min-height:calc(100vh - 50px);';
        if(data.value.global.bgUrl) {
            style += `background-image:url('${ img(data.value.global.bgUrl) }');`;
        }

        if (data.value.global.bgHeightScale) {
            style += `background-size: 100% ${data.value.global.bgHeightScale}%;`;
        }

        return style;
    });

    // 监听下拉刷新事件
    onPullDownRefresh(() => {
        pullDownRefreshCount.value++;
        uni.stopPullDownRefresh();
    })

    onPageScroll((e)=>{
        diyStore.scrollTop = e.scrollTop;
    })
</script>
<style lang="scss" scoped>
	@import '@/styles/diy.scss';
</style>
<style lang="scss">
	.diy-template-wrap {
		::v-deep .diy-group {
			> .draggable-element.top-fixed-diy {
				display: none;
			}
		}
	}
</style>