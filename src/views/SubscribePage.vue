<template>
	<v-app>
		<div class="subscribe">
			<h1>This is an subscribe page</h1>
			<v-form v-model="valid" ref="profileform">
				<v-divider></v-divider>
				<v-container>
					<!-- <h2>公開情報</h2> -->
					<!-- 名前-->
					<v-row
						><v-col cols="8"> <v-text-field v-model="memberDocData.name" :rules="[required]" label="名前"></v-text-field> </v-col
					></v-row>
					<!-- 住所 -->
					<v-row
						><v-col cols="8"> <v-text-field v-model="memberDocData.address" :rules="[required]" label="住所"></v-text-field> </v-col
					></v-row>
					<!-- 生年月日 -->
					<v-row>
						<v-col cols="3"><v-text-field v-model="year" label="年" :rules="[required, isInt]"></v-text-field></v-col>
						<v-col cols="3"><v-text-field v-model="month" label="月" :rules="[required, isInt]"></v-text-field></v-col>
						<v-col cols="3"><v-text-field v-model="day" label="日" :rules="[required, isInt]"></v-text-field></v-col>
						<!-- TODO:文字を下揃えにする -->
						<v-col cols="3"><p>生まれ</p></v-col>
					</v-row>
					<!-- メールアドレス-->
					<v-row
						><v-col cols="8">
							<v-text-field v-model="memberDocData.mailAddress" :rules="[required, emailRule]" label="メールアドレス"></v-text-field> </v-col
					></v-row>
					<!-- 電話番号-->
					<v-row
						><v-col cols="8"> <v-text-field v-model="memberDocData.phoneNumber" :rules="[required, isInt]" label="電話番号"></v-text-field> </v-col
					></v-row>
					<!-- 備考（100文字以内でお願いします） -->
					<v-textarea
						v-model="memberDocData.note"
						name="input-7-1"
						filled
						:rules="[limitLength]"
						auto-grow
						label="備考・連絡欄（任意）"
						:counter="100"
					></v-textarea>
				</v-container>
				<v-divider></v-divider>

				<!-- SECTION:（登録成功時のみ表示する） -->
				<v-container v-if="isSubscribed">
					<!-- 成功アラート -->
					<v-alert type="success" text>
						会員登録完了しました。一度このアプリ（ウィンドウ）を閉じて、もう一度開き直してください！
						<!-- クルクル -->
						<v-progress-circular indeterminate color="primary"></v-progress-circular>
					</v-alert>
				</v-container>
				<!-- SECTION:送信ボタン -->
				<v-divider></v-divider>
				<v-btn x-large class="ma-10" color="primary" @click="submit"><v-icon>mdi-account-plus</v-icon> 登録する</v-btn>
			</v-form>
		</div>
	</v-app>
</template>

<script>
// NOTE:import文をここに書く
import /* getLIFFInfo */ '../modules/liff.js'
import /*getCollectionRef, getDocSnaps,*/ '../modules/firestore.js'
import { sleep, setNewMemberDoc } from '@/modules/utils.js'

export default {
	name: 'SubscribeView',
	// SECTION:コンポーネント
	components: {},
	// SECTION:変数
	data() {
		return {
			LINEuID: '',
			isLIFF: false,
			isSubscribed: false,
			memberDocData: {
				// memberID: '',
				name: '',
				address: '',
				birthday: '',
				LINEuID: '',
				mailAddress: '',
				phoneNumber: '',
				note: '',
				exist: true,
			},
			year: null,
			month: null,
			day: null,
			valid: false,
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
		},
	},
	// SECTION:関数
	methods: {
		async submit() {
			console.log('送信ボタンが押されたよ')
			// 必須項目がすべて埋まってるかどうかをcheck
			// NOTE:validate()関数は、Promiseオブジェクトを返す
			// SECTION:validation通過時
			if (this.$refs.profileform.validate()) {
				// 必須項目埋まってたら
				console.log('validationの結果成功です')
				// 【生年月日(birthday)】
				this.memberDocData.birthday = this.year + '年' + this.month + '月' + this.day + '日'
				try {
					await setNewMemberDoc(this.memberDocData)
					let self = this
					/* NOTE:
						子コンポでは、名前つき関数のなかで「this.$router.push」を呼ぶと、「そんなrouterなんか未定義だよ」とエラー
						よって、この関数のはじめでself = thisを定義しとく必要がある
						*/
					this.isSubscribed = true
					sleep(2, function () {
						self.$router.push({ name: 'home', params: { myMemberID: self.memberDocData.memberID } })
					})
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
	},

	// SECTION:ビュー読み込み前処理
	created() {
		this.memberDocData.LINEuID = this.$LINEuID		
	},
	mounted() {},
}
</script>