<template>
	<view :style="warpCss">
		<view :style="maskLayer"></view>
		<view class="diy-graphic-nav relative">
			<view v-if="diyComponent.layout == 'vertical'" class="graphic-nav">
				<view class="graphic-nav-item" v-for="(item, index) in diyComponent.list" :key="item.id">

					<view @click="toRedirect(item.link)" :class="['flex items-center justify-between py-3 px-4', index == 0 ? 'border-t-0':'border-t']">

						<view class="graphic-img relative flex items-center w-10 h-10 mr-[20rpx]"
							v-if="diyComponent.mode != 'text'"
							:style="{ width: diyComponent.imageSize * 2 + 'rpx', height: diyComponent.imageSize * 2 + 'rpx' }">
							<image v-if="item.imageUrl" :src="img(item.imageUrl)" mode="aspectFill"
								:style="{ maxWidth: diyComponent.imageSize * 2 + 'rpx', maxHeight: diyComponent.imageSize * 2 + 'rpx', borderRadius: diyComponent.aroundRadius * 2 + 'rpx' }"/>
							<image v-else :src="img('static/resource/images/diy/figure.png')" mode="aspectFill"
							       :style="{ maxWidth: diyComponent.imageSize * 2 + 'rpx', maxHeight: diyComponent.imageSize * 2 + 'rpx', borderRadius: diyComponent.aroundRadius * 2 + 'rpx' }"/>

							<text v-if="item.label.control"
								class="tag absolute -top-[10rpx] -right-[24rpx] text-white rounded-[24rpx] rounded-bl-none transform scale-80 py-1 px-2 text-xs"
								:style="{ color: item.label.textColor, backgroundImage: 'linear-gradient(' + item.label.bgColorStart + ',' + item.label.bgColorEnd + ')' }">
								{{ item.label.text }}
							</text>
						</view>

						<text v-if="diyComponent.mode != 'img'" class="graphic-text w-full truncate leading-normal"
							:style="{ fontSize: diyComponent.font.size * 2 + 'rpx', fontWeight: diyComponent.font.weight, color: diyComponent.font.color }">
							{{ item.title }}
						</text>
						<u-icon name="arrow-right" color="#999999" size="12"></u-icon>

					</view>

				</view>

			</view>
			<swiper v-else-if="diyComponent.layout == 'horizontal' && diyComponent.showStyle == 'pageSlide'"
				class="graphic-nav box-border relative" circular :indicator-dots="false"
				:style="{ height: swiperHeight }" @change="swiperChange">
				<swiper-item class="graphic-nav-wrap flex flex-wrap" v-for="(numItem, numIndex) in Math.ceil(diyComponent.list.length / (diyComponent.pageCount * diyComponent.rowCount))">

					<template v-for="(item, index) in diyComponent.list">

						<view class="graphic-nav-item" :class="[diyComponent.mode]" :key="item.id" v-if="swiperCondition(index,numItem)" :style="{ width: 100 / diyComponent.rowCount + '%' }">

							<view @click="toRedirect(item.link)" class="flex flex-col items-center box-border py-2">

								<view class="graphic-img relative flex items-center justify-center w-10 h-10"
									v-if="diyComponent.mode != 'text'"
									:style="{ width: diyComponent.imageSize * 2 + 'rpx', height: diyComponent.imageSize * 2 + 'rpx' }">
									<image v-if="item.imageUrl" :src="img(item.imageUrl)" mode="aspectFill"
										:style="{ maxWidth: diyComponent.imageSize * 2 + 'rpx', maxHeight: diyComponent.imageSize * 2 + 'rpx', borderRadius: diyComponent.aroundRadius * 2 + 'rpx' }"/>
									<image v-else :src="img('static/resource/images/diy/figure.png')" mode="aspectFill"
									       :style="{ maxWidth: diyComponent.imageSize * 2 + 'rpx', maxHeight: diyComponent.imageSize * 2 + 'rpx', borderRadius: diyComponent.aroundRadius * 2 + 'rpx' }"/>

									<text
										class="tag absolute -top-[10rpx] -right-[24rpx] text-white rounded-[24rpx] rounded-bl-none transform scale-80 py-1 px-2 text-xs"
										v-if="item.label.control"
										:style="{ color: item.label.textColor, backgroundImage: 'linear-gradient(' + item.label.bgColorStart + ',' + item.label.bgColorEnd + ')' }">
										{{ item.label.text }}
									</text>
								</view>

								<text v-if="diyComponent.mode != 'img'"
									class="graphic-text w-full text-center truncate leading-normal"
									:class="{ 'pt-1.5' : diyComponent.mode != 'text' }"
									:style="{ fontSize: diyComponent.font.size * 2 + 'rpx', fontWeight: diyComponent.font.weight, color: diyComponent.font.color }">
									{{ item.title }}
								</text>
							</view>

						</view>
					</template>
				</swiper-item>
			</swiper>

			<scroll-view v-else :scroll-x="diyComponent.showStyle == 'singleSlide'" :class="['graphic-nav','graphic-nav-' + diyComponent.showStyle]" class=" py-[10rpx]">
				<!-- #ifdef MP -->
				<view class="uni-scroll-view-content">
				<!-- #endif -->

					<view class="graphic-nav-item" :class="{'flex-shrink-0' : diyComponent.showStyle == 'singleSlide'}"
						v-for="(item, index) in diyComponent.list" :key="item.id"
						:style="{ width: 100 / diyComponent.rowCount + '%' }">

						<view @click="toRedirect(item.link)" class="flex flex-col items-center box-border py-2">
							<view class="graphic-img relative flex items-center justify-center w-10 h-10"
								v-if="diyComponent.mode != 'text'"
								:style="{ width: diyComponent.imageSize * 2 + 'rpx', height: diyComponent.imageSize * 2 + 'rpx' }">
								<image v-if="item.imageUrl" :src="img(item.imageUrl)" mode="aspectFill"
									:style="{ maxWidth: diyComponent.imageSize * 2 + 'rpx', maxHeight: diyComponent.imageSize * 2 + 'rpx', borderRadius: diyComponent.aroundRadius * 2 + 'rpx' }"/>
								<image v-else :src="img('static/resource/images/diy/figure.png')" mode="aspectFill"
								       :style="{ maxWidth: diyComponent.imageSize * 2 + 'rpx', maxHeight: diyComponent.imageSize * 2 + 'rpx', borderRadius: diyComponent.aroundRadius * 2 + 'rpx' }"/>
								<text
									:class="['tag absolute -top-[10rpx] -right-[24rpx] text-white rounded-[24rpx] rounded-bl-none transform scale-80 py-1 px-2 text-xs']"
									v-if="item.label.control"
									:style="{ color: item.label.textColor, backgroundImage: 'linear-gradient(' + item.label.bgColorStart + ',' + item.label.bgColorEnd + ')' }">
									{{ item.label.text }}
								</text>
							</view>
							<text v-if="diyComponent.mode != 'img'"
								class="graphic-text w-full text-center truncate leading-normal"
								:class="{ 'pt-1.5' : diyComponent.mode != 'text' }"
								:style="{ fontSize: diyComponent.font.size * 2 + 'rpx', fontWeight: diyComponent.font.weight, color: diyComponent.font.color }">
								{{ item.title }}
							</text>
						</view>
					</view>

				<!-- #ifdef MP -->
				</view>
				<!-- #endif -->

			</scroll-view>

		</view>
	</view>
