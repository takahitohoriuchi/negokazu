<template>
	<v-app class="vuetext application">
		<div class="title-bar">
			<h1 class="my-5">みんなで繋ごう<br>エクレベの輪<br />(賛同申請フォーム)</h1>
			<v-conainer><v-row justify="center">
				<v-img lazy-src="../assets/TwE-logo-JP.svg" max-height="220" max-width="220" src="../assets/TwE-logo-JP.svg"></v-img>
			</v-row></v-conainer>
			
			<!-- :::開発用 -->
			<!-- <v-divider></v-divider>
				<v-btn x-large class="ma-10" color="primary" @click="testSubmit"><v-icon>mdi-account-plus</v-icon> テスト送信する</v-btn>
				<v-btn x-large class="ma-10" color="primary" @click="deleteTestData"><v-icon>mdi-account-plus</v-icon> テストデータ削除</v-btn> -->
			<!-- :::開発用 -->
			<div>
				<p class="my-5">みんなで繋ごうエクレベの輪 エクストレベルと小動物の未来を築こう</p>
				<v-container>
					<v-row class="mb-5" justify="center">
						<v-btn large text dark color="#bfa379" @click="go2Website()"><v-icon>mdi-alert-circle</v-icon>賛同の条件を確認</v-btn>
					</v-row>
				</v-container>
			</div>
			<!-- <v-container>				
				<p class="text-justify">
						日本に事業登録がある「小動物向けイベント主催者様」「ウサギやヤギなど草食動物を飼育する施設・動物学校・動物病院・ペットカフェ」様などであれば「みんなで繋ごうエクレベの輪」に賛同することが出来ます。賛同すると”牧草の無償提供”、”イベント費用の援助”、”イベント時の商品提供”をエクストレベルが支援・協賛いたします。以下の1~5全てに該当する場合はフォームより賛同申請を行ってください。
					</p>
					<p class="text-justify">・日本国内に法人登録がある。</p>
					<p class="text-justify">・牧草の販売を行っていない。（イベント時などは除く）</p>
					<p class="text-justify">・協賛牧草を販売目的で使用しない。</p>
					<p class="text-justify">・一般のお客様を受付可能な店舗または設備を設けている。</p>
					<p class="text-justify">・事業内容が草食動物に関連している。または、事業場所で草食動物を複数飼育している。</p>
			</v-container> -->
		</div>
		<!-- :::フォーム -->
		<div class="vuetext my-5">
			<v-form v-model="valid" ref="profileform">
				<v-container>
					<!-- 法人名*-->
					<v-row
						><v-col cols="8"> <v-text-field outlined v-model="memberDocData.campanyName" :rules="[required]" label="法人名"></v-text-field> </v-col
					></v-row>
					<!-- 法人番号*-->
					<v-row
						><v-col cols="8">
							<v-text-field
								outlined
								v-model="memberDocData.campanyNumber"
								:rules="[required, isInt, campanyNumber]"
								label="法人番号"
							></v-text-field> </v-col
					></v-row>
					<!-- web site*-->
					<v-row
						><v-col cols="8">
							<v-text-field outlined v-model="memberDocData.websiteURL" :rules="[required]" label="webサイトURL"></v-text-field> </v-col
					></v-row>
					<!-- 電話番号（ハイフンなし）*-->
					<v-row
						><v-col cols="8">
							<v-text-field
								outlined
								v-model="memberDocData.phoneNumber"
								:rules="[required, isInt]"
								label="電話番号（ハイフンなし）"
							></v-text-field> </v-col
					></v-row>
					<!-- メールアドレス*-->
					<v-row
						><v-col cols="8">
							<v-text-field
								outlined
								v-model="memberDocData.mailAddress"
								:rules="[required, emailRule]"
								label="メールアドレス"
							></v-text-field> </v-col
					></v-row>
					<!-- 担当者名 -->
					<v-row
						><v-col cols="8">
							<v-text-field outlined v-model="memberDocData.managerName" :rules="[required]" label="担当者名"></v-text-field> </v-col
					></v-row>
					<!-- 郵便番号* -->
					<v-row
						><v-col cols="5">
							<v-text-field
								outlined
								v-model="memberDocData.postalCode"
								:rules="[required, isInt]"
								label="郵便番号（ハイフンなし半角数字）"
							></v-text-field> </v-col
						><v-col cols="3"><v-btn @click="getAddressFromPostalCode(0)">郵便番号から所在地検索</v-btn></v-col>
					</v-row>
					<!-- 会社所在地（都道府県）* -->
					<v-row
						><v-col cols="8">
							<v-text-field outlined v-model="memberDocData.prefecture" :rules="[required]" label="会社所在地（都道府県）"></v-text-field> </v-col
					></v-row>
					<!-- 会社所在地（市区町村）* -->
					<v-row
						><v-col cols="8">
							<v-text-field outlined v-model="memberDocData.city" :rules="[required]" label="会社所在地（市区町村）"></v-text-field> </v-col
					></v-row>
					<!-- 会社所在地（番地以降）* -->
					<v-row
						><v-col cols="8"
							><v-text-field outlined v-model="memberDocData.address" :rules="[required]" label="会社所在地（それ以降）"></v-text-field> </v-col
					></v-row>

					<!-- イベントタイプ -->
					<v-row>
						<v-col cols="8">
							<v-select
								label="みんなで繋ごうエクレベの輪を以下のどちらで活用しますか？"
								v-model="memberDocData.eventInfo.eventType"
								:items="eventTypeItems"
								:rules="[required]"
							></v-select>
						</v-col>
					</v-row>
					<v-row v-if="memberDocData.eventInfo.eventType == '(1) 既存のイベントに企画として行う'">
						<v-col cols="8">
							<v-text-field outlined label="イベント名を教えてください" v-model="memberDocData.eventInfo.eventName"></v-text-field
						></v-col>
					</v-row>
					<!-- イベント実施予定場所 -->
					<v-row>
						<v-col cols="8">
							<v-select
								label="イベント実施予定場所"
								v-model="memberDocData.eventInfo.eventPlaceCategory"
								:items="eventPlaceItems"
								:rules="[required]"
							></v-select>
						</v-col>
					</v-row>
					<!-- イベント実施予定回数 -->
					<v-row>
						<v-col cols="8">
							<v-select
								label="イベント実施予定回数"
								v-model="memberDocData.eventInfo.eventFrequency"
								:items="eventFrequencyItems"
								:rules="[required]"
							></v-select>
						</v-col>
					</v-row>
					<!-- イベント目的 -->
					<v-row>
						<v-col cols="8">
							<v-select
								multiple
								chips
								label="賛同の主な目的(複数可)"
								v-model="memberDocData.eventInfo.eventAims"
								:items="eventAimsItems"
								:rules="[required]"
							></v-select>
						</v-col>
					</v-row>
					<!-- イベント目的（その他がある場合） -->
					<v-row v-if="memberDocData.eventInfo.eventAims.includes('その他')">
						<v-col cols="8">
							<v-text-field
								outlined
								label="賛同の主な目的（その他を選んだ方）"
								placeholder="↑で「その他」を選んだ方はここに目的をお書きください"
								v-model="memberDocData.eventInfo.eventOtherAim"
							></v-text-field>
						</v-col>
					</v-row>
					<!-- イベント郵便番号 -->
					<v-row>
						<v-col cols="5">
							<v-text-field
								outlined
								label="郵便番号（事業所以外でイベント実施予定の方）"
								placeholder="開催地が複数ある場合はメインの開催地を記入"
								v-model="memberDocData.eventInfo.postalCode"
							></v-text-field
						></v-col>
						<v-col cols="3"><v-btn @click="getAddressFromPostalCode(1)">郵便番号から所在地検索</v-btn></v-col>
					</v-row>
					<!-- イベント都道府県 -->
					<v-row>
						<v-col cols="8">
							<v-text-field
								outlined
								label="都道府県（事業所以外でイベント実施予定の方）"
								placeholder="開催地が複数ある場合はメインの開催地を記入"
								v-model="memberDocData.eventInfo.prefecture"
							></v-text-field
						></v-col>
					</v-row>
					<!-- イベント市区町村 -->
					<v-row>
						<v-col cols="8">
							<v-text-field
								outlined
								label="市区町村（事業所以外でイベント実施予定の方）"
								placeholder="開催地が複数ある場合はメインの開催地を記入"
								v-model="memberDocData.eventInfo.city"
							></v-text-field
						></v-col>
					</v-row>
					<!-- イベント番地以降 -->
					<v-row>
						<v-col cols="8">
							<v-text-field
								outlined
								label="それ以降（事業所以外でイベント実施予定の方）"
								placeholder="開催地が複数ある場合はメインの開催地を記入"
								v-model="memberDocData.eventInfo.address"
							></v-text-field
						></v-col>
					</v-row>
					<v-row>
						<v-checkbox v-model="check" :rules="[required]" label="理解したうえで申請内容に偽りはありません。"></v-checkbox>
					</v-row>

					<!-- 備考（100文字以内でお願いします） -->
					<!-- <v-textarea
					v-model="memberDocData.note"
					name="input-7-1"
					filled
					:rules="[limitLength]"
					auto-grow
					label="備考・連絡欄（任意）"
					:counter="100"
				></v-textarea> -->
				</v-container>
				<v-divider></v-divider>
				<!-- SECTION:（登録成功時のみ表示する） -->
				<!-- </v-row> -->
				<!-- 登録中アラート -->
				<!-- <v-alert color="blue-grey" dark :value="isNowLoading">登録中...</v-alert> -->
				<!-- 成功アラート -->
				<v-alert type="success" :value="isSubscribed" text>
					申請送信完了しました。審査結果の通知をお待ちください！
					<!-- クルクル -->
					<!-- <v-progress-circular indeterminate color="primary"></v-progress-circular> -->
				</v-alert>
				<!-- SECTION:送信ボタン -->
				<v-divider></v-divider>
				<v-btn v-if="!isSubscribed" x-large class="ma-5" color="primary" @click="submit"><v-icon>mdi-account-plus</v-icon> 申請する</v-btn>

				<v-container>
					<p class="text-justify">
						審査期間は申請から最大3週間ほどお時間を要します。フォームに入力された情報は「みんなで繋ごうエクレベの輪」関連する事に使用いたします。本ページの同意にチェックを入れ送信された時点で同意したものとみなします。弊社の賛同基準を満たしていない、或いはイベント企画に沿わない場合は残念ながら協賛・支援等はいたしかねます。その場合の通知はございませんので予めご了承ください。審査結果により弊社が協賛・支援等を行う事業者様のみ、本日から3週間以内に担当からお電話かメールでご連絡いたします。
					</p>
				</v-container>
			</v-form>
		</div>
	</v-app>
