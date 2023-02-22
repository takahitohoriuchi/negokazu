import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'

// DB初期読み込みのモジュールたち
// import axios from 'axios'
import { getLIFFInfo } from './modules/liff.js'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/modules/authentication.js'
// import /* getMemberDocDataWithMemberID */ /* getMemberDocDataWithLINEuID */ '@/modules/utils'
// :::
// export const PROXY_URL = 'https://app20221209-ekxiuvbmya-an.a.run.app'
// export const SERVER_URL = 'http://localhost:8080'
export const SERVER_URL = 'https://ver202301262-yznocuz53q-an.a.run.app'
export const adminEmails = ['test@gmail.com', 'kudamonx@gmail.com']
// console.log('PROXY_URL(main.js): ', PROXY_URL)
// :::

Vue.config.productionTip = false

/**
 * この関数内で、グローバル変数も宣言（最初にDBから読み込んでおいて、どのページでも使いたい変数など。）
 * NOTE:コンポからグローバル変数を参照するには、「this.$変数名」で取得。
 */
async function init() {
	onAuthStateChanged(auth, async (user) => {
		console.log('--------------------\n\n↓↓↓初期化情報↓↓↓\n\n--------------------')
		if (user) {
			console.log('ログイン済みです（@main.js）')
			console.log('user: ', user.email)
			// NOTE:↓本番用
			Vue.prototype.$isAdmin = true
			Vue.prototype.$LINEuID = null
			Vue.prototype.$memDocData = null
			Vue.prototype.$isSpecialAdmin = adminEmails.includes(user.email) ? true : false
			// NOTE:↓開発用でダミーLINEユーザーとして
			// Vue.prototype.$isAdmin = false
			// Vue.prototype.$LINEuID = 'dummy5'
			// Vue.prototype.$memDocData = await getMemberData(Vue.prototype.$LINEuID)
			// memDocDataを読み込んだあとに、Vueインスタンスを生成する
			new Vue({
				router,
				vuetify,
				render: (h) => h(App),
			}).$mount('#app')
		} else {
			console.log('未ログイン状態です')
			Vue.prototype.$isSpecialAdmin = false
			Vue.prototype.$isAdmin = false
			console.log('Vue.prototype.$isAdmin: ', Vue.prototype.$isAdmin)
			// LIFFブラウザで開いてるかどうかチェックする
			Vue.prototype.$LINEuID = await getLIFFInfo()
			// NOTE:PCでの開発中は、↓のダミーLINEuIDをONにする（getLIFFInfo()ではなく）
			// Vue.prototype.$LINEuID = 'dummy3'
			console.log('Vue.prototype.$LINEuID: ', Vue.prototype.$LINEuID)
			// LIFFブラウザだったら、LINEuIDをクエリにmemberDoc取得してみる
			if (Vue.prototype.$LINEuID) {
				console.log('LIFFブラウザから開いています')
				// Marketo APIをたたいて、memberDataを取得
				// Vue.prototype.$memDocData = await getMemberData(Vue.prototype.$LINEuID)
				// console.log('Vue.prototype.$memDocData: ', Vue.prototype.$memDocData)
				// ここでmemberDocをアップデートしたりする（Ex:会員のもってるチケットの有効期限をチェックして削除とか）
			} else {
				console.log('通常ブラウザから開いています')
			}

			new Vue({
				router,
				vuetify,
				render: (h) => h(App),
			}).$mount('#app')
		}
		console.log('Vue.prototype.$isAdmin: ', Vue.prototype.$isAdmin)
		console.log('Vue.prototype.$LINEuID: ', Vue.prototype.$LINEuID)
		console.log('Vue.prototype.$memDocData: ', Vue.prototype.$memDocData)
		console.log('--------------------\n\n↑↑↑初期化情報↑↑↑\n\n--------------------')
	})
}

// async function getMemberData(_LINEuID) {}

init()
