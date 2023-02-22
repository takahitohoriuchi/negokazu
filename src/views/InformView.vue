<template>
	<v-app>
		<div class="title-bar">
			<h1 class="my-5">みんなで繋ごう<br>エクレべの輪<br>(開催報告フォーム)</h1>
			<v-container class="my-5"><v-row justify="center">
				<v-img lazy-src="../assets/TwE-logo-JP.svg" max-height="220" max-width="220" src="../assets/TwE-logo-JP.svg"></v-img>
			</v-row>
			<v-row class="mb-5"></v-row>
			</v-container>
			<!-- NOTE:開発用 -->
				<!-- <v-btn x-large class="ma-10" color="primary" @click="testSubmit()"><v-icon>mdi-bell</v-icon> 【開発用】テスト開催報告</v-btn>
				<v-btn x-large class="ma-10" color="primary" @click="deleteTestData()"><v-icon>mdi-bell</v-icon> 【開発用】テスト開催報告データ削除</v-btn> -->
				<!-- NOTE:開発用 -->
			<v-overlay :value="overlay">
				<v-card min-width="400">
					<v-card-title>事業者ログイン</v-card-title>
					<v-card-actions>
						<v-container>
							<v-row class="mx-auto"><v-text-field v-model="loginEmail" label="メールアドレス" outlined></v-text-field></v-row>
							<v-row class="mx-auto"><v-text-field v-model="loginPassword" label="パスワード" type="password" outlined></v-text-field></v-row>
							<v-row v-if="!loginResult" justify="center">
								<p class="text-justify">メールアドレスまたはパスワードが違います！</p>
							</v-row>
							<v-row class="mx-auto"
								><v-col
									><v-btn @click="tryLogIn"><v-icon>mdi-login</v-icon> ログイン</v-btn></v-col
								></v-row
							>
						</v-container>
					</v-card-actions>
				</v-card>
				<v-container> </v-container>
			</v-overlay>
		</div>
		<!-- :::フォーム -->
		<div class="vuetext my-5">
			<v-form v-model="valid" ref="profileform">				
				<v-container>
					<!-- <v-divider :class="tateYohaku"></v-divider> -->
					<h2 :class="tateYohaku">基本情報</h2>
					<!-- ご担当者*-->
					<v-row
						><v-col cols="8"> <v-text-field outlined v-model="eventDocData.managerName" :rules="[required]" label="ご担当者"></v-text-field> </v-col
					></v-row>
					<!-- 会社名/屋号*-->
					<v-row
						><v-col cols="8">
							<v-text-field outlined v-model="eventDocData.campanyName" :rules="[required]" label="会社名/屋号"></v-text-field> </v-col
					></v-row>
					<!-- 電話番号（ハイフンなし）*-->
					<v-row
						><v-col cols="8">
							<v-text-field
								outlined
								v-model="eventDocData.phoneNumber"
								:rules="[required, isInt]"
								label="電話番号（ハイフンなし）"
							></v-text-field> </v-col
					></v-row>
					<!-- メールアドレス*-->
					<v-row
						><v-col cols="8">
							<v-text-field
								outlined
								v-model="eventDocData.mailAddress"
								:rules="[required, emailRule]"
								label="メールアドレス"
							></v-text-field> </v-col
					></v-row>
					<v-divider :class="tateYohaku"></v-divider>
					<h2 :class="tateYohaku">開催時期</h2>
					<!-- <p>※本日から14日後～90日以内のイベントのみ報告を行うようにしてください。※</p> -->
					<!-- イベント開始/終了 -->
					<v-row>
						<v-col cols="8" lg="6">
							<v-menu
								ref="menu1"
								v-model="menu1"
								:close-on-content-click="false"
								transition="scale-transition"
								offset-y
								max-width="290px"
								min-width="auto"
							>
								<template v-slot:activator="{ on, attrs }">
									<v-text-field
										v-model="beginDateFormatted"
										label="開催開始日"
										hint="日付をカレンダーから選択するか、月/日/年 の形式でご記入ください（例：2023年1月2日 → 01/02/2023）。"
										persistent-hint
										prepend-icon="mdi-calendar"
										v-bind="attrs"
										@blur="beginDate = parseDate(beginDateFormatted)"
										:rules="[required, holdDate]" 
										v-on="on"
									></v-text-field>
								</template>
								<v-date-picker v-model="beginDate" no-title @input="menu1 = false"></v-date-picker>
							</v-menu>							
						</v-col>

						<v-col cols="8" lg="6">
							<v-menu v-model="menu2" :close-on-content-click="false" transition="scale-transition" offset-y max-width="290px" min-width="auto">
								<template v-slot:activator="{ on, attrs }">
									<v-text-field
										v-model="endDateFormatted"
										label="開催終了日"
										hint="日付をカレンダーから選択するか、月/日/年 の形式でご記入ください（例：2023年1月2日 → 01/02/2023）。"
										persistent-hint
										prepend-icon="mdi-calendar"
										readonly
										v-bind="attrs"
										:rules="[required]" 
										v-on="on"
									></v-text-field>
								</template>
								<v-date-picker v-model="endDate" no-title @input="menu2 = false"></v-date-picker>
							</v-menu>			
						</v-col>
					</v-row>
					<!-- :::開催住所 -->
					<v-divider :class="tateYohaku"></v-divider>
					<h2 :class="tateYohaku">開催住所</h2>
					<!-- memberDocDataの住所をデフォ入力しておいて、 その上に、memberDocData.events[]の数だけ、プルダウンを用意-->
					<v-row>
						<v-select :items="memberDocData.eventAddresses" v-model="eventAddress" label="過去の開催地から選択する場合はこちらから"></v-select>
					</v-row>
					<!-- エリア -->
					<v-row>
						<v-col cols="9">
							<v-select outlined :items="areas" v-model="eventDocData.area" label="エリアを選択"></v-select>
						</v-col>
					</v-row>
					<!-- 開催地名（会場名） -->
					<v-row
						><v-col cols="8">
							<v-text-field outlined v-model="eventDocData.venue" :rules="[required]" label="開催地名（会場名）"></v-text-field> </v-col
					></v-row>
					<!-- 郵便番号* -->
					<v-row
						><v-col cols="5"> <v-text-field outlined v-model="eventDocData.postalCode" :rules="[required, isInt]" label="郵便番号（ハイフンなし半角数字）"></v-text-field> </v-col
					><v-col cols="3"><v-btn @click="getAddressFromPostalCode()">郵便番号から所在地検索</v-btn></v-col>
				</v-row>
					<!-- 住所（都道府県）* -->
					<v-row>					
					<v-col cols="8"><v-select outlined :items="prefectures" v-model="eventDocData.prefecture" :rules="[required]" label="開催場所の住所（都道府県）"></v-select> </v-col>					
				</v-row>
					<!-- 住所（市区町村）* -->
					<v-row
						><v-col cols="8">
							<v-text-field outlined v-model="eventDocData.city" :rules="[required]" label="開催場所の住所（市区町村）"></v-text-field> </v-col
					></v-row>
					<!-- 住所（番地以降）* -->
					<v-row
						><v-col cols="8"
							><v-text-field outlined v-model="eventDocData.address" :rules="[required]" label="開催場所の住所（それ以降）"></v-text-field> </v-col
					></v-row>
					<v-row>
						<v-col cols="8">
							<v-checkbox label="上記の住所を開催地住所リストに登録しておく" v-model="isSubscribeEventAddresses" value="value"></v-checkbox>
						</v-col>
					</v-row>
					<v-divider :class="tateYohaku"></v-divider>
					<!-- :::その他 -->
					<h2 :class="tateYohaku">その他</h2>
					<!-- web site*-->
					<v-row
						><v-col cols="8"> <v-text-field outlined v-model="eventDocData.websiteURL" label="イベント情報がわかるサイトURL"></v-text-field> </v-col
					></v-row>
					<p class="text-justify mt-1 red--text">ここに入力するURLはお客様がイベント詳細を見るページに使用するので正しいURLをご記入ください。</p>
					<!-- LINE通知機能 -->
					<!-- <p class="text-justify">イベント事業者の方は「」開催通知をEXTOLEVELのLINE公式アカウント登録ユーザーのみなさまにお送りします。</p> -->
					<v-row>
						<v-select
							:rules="[required]"
							outlined
							:items="eventDistrictedItems"
							item-text="label"
							item-value="value"
							v-model="eventDocData.isRestrictedOnlyPrefecture"
							label="LINE通知">
						</v-select>
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
					<v-divider :class="tateYohaku"></v-divider>
				</v-container>

				<!-- SECTION:（登録成功時のみ表示する） -->
				<!-- </v-row> -->
				<!-- 登録中アラート -->
				<!-- <v-alert color="blue-grey" dark :value="isNowLoading">登録中...</v-alert> -->
				<!-- 成功アラート -->
				<v-alert type="success" :value="isSubscribed" text>
					開催報告完了しました！
				</v-alert>
				<!-- SECTION:送信ボタン -->	
				<v-btn v-if="!isSubscribed" x-large class="ma-5" color="primary" @click="submit"><v-icon>mdi-bell</v-icon> 開催報告する</v-btn>				
			</v-form>
		</div>
	</v-app>
