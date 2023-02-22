<template>
	<v-app class="vuetext">
		<!-- タイトル黒背景エリア -->
		<div class="title-bar">
			<h1 class="ma-5">みんなで繋ごう<br />エクレべの輪<br />(イベント開催情報)</h1>
			<v-container
				><v-row justify="center">
					<v-img lazy-src="../assets/TwE-logo-JP.svg" max-height="220" max-width="220" src="../assets/TwE-logo-JP.svg"></v-img> </v-row
			></v-container>
			<div>
				<p class="ma-5">
					以下に3ヶ月先までのみんなで繋ごうエクレベの輪イベントが表示されます。<br />エリアを絞り、お住まい近くでイベントが開催されるか確認してみましょう!!
				</p>
				<v-container>
					<v-row class="mb-5" justify="center">
						<v-btn large text dark color="#bfa379" @click="go2Help()"><v-icon>mdi-help-circle</v-icon>エクレベの輪って何？</v-btn>
					</v-row>
				</v-container>
			</div>
		</div>
		<!-- イベント一覧 -->
		<div class="subscribe, mx-12, vuetext">
			<v-container class="my-5">
				<v-row justify="center">
					<!-- イベント一覧カード -->
					<v-card v-if="events.length > 0">
						<!-- カードタイトル -->
						<v-card-title>
							イベント一覧
							<v-row>
								<v-spacer></v-spacer>
								<v-col cols="5">
									<v-select :items="areas" v-model="selectedArea" label="エリアを選択" class="mx-2" @change="filterByArea"></v-select>
								</v-col>
								<v-col>
									<v-text-field
										class="mx-2"
										v-model="search"
										append-icon="mdi-magnify"
										label="文字で絞り込みできます"
										single-line
										hide-details
									></v-text-field>
								</v-col>
							</v-row>
						</v-card-title>
						<!-- イベント一覧テーブル本体 -->
						<v-data-table
							:headers="headers"
							:items="filteredEvents"
							:search="search"
							item-key="eventID"
							sort-by="hiraganaPrefecture"
							group-by="category"
							class="elevation-1"
						>
							<!-- <template #[`item.websiteURL`]="{ item }">
								<v-btn dark :disabled="buttonDisables[item.eventID]" color="#bfa379" @click="go2WebSite(item)">イベントの詳細を確認</v-btn>
							</template> -->
							<template #[`item`]="{ item }">
								<tr :style="{
										// 'background-color': item.status === '中止' ? 'red' : ''
										'color': item.status === '中止' ? '#bfbfbf' : '',
										'text-decoration': item.status === '中止' ? 'line-through': '',
									}"
								>
									<!-- 以下必要な数だけtdタグを記述 -->
									<td>{{ item.beginDate }}</td>
									<td>{{ item.endDate }}</td>
									<td>{{ item.prefecture }}</td>
									<td>{{ item.venue }}</td>
									<td>{{ item.fullAddress }}</td>
									<td>{{ item.campanyName }}</td>
									<td>{{ item.phoneNumber }}</td>
									<td><v-btn dark :disabled="buttonDisables[item.eventID]" color="#bfa379" @click="go2WebSite(item)">イベントの詳細を確認</v-btn></td>																											
								</tr>
							</template>
						</v-data-table>
					</v-card>
					<p v-else class="caution">現在開催予定のイベントはありません</p>
				</v-row>
			</v-container>
			<!-- <v-divider></v-divider> -->
			<!-- </v-form> -->
			<p class="note">注意事項：イベントに関するお問い合わせは主宰者にお願いします。</p>
		</div>
	</v-app>
</template>

<script>
// NOTE:import文をここに書く
import /* getLIFFInfo */ '../modules/liff.js'
import /*getCollectionRef, getDocSnaps,*/ '../modules/firestore.js'
import { searchEventDocs } from '@/modules/utils.js'
import { /* getDateStringfromTimeStamp */ getYMfromTimeStamp } from '@/modules/otherUtils.js'
// import { genHashID } from '@/modules/otherUtils'
// import { arrayUnion } from '@firebase/firestore'
// import axios from 'axios'

