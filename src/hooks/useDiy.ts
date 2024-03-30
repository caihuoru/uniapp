import { ref, reactive, computed } from 'vue';
import { onLoad, onShow, onPullDownRefresh, onPageScroll } from '@dcloudio/uni-app';
import { getDiyInfo } from '@/app/api/diy';
import useDiyStore from '@/app/stores/diy';
import { useShare } from '@/hooks/useShare'

export function useDiy() {

    const loading = ref(true);
    const pullDownRefreshCount = ref(0)

    // 自定义页面 数据
    const diyData = reactive({
        pageMode: 'diy',
        title: '',
        global: {},
        value: []
    })

    const diyStore = useDiyStore();

    const { setShare } = useShare()

    const id = ref(0)
    const name = ref('')

    const onShowLifeCycle = async () => {

        console.log('on show life cycle',{
            id: id.value,
            name: name.value
        })

        // 装修模式
        if (diyStore.mode == 'decorate') {
            diyStore.init();
        } else {
            getDiyInfo({
                id: id.value,
                name: name.value
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
                    uni.setNavigationBarTitle({
                        title: diyData.title
                    })
                }

                let share = res.data.share ? JSON.parse(res.data.share) : null;
                setShare(share);

                loading.value = false;
            });
        }
    }

    return {
        id,
        name,
        loading,
        pullDownRefreshCount,
        diyData,
        onShowLifeCycle
    }
}