</template>

<script>
// NOTE:import文をここに書く
import /* getLIFFInfo */ '../modules/liff.js'
import /*getCollectionRef, getDocSnaps,*/ '../modules/firestore.js'
import { deleteMemberDoc, setNewMemberDoc } from '@/modules/utils.js'
import {SERVER_URL} from '@/main.js'
import { genHashID } from '@/modules/otherUtils'
// const SERVER_URL = 'http://localhost:8080'
// const SERVER_URL = 'https://ver20230122-yznocuz53q-an.a.run.app'
import axios from 'axios'
// import {PROXY_URL} from '../main.js'

export default {
	name: 'ApplicationView',
	// SECTION:コンポーネント
	components: {},
	// SECTION:変数
	data() {
		return {
			LINEuID: '',
			isLIFF: false,
			isSubscribed: false,
			isNowLoading: false,
			memberDocData: {
				memberID: '', //事業者に割り振るID
				applicationTs: null, //申請日時
				examinationResultMailLog: [],
				status: '未対応', //未対応、許可、ダメ
				password: '', //イベント報告フォーム閲覧用パスワード
				campanyName: '', //法人名
				campanyNumber: '', //法人番号
				websiteURL: '', //webサイトURL,
				phoneNumber: '',
				mailAddress: '',
				managerName: '', //担当者名
				postalCode: '', //郵便番号
				prefecture: '', //住所（都道府県）
				city: '', //住所（市区町村）
				address: '', //住所（番地など。市区町村以降。）,
				events: [],
				eventAddresses: [],
				eventInfo: {
					eventType: null, //みんなで繋ごうエクレべの輪を以下のどちらで活用しますか？
					eventName: null, //イベント名（↑が1の場合だけ）
					eventPlaceCategory: '', //イベント実施予定場所（店舗/施設/会場）
					eventFrequency: '', //イベント実施予定回数（1ヶ月に1回 / 2ヶ月に一回 / 数ヶ月間隔 / どれも当てはまらない）
					eventAims: [], //イベント目的：（集客 / 価値向上 / 経費削減 / その他）
					eventOtherAim: '', //イベント目的（↑で「その他」を選択した場合のみ）
					postalCode: '', // 郵便番号（事業所以外の場合。開催地複数なら、メインの開催地）
					prefecture: '', // 都道府県（事業所以外の場合。開催地複数なら、メインの開催地）
					city: '', //市区町村（事業所以外の場合。開催地複数なら、メインの開催地）
					address: '', // 番地以降（事業所以外の場合。開催地複数なら、メインの開催地）
				},

				// exist: true,
			},
			eventTypeItems: ['(1) 既存のイベントに企画として行う', '(2) メインイベントとして活用'],
			eventPlaceItems: ['店舗', '施設', '会場'],
			eventFrequencyItems: ['1ヶ月に1回', '2ヶ月に1回', '数ヶ月間隔', 'その他'],
			eventAimsItems: ['集客', '価値向上', '経費削減', 'その他'],
			check: false,
			valid: false,
			// Emailルール。「@」がなかったら、注意
			emailRule: (v) => /.+@.+/.test(v) || 'メールアドレスが正しくありません',
			// 入力必須ですルール
			required: (v) => !!v || '必ず入力してください', // 入力必須の制約
			// 半角数字ルール
			isInt: (v) => !isNaN(Number(v)) || '半角の数字で入力してください',
			// 文字数上限ルール
			limitLength: (v) => v.length <= 100 || '100文字以内で入力してください', // 文字数の制約
			// 法人番号ルール
			campanyNumber: (v) => v.length == 13 || '半角13桁の番号で入力してください',
		}
	},
	validation: {
		memberDocData: {
			memberID: false,
			password: false,
			campanyName: false,
			campanyNumber: false,
			websiteURL: false,
			phoneNumber: false,
			mailAddress: false,
			postalCode: false,
			prefecture: false,
			city: false,
			address: false,
		},
	},
	// SECTION:関数
	methods: {
		// 郵便番号から住所を検索する
		async getAddressFromPostalCode(_num) {
			const URL = 'https://zipcloud.ibsnet.co.jp/api/search'
			const postalCode = _num == 0 ? this.memberDocData.postalCode : this.memberDocData.eventInfo.postalCode
			try {
				const res = await axios.get(URL, {
					params: {
						zipcode: postalCode,
					},
				})
				if (res.status == '200') {
					console.log('成功')
					console.log('res: ', res)
					const result = res.data.results[0]
					if (_num == 0) {
						this.memberDocData.prefecture = result.address1
						this.memberDocData.city = result.address2
						this.memberDocData.address = result.address3
					} else if (_num == 1) {
						this.memberDocData.eventInfo.prefecture = result.address1
						this.memberDocData.eventInfo.city = result.address2
						this.memberDocData.eventInfo.address = result.address3
					}
				} else {
					alert('郵便番号が正しくありません')
				}
			} catch (error) {
				console.log(error)
			}
		},
		// 送信する
		async submit() {
			if (confirm('申請してよいですか？')) {
				console.log('送信ボタンが押されたよ')

				// 必須項目がすべて埋まってるかどうかをcheck
				if (this.$refs.profileform.validate()) {
					// 必須項目埋まってたら
					console.log('validationの結果成功です')
					this.isNowLoading = true
					this.memberDocData.password = genHashID()
					this.memberDocData.memberID = genHashID()
					this.memberDocData.applicationTs = new Date().getTime()

					Object.entries(this.memberDocData.eventInfo).forEach((kAndV) => {
						const k = kAndV[0]
						const v = kAndV[1]
						if (k == 'postalCode' || k == 'prefecture' || k == 'city' || k == 'address') {
							if (v == '' || v == null) {
								this.memberDocData.eventInfo[k] = this.memberDocData[k]
							}
						}
					})
					try {
						const result = await setNewMemberDoc(this.memberDocData, this.memberDocData.memberID)
						if (result) {
							this.isSubscribed = true
							console.log('this.isSubscribed: ', this.isSubscribed)
						}

						console.log('sendLetYouHoldEmail起動')
						// サーバーにPOSTする！！！
						const URL = `${SERVER_URL}/application-form`
						const options = {
							params: {
								memberID: this.memberDocData.memberID,
								mailAddress: this.memberDocData.mailAddress,
							},
						}
						console.log('options: ', options)
						const res = await axios.post(URL, options)
						console.log('res.data: ', res.data)
						// 更新完了のアラート
						if (res.data.success == true) {
							console.log('更新完了')
							this.isUpdated = true
						}
					} catch (error) {
						console.log(error)
					}
				}
				// SECTION:validation失敗時
				else {
					alert('必須事項はすべて埋めてください！')
					console.log('validation失敗')
				}
			}
		},
		// 賛同申請条件のページへとぶ
		async go2Website() {
			const url = 'https://timothy.extolevel.shop/premium-series/together-with-extolevel-business/#terms'
			window.location.href = url // 通常の遷移
			window.open('パス名', '_blank') // 新しいタブを開き、ページを表示
		},
		// :::【開発用機能】
		// ダミー会員登録
		async testSubmit() {
			// 各種うめる
			// this.memberDocData.password = genHashID()
			// this.memberDocData.memberID = genHashID()
			// this.memberDocData.applicationTs = new Date().getTime()
			this.memberDocData = {
				memberID: 'test',
				applicationTs: new Date().getTime(),
				examinationResultMailLog: [],
				status: '未対応', //未対応、許可、ダメ
				password: genHashID(),
				campanyName: 'テストカンパニー', //法人名
				campanyNumber: '2222222222222', //法人番号
				websiteURL: 'google.com', //webサイトURL,
				phoneNumber: '09011111111',
				mailAddress: '	',
				managerName: 'TaroTest', //担当者名
				postalCode: '2140037', //郵便番号
				prefecture: '神奈川県', //住所（都道府県）
				city: '川崎市多摩区', //住所（市区町村）
				address: '西生田1-1-1', //住所（番地など。市区町村以降。）,
				events: [],
				eventAddresses: [],
				eventInfo: {
					eventType: '(2) メインイベントとして活用', //みんなで繋ごうエクレべの輪を以下のどちらで活用しますか？
					eventName: null, //イベント名（↑が1の場合だけ）
					eventPlaceCategory: '施設', //イベント実施予定場所（店舗/施設/会場）
					eventFrequency: '1ヶ月に1回', //イベント実施予定回数（1ヶ月に1回 / 2ヶ月に一回 / 数ヶ月間隔 / どれも当てはまらない）
					eventAims: ['その他', '集客'], //イベント目的：（集客 / 価値向上 / 経費削減 / その他）
					eventOtherAim: 'なんとなくやりたい', //イベント目的（↑で「その他」を選択した場合のみ）
					postalCode: '', // 郵便番号（事業所以外の場合。開催地複数なら、メインの開催地）
					prefecture: '', // 都道府県（事業所以外の場合。開催地複数なら、メインの開催地）
					city: '', //市区町村（事業所以外の場合。開催地複数なら、メインの開催地）
					address: '', // 番地以降（事業所以外の場合。開催地複数なら、メインの開催地）
				},
			}
			Object.entries(this.memberDocData.eventInfo).forEach((kAndV) => {
				const k = kAndV[0]
				const v = kAndV[1]
				if (k == 'postalCode' || k == 'prefecture' || k == 'city' || k == 'address') {
					if (v == '' || v == null) {
						this.memberDocData.eventInfo[k] = this.memberDocData[k]
					}
				}
			})
			try {
				const result = await setNewMemberDoc(this.memberDocData, this.memberDocData.memberID)
				if (result) {
					this.isSubscribed = true
					console.log('this.isSubscribed: ', this.isSubscribed)
				}

				// console.log('sendLetYouHoldEmail起動')
				// // サーバーにPOSTする！！！
				// const URL = `${SERVER_URL}/application-form`
				// const options = {
				// 	params: {
				// 		memberID: this.memberDocData.memberID,
				// 		mailAddress: this.memberDocData.mailAddress
				// 	},
				// }
				// console.log('options: ', options)
				// const res = await axios.post(URL, options)
				// console.log('res.data: ', res.data)
				// // 更新完了のアラート
				// if (res.data.success == true) {
				// 	console.log('更新完了')
				// 	this.isUpdated = true
				// }
			} catch (error) {
				console.log(error)
			}
		},
		// ダミー会員の削除
		async deleteTestData() {
			try {
				const memberID = 'test'
				deleteMemberDoc(memberID)
			} catch (error) {
				console.log(error)
			}
		},
	},

	// SECTION:ビュー読み込み前処理
	created() {		
	},
	mounted() {		
		document.title = '賛同申請フォーム - みんなで繋ごうエクレべの輪'		
	},
}
</script>
<style>
p,
h1,
h2,
h3,
h4,
h5,
h6,
.vuetext {
	color: black;
	letter-spacing: 0.05em;
	font-family: '游ゴシック体', 'YuGothic', '游ゴシック Medium', 'Yu Gothic Medium', '游ゴシック', 'Yu Gothic', sans-serif;
}

.title-bar {
	color: white;
	background-color: black;
	margin: 0px;
	padding: 0px;
	font-family: '游ゴシック体', 'YuGothic', '游ゴシック Medium', 'Yu Gothic Medium', '游ゴシック', 'Yu Gothic', sans-serif;
}

.title-bar h1,
p {
	color: white;
	/* background-color: black; */
	margin: 0px;
	padding: 0px;
}

.note {
	color: black;
}
.html {
	overflow-x: hidden;
	overflow-y: auto;
}
</style>
