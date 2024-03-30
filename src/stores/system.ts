import { defineStore } from 'pinia'
import { getSiteInfo } from '@/app/api/system'
import { redirect } from '@/utils/common'

interface System {
	site : AnyObject | null,
	siteApps: string[],
	siteAddons: string[]
}

const useSystemStore = defineStore('system', {
	state: () : System => {
		return {
			site: null,
			siteApps: [],
			siteAddons: []
		}
	},
	actions: {
		async getSiteInfoFn() {
			await getSiteInfo().then((res: any) => {
				this.site = res.data
				this.siteApps = res.data.app
				this.siteAddons = res.data.site_addons.map((item: AnyObject) => {
					return item.key
				})
				if (!this.site || this.site.status == 3) redirect({url: '/app/pages/index/close', mode: 'reLaunch'})
			}).catch((err) => {
				redirect({url: '/app/pages/index/nosite', mode: 'reLaunch'})
			})
		}
	}
})

export default useSystemStore
