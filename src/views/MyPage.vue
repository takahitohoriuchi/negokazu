<template>
	<v-app>
		<div class="about">
			<v-card class="mx-2 my-12">
				<v-card-title primary-title>
					<div>
						<h1 class="headline mb-0">診察券</h1>
						<v-divider></v-divider>
					</div>
				</v-card-title>
				<v-card-actions class="my-10">
					<!-- 名前 -->
					<v-row>
						<v-col cols="3"></v-col>
						<v-col cols="6"> <v-text-field outlined readonly v-model="memberDocData.name" :rules="[required]" label="名前"></v-text-field> </v-col>
						<v-col cols="3"></v-col>
					</v-row>
					<!-- カルテ番号 -->
				</v-card-actions>
			</v-card>
			<v-form v-model="valid" ref="profileform">
				<v-container v-if="isUpdated">
					<!-- 成功アラート -->
					<v-alert type="success" text>
						会員情報更新完了しました。２秒後にメインページにジャンプします！
						<!-- クルクル -->
						<v-progress-circular indeterminate color="primary"></v-progress-circular>
					</v-alert>
				</v-container>
				<!-- 送信ボタン -->
				<v-divider></v-divider>
				<v-btn x-large class="ma-10" color="primary" @click="doUpdate"><v-icon>mdi-account-sync</v-icon> 更新する</v-btn>
				<!-- 削除ボタン -->
				<v-divider></v-divider>
				<v-btn class="ma-10" dark color="black" @click="doDelete"><v-icon>mdi-account-remove</v-icon> この会員を削除する</v-btn>
			</v-form>
		</div>
	</v-app>
</template>

<script>
import { updateMemberDoc, deleteMemberDoc } from '@/modules/utils.js'
import /* onAuthStateChanged */ 'firebase/auth'
import /* auth */ /* authStateChanged,  */ /* getadminUserInfo */ '../modules/admin.js'
// NOTE:getLIFFInfo } from '../modules/liff.js'

export default {
	name: 'MyPageView',
	// SECTION:コンポーネント
	components: {},
	// SECTION:変数
	data() {
		return {
			memberDocData: {},
			LINEuID: null,
			isAdmin: false,
			isLIFF: false,
			// disableItems: [],//NOTE:会員自身が編集できない項目名。
			year: null,
			month: null,
			day: null,
			valid: false,
			isUpdated: false,
			// Emailルール。「@」がなかったら、注意
			emailRule: (v) => /.+@.+/.test(v) || 'メールアドレスが正しくありません',
			// 入力必須ですルール
			required: (v) => !!v || '必ず入力してください', // 入力必須の制約
			// 半角数字ルール
			isInt: (v) => !isNaN(Number(v)) || '半角の数字で入力してください',
			// 文字数上限ルール
			limitLength: (v) => v.length <= 100 || '100文字以内で入力してください', // 文字数の制約
		}
	},
	validation: {
		memberDocData: {
			name: false,
			mailAddress: false,
			phoneNumber: false,
			// note: true,
		},
	},
	props: {
		isAdmin0: Boolean,
		memberDocData0: Object,
		LINEuID0: String,
	},
	// SECTION:関数f
	methods: {
		async doUpdate() {
			console.log('送信ボタンが押されたよ')
			// NOTE:validate()関数は、Promiseオブジェクトを返す

			// SECTION:validation通過時
			if (this.$refs.profileform.validate()) {
				// 必須項目埋まってたら
				console.log('validationの結果成功です')
				// 【生年月日(birthday)】
				this.memberDocData.birthday = this.year + '年' + this.month + '月' + this.day + '日'
				try {
					const memberID = this.memberDocData.memberID
					/* NOTE:
					updateは、memberDocにネストした項目がある場合は注意
					updateDataを、「更新部分だけ」にする。			
					*/
					const updateData = this.memberDocData
					await updateMemberDoc(memberID, updateData)
					// let self = this
					this.isUpdated = true
					location.reload()
				} catch (error) {
					console.log(error)
				}
			}
			// SECTION:validation失敗時
			else {
				alert('必須事項はすべて埋めてください！')
				console.log('validation失敗')
			}
		},
		async doDelete() {
			if (confirm('本当に削除しますか？（データは復元できません）')) {
				try {
					const memberID = this.memberDocData.memberID
					await deleteMemberDoc(memberID)
					console.log('削除完了')
					location.reload()
				} catch (error) {
					console.log(error)
				}
			}
		},
		// 解約するボタンがあってもいい
	},
	// SECTION:ビュー読み込み前処理
	beforeCreate: async function () {},
	created: async function () {
		this.memberDocData = this.$memDocData
		if (!this.memberDocData) {
			this.memberDocData = this.memberDocData0
		}
		this.LINEuID = this.$LINEuID
		this.isAdmin = this.$isAdmin
		console.log('this.memberDocData: ', this.memberDocData)
		console.log('this.LINEuID: ', this.LINEuID)
		console.log('this.isAdmin: ', this.isAdmin)
		if (this.LINEuID && !this.memberDocData && !this.isAdmin) {
			console.log('会員登録ページにpushします')
			this.$router.push({ name: 'subscribe' })
		}
		const birthday = this.memberDocData.birthday
		console.log('bithday: ', birthday)
		this.year = birthday.split('年')[0]
		this.month = birthday.split('年')[1].split('月')[0]
		this.day = birthday.split('年')[1].split('月')[1].split('日')[0]
	},
	mounted() {
		// onAuthStateChanged(auth, (user) => {
		// 	if (user) {
		// 		// this.adminUserInfo = user
		// 		// console.log('this.adminUserInfo: ', this.adminUserInfo)
		// 		// this.$router.push({name: 'home', params:{adminUserInfo: this.adminUserInfo}})
		// 	} else {
		// 		console.log('adminログアウトしました')
		// 	}
		// })
	},
}
</script>