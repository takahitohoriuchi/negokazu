<template>
	<div class="about">
		<h1>This is an about page</h1>
	</div>
</template>

<script>
// NOTE:import文をここに書く
import { liff, liffID } from '../modules/liff.js'

export default {
	name: 'AboutView',
	// SECTION:コンポーネント
	components: {},
	// SECTION:変数
	data() {
		return {
			LINEuID: '',
			isLIFF: false,
		}
	},
	// SECTION:関数
	methods: {},
	// SECTION:ビュー読み込み前処理
	beforeCreate: async function () {
		liff.init({
			liffId: liffID,
		}).then(async () => {
			this.isLIFF = liff.isInClient()
			console.log('アンタいまLIFFブラウザで開いてる？: ', this.isLIFF)
			this.LINEuID = await liff.getProfile()
			console.log('アンタのLINEuIDは: ', this.LINEuID)
		})
	},
}
</script>