</template>

<script>
// NOTE:import文をここに書く

import /*getCollectionRef, getDocSnaps,*/ '../modules/firestore.js'
import { prefectures } from '../modules/prefectures.js'
import { setNewEventDoc, searchMemberDocs, updateMemberDoc, deleteEventDoc } from '@/modules/utils.js'
import { genHashID } from '@/modules/otherUtils'
import { arrayUnion } from '@firebase/firestore'
import {SERVER_URL} from '@/main.js'
import axios from 'axios'


export default {
	name: 'InformView',
	// SECTION:コンポーネント
	components: {},
	// SECTION:変数
	data() {
		return {
			tateYohaku: 'my-5',
			LINEuID: '',
			isLIFF: false,
			isSubscribed: false,
			isNowLoading: false,
			loginEmail: '',
			loginPassword: '',
			memberDocData: {
				memberID: '', //事業者に割り振るID
				password: '', //イベント報告フォーム閲覧用パスワード
				campanyName: '', //法人名
				campanyNumber: '', //法人番号
				websiteURL: '', //webサイトURL,
				phoneNumber: '',
				mailAddress: '',
				postalCode: '', //郵便番号
				prefecture: '', //住所（都道府県）
				city: '', //住所（市区町村）
				address: '', //住所（番地など。市区町村以降。）,
				eventInfo: {
					eventType: null, //みんなで繋ごうエクレべの輪を以下のどちらで活用しますか？
					eventName: null, //イベント名（↑が1の場合だけ）
					eventPlaceCategory: '', //イベント実施予定場所（店舗/施設/会場）
					eventFrequency: '', //イベント実施予定回数（1ヶ月に1回 / 2ヶ月に一回 / 数ヶ月間隔 / どれも当てはまらない）
					eventAims: [], //イベント目的：（集客 / 価値向上 / 経費削減 / その他）
					postalCode: '', // 郵便番号（事業所以外の場合。開催地複数なら、メインの開催地）
					prefecture: '', // 都道府県（事業所以外の場合。開催地複数なら、メインの開催地）
					city: '', //市区町村（事業所以外の場合。開催地複数なら、メインの開催地）
					address: '', // 番地以降（事業所以外の場合。開催地複数なら、メインの開催地）
				},
			},
			// イベント情報
			eventDocData: {
				informTs: null,//報告日時
				managerName: '', // ご担当者
				campanyName: '', // 会社名 / 屋号	実施主催者
				phoneNumber: '', //  電話番号	連絡先
				mailAddress: '', //  メールアドレス	-
				beginDate: '', //  開催日開始	日程	★
				endDate: '', //  開催日終了	日程	★
				beginTimeStamp: '',
				endTimeStamp: '',
				area: '', //東日本 or 西日本
				venue: '', //開催地名
				postalCode: '', //  開催住所の郵便番号	-
				prefecture: '', //  開催住所の都道府県	実施場所1・都道府県
				city: '', //  開催住所の市区町村	実施場所2
				address: '', //  開催住所の番地以降	実施場所3
				websiteURL: '', //  イベントサイト	Webサイト	
				isRestrictedOnlyPrefecture: null// LINE通知のさい、この都道府県ユーザーだけに通知する？or全員にする？
			},
			eventDistrictedItems : [
				{
					label: '開催場所の都道府県にのみ通知（イベント事業者以外の方）',
					value: true
				},
				{
					label: '全てに通知（イベント事業者）',
					value: false
				},				
			],
			prefectures: [null],
			check: false,
			valid: false,
			beginDate: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10),
			endDate: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10),
			beginDateFormatted: null,
			endDateFormatted: null,
			menu1: false,
			menu2: false,
			areas: ['東日本', '西日本'],
			overlay: true,
			isSubscribeEventAddresses: false,
			eventAddress: null,
			loginResult: true,
			// Emailルール。「@」がなかったら、注意
			emailRule: (v) => /.+@.+/.test(v) || 'メールアドレスが正しくありません',
			// 入力必須ですルール
			// required: (v) => !!v || '必ず入力してください', // 入力必須の制約
			required: (v) => {				
				return !!v || '必ず入力してください'
			}, // 入力必須の制約}
			// 半角数字ルール
			isInt: (v) => !isNaN(Number(v)) || '半角の数字で入力してください',
			// 文字数上限ルール
			limitLength: (v) => v.length <= 100 || '100文字以内で入力してください', // 文字数の制約
			// 開催日時ルール
			holdDate: (v)=>{
				const nowTs = new Date().getTime()
				const ts = new Date(v).getTime()
				const diffTs = ts - nowTs
				const fourteenDaysTs = 1209600000
				const ninetyDaysTs = 7776000000
				return ((diffTs >= fourteenDaysTs) && (diffTs <= ninetyDaysTs)) || '本日から14日後〜90日後以内の日付を入力してください'				
			} 
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
		beginDateFormatted: false,
		endDateFormatted: false,
		eventDocData: {
			isRestrictedOnlyPrefecture: false,
		}
	},
	// SECTION:関数
	methods: {
		async submit() {
			if (confirm('申請してよいですか？')) {
				console.log('送信ボタンが押されたよ')
				console.log('this.betinDate: ', this.beginDate)
				// :::（１）eventDocの生成
				this.eventDocData.beginDate = this.beginDate
				this.eventDocData.endDate = this.endDate
				this.eventDocData.beginTimeStamp = new Date(this.beginDate).getTime()
				this.eventDocData.endTimeStamp = new Date(this.endDate).getTime()
				// 
				const d = new Date(this.eventDocData.beginDate)
				const year = d.getFullYear()
				const month = d.getMonth() + 1
				const category = year + '年' + month + '月'
				this.eventDocData.category = category
				this.eventDocData.fullAddress = this.eventDocData.prefecture + this.eventDocData.city + this.eventDocData.address
				console.log('prefectures: ', prefectures)
				console.log('prefectures.東京都: ', prefectures['東京都'])
				this.eventDocData.hiraganaPrefecture = prefectures[`${this.eventDocData.prefecture}`]				
				this.eventDocData.memberID = this.memberDocData.memberID
				this.eventDocData.password = genHashID()
				this.eventDocData.eventID = genHashID()

				// 必須項目がすべて埋まってるかどうかをcheck
				if (this.$refs.profileform.validate()) {
					// 必須項目埋まってたら
					console.log('validationの結果成功です')
					this.isNowLoading = true
					try {
						this.eventDocData.informTs = new Date().getTime()
						const result1 = await setNewEventDoc(this.eventDocData, this.eventDocData.eventID)
						// :::(2) memberDocを更新する
						let data = {
							events: arrayUnion(this.eventDocData.eventID),
						}
						// 住所登録する場合
						if (this.isSubscribeEventAddresses) {
							this.eventAddress =
								this.eventDocData.venue + 
								'---' +
								this.eventDocData.prefecture +
								'---' +
								this.eventDocData.city +
								'---' +
								this.eventDocData.address +
								'---' +
								this.eventDocData.postalCode +
								'---' +
								this.eventDocData.area
							data.eventAddresses = arrayUnion(this.eventAddress)
						}
						const result2 = await updateMemberDoc(this.memberDocData.memberID, data)
						console.log('result1: ', result1)
						console.log('result2: ', result2)
						if(result1 && result2){
							this.isSubscribed = true
							console.log('this.isSubscribed: ', this.isSubscribed)
						}

						// :::(3)エクレベにメール送信
						console.log('sendLetYouHoldEmail起動')
						// サーバーにPOSTする！！！
						const URL = `${SERVER_URL}/inform-form`
						// const URL = `${SERVER_URL}`
						const options = {
							params: {
								memberID: this.memberDocData.memberID,
								eventID: this.eventDocData.eventID,
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
		formatDate(date) {
			if (!date) return null
			const [year, month, day] = date.split('-')
			return `${month}/${day}/${year}`
		},
		parseDate(date) {
			if (!date) return null

			const [month, day, year] = date.split('/')
			return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
		},
		// 事業者ログイン
		async tryLogIn() {
			// 入力したthis.loginEmailとthis.loginPassWordで称号する。
			// fsDBを。
			try {
				const queryObj = {
					1: ['mailAddress', '==', this.loginEmail],
					2: ['password', '==', this.loginPassword],
				}
				const docDatas = await searchMemberDocs(queryObj)
				if (docDatas) {
					this.memberDocData = docDatas[0]
					if(this.memberDocData.status == 'BAN'){
						alert('お客さまのアカウントは現在停止中です。')
					}else{
						console.log('this.memberDocData: ', this.memberDocData)
						this.eventDocData.managerName = this.memberDocData.managerName
						this.eventDocData.campanyName = this.memberDocData.campanyName
						this.eventDocData.phoneNumber = this.memberDocData.phoneNumber
						this.eventDocData.mailAddress = this.memberDocData.mailAddress
						this.overlay = false
					}
					
				} else {
					console.log('データがありません')
					this.loginResult = false
				}
			} catch (error) {
				console.log(error)
			}
		},
		// 郵便番号から住所を検索する
		async getAddressFromPostalCode(){
			const URL = 'https://zipcloud.ibsnet.co.jp/api/search'			
			try {
					const res = await axios.get(URL, {
						params: {
							zipcode: this.eventDocData.postalCode
						}
					})			
					if(res.status == '200'){
						console.log('成功')			
						console.log('res: ', res)			
						const result = res.data.results[0]			
						this.eventDocData.prefecture = result.address1
						this.eventDocData.city = result.address2
						this.eventDocData.address = result.address3			
					}else{
						alert('郵便番号が正しくありません')
					}
			} catch (error) {
				console.log(error)
			}			
		},
		// :::【開発用】テストイベント生成
		async testSubmit(){																	
			console.log('testSubmit起動')
			this.eventDocData = {
				eventID : 'testEvent',
				memberID: 'test',
				password: 'testpass',
				informTs: new Date().getTime(),//報告日時
				managerName: 'TaroTest', // ご担当者
				campanyName: 'テストカンパニー', // 会社名 / 屋号	実施主催者
				phoneNumber: '09011111111', //  電話番号	連絡先
				mailAddress: '9yak50@gmail.com', //  メールアドレス	-
				beginDate: '2023-1-11', //  開催日開始	日程	★
				endDate: '2023-1-14', //  開催日終了	日程	★								
				area: '東日本', //東日本 or 西日本
				venue: 'テスト会場', //開催地名
				postalCode: '2520143', //  開催住所の郵便番号	-
				prefecture: '神奈川県', //  開催住所の都道府県	実施場所1・都道府県
				city: '相模原市緑区', //  開催住所の市区町村	実施場所2
				address: '橋本1-1-1', //  開催住所の番地以降	実施場所3
				websiteURL: 'https://www.google.com/', //  イベントサイト	Webサイト				
				hiraganaPrefecture: 'かながわけん'
			}
			this.eventDocData.beginTimeStamp = new Date(this.beginDate).getTime()
			this.eventDocData.endTimeStamp = new Date(this.endDate).getTime()				
			const d = new Date(this.eventDocData.beginDate)
			const year = d.getFullYear()
			const month = d.getMonth() + 1
			const category = year + '年' + month + '月'
			this.eventDocData.category = category
			this.eventDocData.fullAddress = this.eventDocData.prefecture + this.eventDocData.city + this.eventDocData.address	
			// DBにセット
			const result1 = await setNewEventDoc(this.eventDocData, this.eventDocData.eventID)
			console.log('result1: ', result1)
			// :::(3)エクレベにメール送信
			console.log('sendLetYouHoldEmail起動')
			// サーバーにPOSTする！！！
			const URL = `${SERVER_URL}/inform-form`
			// const URL = `${SERVER_URL}`
			const options = {
				params: {
					memberID: this.memberDocData.memberID,
					eventID: this.eventDocData.eventID,
					mailAddress: this.memberDocData.mailAddress,
				},
			}
			console.log('options: ', options)
			const res = await axios.post(URL, options)
			console.log('res.data: ', res.data)
		},
		async deleteTestData(){
			try {
				const eventID = 'testEvent'
				await deleteEventDoc(eventID)
			} catch (error) {
				console.log(error)
			}
		}
	},

	// SECTION:ビュー読み込み前処理
	created() {
		this.prefectures = Object.keys(prefectures).map(p=>{
			return p
		})
	},
	mounted() {
		document.title = '開催報告フォーム - みんなで繋ごうエクレべの輪'
	},
	// computed: {
	// 	computedDateFormatted() {
	// 		return this.formatDate(this.date)
	// 	},
	// },
	watch: {
		beginDate() {
			this.beginDateFormatted = this.formatDate(this.beginDate)
		},
		endDate() {
			this.endDateFormatted = this.formatDate(this.endDate)
		},
		eventAddress() {
			const parts = this.eventAddress.split('---')
			this.eventDocData.venue = parts[0]
			this.eventDocData.prefecture = parts[1]
			this.eventDocData.city = parts[2]
			this.eventDocData.address = parts[3]
			this.eventDocData.postalCode = parts[4]
			this.eventDocData.area = parts[5]
		},
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
