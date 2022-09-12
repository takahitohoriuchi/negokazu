<template>
	<v-app>
		<v-app-bar app color="primary" dark>
			<div class="d-flex align-center">
				<v-img alt="ここにロゴ" class="shrink mr-2" contain src="@/assets/logo.png" transition="scale-transition" width="100" />
			</div>
			<v-spacer></v-spacer>
			<h4 v-if="commonParams.isAdmin0">※管理者ログイン中</h4>
			<v-spacer></v-spacer>
			<!-- KEY:開発用ラジオボタン -->
			<v-radio-group row v-model="devAccount" @change="switchDevAccount">
				<v-radio label="ダミー会員として" value="ダミーユーザー"></v-radio>
				<v-radio label="管理者として" value="管理人"></v-radio>
			</v-radio-group>
			<v-app-bar-nav-icon @click.stop="showMenu"></v-app-bar-nav-icon>
			<!-- SECTION:ナビゲーション -->
		</v-app-bar>
		<!-- KEY:ルーターナビゲーション -->
		<v-navigation-drawer right v-model="drawer" absolute temporary>
			<v-list nav dense>
				<v-list-item-group active-class="blue--text text--accent-4">
					<v-list-item
						@click="
							$router.push({
								name: 'home',
								params: commonParams,
							})
						"
					>
						<v-list-item-title>HOME</v-list-item-title>
					</v-list-item>
					<v-list-item
						v-if="!commonParams.isAdmin0"
						@click="
							$router.push({
								name: 'mypage',
								params: commonParams,
							})
						"
					>
						<v-list-item-title>マイページ</v-list-item-title>
					</v-list-item>

					<v-list-item
						v-if="commonParams.isAdmin0"
						@click="
							$router.push({
								name: 'admin',
								params: commonParams,
							})
						"
					>
						<v-list-item-title>管理人ページ</v-list-item-title>
					</v-list-item>
				</v-list-item-group>
			</v-list>
		</v-navigation-drawer>

		<v-main>
			<router-view />
		</v-main>
	</v-app>
</template>

<script>
import { getLIFFInfo } from './modules/liff'
import { getMemberDocDataWithLINEuID } from './modules/utils'

export default {
	name: 'App',
	data: () => ({
		// ３つの基本変数（三種の神器）
		commonParams: {
			isAdmin0: false,
			memberDocData0: {},
			LINEuID0: null,
		},
		// メニュー展開するかいなか
		drawer: false,
		// ラジオボタン
		devAccount: '管理人',
	}),
	methods: {
		// ナビゲーションメニュー
		showMenu() {
			this.$vuetify.goTo(0) //一番上までスクロール
			this.drawer = !this.drawer //ドロワー表示
		},
		// 開発中アカウントをスイッチする（管理人⇆ダミーユーザー）
		async switchDevAccount() {
			if (this.devAccount == '管理人') {
				this.$isAdmin = true
				this.$LINEuID = await getLIFFInfo()
				this.$memDocData = null
			} else {
				this.$isAdmin = false
				this.$LINEuID = 'dummy'
				this.$memDocData = await getMemberDocDataWithLINEuID(this.$LINEuID)
			}
			this.commonParams.isAdmin0 = this.$isAdmin
			this.commonParams.memberDocData0 = this.$memDocData
			this.commonParams.LINEuID0 = this.$LINEuID
			console.log('アカウントスイッチ！')
			console.log('this.commonParams: ', this.commonParams)
		},
	},
	created: async function () {
		this.commonParams = {
			isAdmin0: this.$isAdmin,
			memberDocData0: this.$memDocData,
			LINEuID0: this.$LINEuID,
		}
		console.log('commonParams@App.vue（三種の神器）: ', this.commonParams)
		this.devAccount = this.commonParams.isAdmin0 ? '管理人' : 'ダミーユーザー'
	},
}
</script>

<style>
/* NOTE:テスト（16進数で色チェックしたいためだけにある） */
#test {
	color: #d2bc40;
	color: #89d2ca;
	color: #dc395f;
}

#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
}

nav {
	padding: 30px;
	color: #dc395f;
}

nav a {
	font-weight: bold;
	color: #2c3e50;
}

nav a.router-link-exact-active {
	color: #dc395f;
}
</style>