export default {
	name: 'HoldPlaceView',
	// SECTION:コンポーネント
	components: {},
	// SECTION:変数
	data() {
		return {
			LINEuID: '',
			isLIFF: false,
			isSubscribed: false,
			TODAYSTRING: null,
			// イベント情報
			events: [],
			filteredEvents: [],
			eventDocData: {
				managerName: '', // ご担当者
				campanyName: '', // 会社名 / 屋号	実施主催者
				phoneNumber: '', //  電話番号	連絡先
				mailAddress: '', //  メールアドレス	-
				beginDate: '', //  開催日開始	日程	★
				endDate: '', //  開催日終了	日程	★
				beginTimeStamp: '',
				endTimeStamp: '',
				area: '', //東日本 or 西日本
				postalCode: '', //  開催住所の郵便番号	-
				prefecture: '', //  開催住所の都道府県	実施場所1・都道府県
				city: '', //  開催住所の市区町村	実施場所2
				address: '', //  開催住所の番地以降	実施場所3
				websiteURL: '', //  イベントサイト	Webサイト
				category: '',
			},
			areas: ['東日本', '西日本'],
			selectedArea: '',
			search: '',
			headers: [
				{
					text: '開始日',
					value: 'beginDate',
				},
				{
					text: '終了日',
					value: 'endDate',
				},
				{
					text: '都道府県',
					value: 'prefecture',
				},
				{
					text: '実施場所',
					value: 'venue',
				},
				{
					text: '実施住所',
					value: 'fullAddress',
				},
				{
					text: '主宰事業者',
					value: 'campanyName',
				},
				{
					text: '連絡先',
					value: 'phoneNumber',
				},
				{
					text: 'webサイト',
					value: 'websiteURL',
				},
			],
			buttonDisables: {},
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
	// SECTION:関数
	methods: {
		async getNowHoldinEvents() {
			// categoryフィールド「2023年2月」でクエリ。直近３ヶ月ぶんのみ取得
			let queryMonthStrings = []
			for (let i = 0; i < 3; i++) {
				const now = new Date()
				const monthDate = new Date(now.setMonth(now.getMonth() + i))
				const monthDateTs = monthDate.getTime()
				const monthString = getYMfromTimeStamp(monthDateTs)
				queryMonthStrings.push(monthString)
			}
			console.log('queryMonthStrings: ', queryMonthStrings)
			const queryObj = {
				1: ['category', 'in', queryMonthStrings],
			}
			this.events = await searchEventDocs(queryObj)
			this.filteredEvents = this.events
			console.log('this.events: ', this.events)
			this.buttonDisables = {}
			this.filteredEvents.forEach((event) => {
				if (event.websiteURL == '' || event.status == '中止') {
					this.buttonDisables[event.eventID] = true
				} else {
					this.buttonDisables[event.eventID] = false
				}
			})
			console.log('this.buttonDisables: ', this.buttonDisables)
		},
		filterByArea() {
			console.log('selectedArea: ', this.selectedArea)
			this.filteredEvents = this.events.filter((e) => {
				return e.area == this.selectedArea
			})
			this.buttonDisables = {}
			this.filteredEvents.forEach((event) => {
				if (event.websiteURL == '') {
					this.buttonDisables[event.eventID] = true
				} else {
					this.buttonDisables[event.eventID] = false
				}
			})
			console.log('this.buttonDisables: ', this.buttonDisables)
		},
		go2WebSite(item) {
			console.log('クリックされたitem: ', item)
			const url = item.websiteURL
			if (url != '') {
				window.location.href = item.websiteURL // 通常の遷移
				window.open('パス名', '_blank') // 新しいタブを開き、ページを表示
			} else {
				window.alert('詳細情報が設定されていません！')
			}
		},
		go2Help() {
			const url = 'https://timothy.extolevel.shop/premium-series/together-with-extolevel/'
			window.location.href = url
			window.open('パス名', '_blank') // 新しいタブを開き、ページを表示
		},

		// formatDate(date) {
		// 	if (!date) return null
		// 	const [year, month, day] = date.split('-')
		// 	return `${month}/${day}/${year}`
		// },
		// parseDate(date) {
		// 	if (!date) return null

		// 	const [month, day, year] = date.split('/')
		// 	return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
		// },
	},

	// SECTION:ビュー読み込み前処理
	async created() {
		await this.getNowHoldinEvents()
		document.title = 'みんなで繋ごうエクレべの輪 - イベント開催情報'
	},
	watch: {
		beginDate() {
			this.beginDateFormatted = this.formatDate(this.beginDate)
		},
		endDate() {
			this.endDateFormatted = this.formatDate(this.endDate)
		},
		eventAddress() {
			const parts = this.eventAddress.split('---')
			this.eventDocData.prefecture = parts[0]
			this.eventDocData.city = parts[1]
			this.eventDocData.address = parts[2]
			this.eventDocData.postalCode = parts[3]
			this.eventDocData.area = parts[4]
		},
	},
}
</script>

<!-- :::スタイルシート -->
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

.caution {
	color: red;
}

.html {
	overflow-x: hidden;
	overflow-y: auto;
}
</style>