</template>

<script lang="ts" setup>
	// 图文导航
    import { ref,computed, watch, onMounted, nextTick,getCurrentInstance } from 'vue';
    import { img,redirect,diyRedirect, currRoute, getToken } from '@/utils/common';
	import useDiyStore from '@/app/stores/diy';
    import { useLogin } from '@/hooks/useLogin';

	const props = defineProps(['component', 'index', 'pullDownRefreshCount']);

	const diyStore = useDiyStore();

	const diyComponent = computed(() => {
		if (diyStore.mode == 'decorate') {
			return diyStore.value[props.index];
		} else {
			return props.component;
		}
	})

	const warpCss = computed(() => {
		var style = '';
        style += 'position:relative;';
        if(diyComponent.value.componentStartBgColor) {
            if (diyComponent.value.componentStartBgColor && diyComponent.value.componentEndBgColor) style += `background:linear-gradient(${diyComponent.value.componentGradientAngle},${diyComponent.value.componentStartBgColor},${diyComponent.value.componentEndBgColor});`;
            else style += 'background-color:' + diyComponent.value.componentStartBgColor + ';';
        }

        if(diyComponent.value.componentBgUrl) {
            style += `background-image:url('${ img(diyComponent.value.componentBgUrl) }');`;
            style += 'background-size: cover;background-repeat: no-repeat;';
        }

		if (diyComponent.value.topRounded) style += 'border-top-left-radius:' + diyComponent.value.topRounded * 2 + 'rpx;';
		if (diyComponent.value.topRounded) style += 'border-top-right-radius:' + diyComponent.value.topRounded * 2 + 'rpx;';
		if (diyComponent.value.bottomRounded) style += 'border-bottom-left-radius:' + diyComponent.value.bottomRounded * 2 + 'rpx;';
		if (diyComponent.value.bottomRounded) style += 'border-bottom-right-radius:' + diyComponent.value.bottomRounded * 2 + 'rpx;';
		return style;
	})

    // 背景图加遮罩层
    const maskLayer = computed(()=>{
        var style = '';
        if(diyComponent.value.componentBgUrl) {
            style += 'position:absolute;top:0;width:100%;';
            style += `background: rgba(0,0,0,${diyComponent.value.componentBgAlpha / 10});`;
            style += `height:${height.value}px;`;

            if (diyComponent.value.topRounded) style += 'border-top-left-radius:' + diyComponent.value.topRounded * 2 + 'rpx;';
            if (diyComponent.value.topRounded) style += 'border-top-right-radius:' + diyComponent.value.topRounded * 2 + 'rpx;';
            if (diyComponent.value.bottomRounded) style += 'border-bottom-left-radius:' + diyComponent.value.bottomRounded * 2 + 'rpx;';
            if (diyComponent.value.bottomRounded) style += 'border-bottom-right-radius:' + diyComponent.value.bottomRounded * 2 + 'rpx;';
        }

        return style;
    });

	watch(
		() => props.pullDownRefreshCount,
		(newValue, oldValue) => {
			// 处理下拉刷新业务
		}
	)

	const swiperIndex = ref(0);

	const swiperChange = e => {
		swiperIndex.value = e.detail.current;
	};

	const swiperCondition = (index, numItem) => {
		let count = diyComponent.value.pageCount * diyComponent.value.rowCount;
		let result = true;

		// #ifdef MP-WEIXIN
		result = index >= [(numItem) * (count)] && index < [(numItem + 1) * (count)];
		// #endif

		// #ifdef H5
		result = index >= [(numItem - 1) * (count)] && index < [numItem * (count)];
		// #endif

		return result;
	}

	const swiperHeight = ref('');

	const handleData = () => {
	    if(diyComponent.value.layout == 'horizontal' && diyComponent.value.showStyle == 'pageSlide') {
            var height = 0;
            const query = uni.createSelectorQuery().in(instance);
            query.select('.graphic-nav-item').boundingClientRect((data: any) => {
                height = data.height * diyComponent.value.pageCount;
                swiperHeight.value = (height * 2) + 'rpx';
            }).exec();
        }
	};

	onMounted(() => {
		refresh();
		// 装修模式下刷新
		if (diyStore.mode == 'decorate') {
			watch(
				() => diyComponent.value,
				(newValue, oldValue) => {
					if (newValue && newValue.componentName == 'GraphicNav') {
						refresh();
					}
				}
			)
		}
	});

    const instance = getCurrentInstance();
    const height = ref(0)

	const refresh = () => {
        nextTick(() => {
            handleData()
            const query = uni.createSelectorQuery().in(instance);
            query.select('.diy-graphic-nav').boundingClientRect((data: any) => {
                height.value = data.height;
            }).exec();
        })
	}

    const toRedirect = (data: {}) => {
        if (Object.keys(data).length) {
            if (!data.url) return;
            if (currRoute() == 'app/pages/member/index' && !getToken()) {
                useLogin().setLoginBack({ url: data.url })
                return;
            }
            diyRedirect(data);
        } else {
            redirect(data)
        }
    }
</script>

<style>
	/* 固定显示 */
	.graphic-nav-fixed>>>.uni-scroll-view-content {
		display: flex;
		flex-wrap: wrap;
	}

	/* 单行滑动 */
	.graphic-nav-singleSlide>>>.uni-scroll-view-content {
		display: flex;
	}
</style>
<style lang="scss" scoped>
</style>
