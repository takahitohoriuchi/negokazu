<template>
	<v-app>
		<div class="about">
			<h2 class="my-10">{{ memberDocData.campanyName }}</h2>

			<v-expansion-panels multiple>
				<!-- 事業者情報 -->
				<v-expansion-panel>
					<v-expansion-panel-header><h3>事業者情報</h3></v-expansion-panel-header>
					<v-expansion-panel-content>
						<div>
							<!-- 事業者情報 -->
							<v-container>
								<v-row>
									<v-col cols="5">
										<v-select label="ステータス" :items="statusItems" v-model="memberDocData.status"> </v-select>
									</v-col>
								</v-row>
							</v-container>
						</div>
						<div>
							<v-simple-table dark>
								<template v-slot:default>
									<thead>
										<tr>
											<th class="text-left">項目</th>
											<th class="text-left">値</th>
										</tr>
									</thead>
									<tbody>
										<tr v-for="kAndV in Object.entries(memberDocDataFieldNames)" :key="kAndV[0]">
											<td class="text-left">{{ kAndV[1] }}</td>
											<!-- イベント情報は下で別表にするのでスルー -->
											<td v-if="kAndV[0] == 'eventInfo'">イベント情報は下記表参照↓</td>
											<td v-else-if="kAndV[0] == 'applicationTs'" align="left">{{ applicationYMD }}</td>
											<td v-else-if="kAndV[0] == 'examinationResultTs'" align="left">{{ examinationResultYMD }}</td>
											<td v-else class="text-left" align="left">{{ memberDocData[kAndV[0]] }}</td>
										</tr>
									</tbody>
								</template>
							</v-simple-table>
						</div>
					</v-expansion-panel-content>
				</v-expansion-panel>
				<!-- 申請情報 -->
				<v-expansion-panel>
					<v-expansion-panel-header><h3>申請情報</h3></v-expansion-panel-header>
					<v-expansion-panel-content>
						<div>
							<v-simple-table dark class="my-10">
								<template v-slot:default>
									<thead>
										<tr>
											<th class="text-left">項目</th>
											<th class="text-left">値</th>
										</tr>
									</thead>
									<tbody>
										<tr v-for="kAndV in Object.entries(eventInfoFieldNames)" :key="kAndV[0]">
											<td class="text-left">{{ kAndV[1] }}</td>
											<!-- イベント目的の場合 -->
											<td v-if="kAndV[0] == 'eventAims'" class="text-left">
												<v-chip v-for="e in memberDocData.eventInfo[kAndV[0]]" :key="e" class="mx-1">{{ e }} </v-chip>
											</td>

											<td v-else class="text-left">{{ memberDocData.eventInfo[kAndV[0]] }}</td>
										</tr>
									</tbody>
								</template>
							</v-simple-table>
						</div>
					</v-expansion-panel-content>
				</v-expansion-panel>
				<!-- イベント情報 -->
				<v-expansion-panel>
					<v-expansion-panel-header><h3>イベント情報</h3></v-expansion-panel-header>
					<v-expansion-panel-content>
						<div>
							<!-- イベントセレクタ -->
							<v-select
								label="イベントを選択"
								outlined
								:items="this.eventDocDatas"
								v-model="selectedEvent"
								item-text="beginDate"
								item-value="eventID"
								@change="show"
								return-object
							></v-select>
							<!-- イベント情報エクスぱんジョン -->
							<v-simple-table dark class="my-10">
								<template v-slot:default>
									<thead>
										<tr>
											<th class="text-left">項目</th>
											<th class="text-left">値</th>
										</tr>
									</thead>
									<tbody>
										<tr v-for="kAndV in Object.entries(eventDocDataFieldNames)" :key="kAndV[0]">
											<td class="text-left">{{ kAndV[1] }}</td>
											<!-- イベント目的の場合 -->
											<td v-if="kAndV[0] == 'beginTimeStamp' || kAndV[0] == 'endTimeStamp' || kAndV[0] == 'informTs'" class="text-left">
												{{ getYMD(selectedEvent[kAndV[0]]) }}
											</td>
											<td v-else class="text-left">{{ selectedEvent[kAndV[0]] }}</td>
										</tr>
									</tbody>
								</template>
							</v-simple-table>
							<!-- イベント中止ボタン -->
							<v-btn v-if="selectedEvent && selectedEvent.status!='中止'" dark color="black" @click="stopThisEvent(selectedEvent)">このイベントを中止</v-btn>
							<v-btn v-else-if="selectedEvent && selectedEvent.status=='中止'" dark color="black" @click="restartThisEvent(selectedEvent)">このイベントを再開</v-btn>
						</div>
					</v-expansion-panel-content>
				</v-expansion-panel>
				<!-- 審査結果メール -->
				<v-expansion-panel>
					<v-expansion-panel-header><h3>審査結果</h3></v-expansion-panel-header>
					<v-expansion-panel-content>
						<v-container>
							<!-- 審査結果セレクト -->
							<v-row>
								<v-col cols="6"><v-select :items="statusItems" v-model="memberDocData.status"></v-select></v-col>
								<v-col cols="6" v-if="this.memberDocData.examinationResultTs"
									><h4>審査結果送信済（{{ this.examinationResultYMD }}）</h4></v-col
								>
							</v-row>
							<!-- 審査結果のメール文面 -->
							<v-row><p>※文面を変えた場合は、「更新」してから送信してください！！！</p></v-row>
							<v-row><p>※大なり小なり記号はつかったらダメ！（変数名につかってるので）</p></v-row>
							<v-row><p>※TABキーでのスペースは無効</p></v-row>
							<v-row>								
								<v-textarea
									ref="examinationResultTextarea"
									filled
									label="審査結果メールの文面"
									auto-grow
									v-model="mailDocData.examinationResultsSentence[memberDocData.status]"
								>
									<!-- <template v-slot:prepend-inner>										
											<v-chip class="ma-1">tesuto</v-chip>
									</template>									 -->
								</v-textarea>
							</v-row>
							<!-- 会員docのデータの変数チップ -->
							<v-row>
								<v-chip
									color="dark-grey"
									dark
									v-for="kAndV in Object.entries(memberDocDataFieldNames)"
									:key="kAndV[1]"
									@click="addVariable('examinationResultTextarea', kAndV[0])"
								>
									{{ kAndV[1] }}
								</v-chip>
							</v-row>
							<!-- 審査結果の送信 -->
							<v-row>
								<v-alert type="success" :value="isExaminationResultEmailSend" text> メール送信完了しました！ </v-alert>
							</v-row>
							<v-row>
								<!-- メール送信 -->
								<v-col
									><v-btn color="primary" @click="sendExaminationResultEmail()"
										><v-icon>mdi-email-arrow-right</v-icon>メール送信する</v-btn
									></v-col
								>
								<!-- メール文面の更新 -->
								<v-col
									><v-btn color="primary" @click="updateExaminationEmailSentence()"
										><v-icon>mdi-file-refresh</v-icon>メール文面を更新</v-btn
									></v-col
								>
							</v-row>
						</v-container>
						<!-- メール送信履歴 -->
						<v-container class="ma-5">
							<v-row>
								<v-col cols="6">
									<h4>審査メール送信履歴</h4>
								</v-col>
							</v-row>
							<v-row justify="center">
								<v-col cols="6">
									<v-simple-table dense dark>
										<template v-slot:default>
											<thead>
												<tr class="text-center">
													<th class="text-left">送信日時</th>
													<th class="text-left">審査結果</th>
												</tr>
											</thead>
											<tbody v-if="'examinationResultMailLog' in memberDocData">
												<tr class="text-left" v-for="(item, i) in memberDocData.examinationResultMailLog" :key="i">
													<td>{{ item.YMDHM }}</td>
													<td>{{ item.result }}</td>
												</tr>
											</tbody>
										</template>
									</v-simple-table>
								</v-col>
							</v-row>
						</v-container>
					</v-expansion-panel-content>
				</v-expansion-panel>
				<!-- 開催報告許可メール -->
				<v-expansion-panel>
					<v-expansion-panel-header><h3>開催報告</h3></v-expansion-panel-header>
					<v-expansion-panel-content>
						<v-container>
							<!-- 審査結果のメール文面 -->
							<v-row>
								<v-textarea ref="letYouHoldTextArea" filled label="開催報告メール返信の文面" auto-grow v-model="mailDocData.letYouHoldSentence"></v-textarea>
							</v-row>
							<!-- 会員docのデータの変数チップ -->
							<v-row>
								<v-chip
									color="dark-grey"
									dark
									v-for="kAndV in Object.entries(eventDocDataFieldNames)"
									:key="kAndV[1]"
									@click="addVariable('letYouHoldTextArea', kAndV[0])"
								>
									{{ kAndV[1] }}
								</v-chip>
							</v-row>
							<!-- 審査結果の送信 -->
							<v-row>
								<v-alert type="success" :value="isLetYouHoldEmailSend" text> メール送信完了しました！ </v-alert>
							</v-row>
							<v-row>
								<!-- メール送信 -->
								<!-- <v-col
									><v-btn color="primary" @click="sendLetYouHoldEmail()"><v-icon>mdi-email-arrow-right</v-icon>メール送信する</v-btn></v-col
								> -->
								<!-- メール文面の更新 -->
								<v-col
									><v-btn color="primary" @click="updateLetYouHoldEmailSentence()"
										><v-icon>mdi-file-refresh</v-icon>メール文面を更新</v-btn
									></v-col
								>
							</v-row>
						</v-container>
					</v-expansion-panel-content>
				</v-expansion-panel>
				<!-- その他（垢BANなど） -->
				<v-expansion-panel>
					<v-expansion-panel-header><h3>その他（垢BANや備考）</h3></v-expansion-panel-header>
					<v-expansion-panel-content>
						<v-container>
							<!-- 備考 -->
							<v-row>
								<v-textarea filled label="備考" auto-grow v-model="memberDocData.note"></v-textarea>
							</v-row>
							<v-row>
								<!-- メール文面の更新 -->
								<v-col
									><v-btn color="primary" @click="update()"><v-icon>mdi-file-refresh</v-icon>備考を更新</v-btn></v-col
								>
							</v-row>
							<v-row>
								<v-col
									><v-btn v-if="memberDocData.status != 'BAN'" color="black" dark @click="ban()"
										><v-icon>mdi-account-cancel</v-icon>垢BAN</v-btn
									>
									<v-btn v-else color="black" dark @click="ban()"><v-icon>mdi-account-reactivate</v-icon>垢復活</v-btn>
								</v-col>
							</v-row>
						</v-container>
					</v-expansion-panel-content>
				</v-expansion-panel>
			</v-expansion-panels>
			<v-form v-model="valid" ref="profileform">
				<v-container v-if="isUpdated">
					<!-- 成功アラート -->
					<v-alert type="success" text>
						会員情報更新完了しました。
						<!-- クルクル -->
						<v-progress-circular indeterminate color="primary"></v-progress-circular>
					</v-alert>
				</v-container>
				<!-- 削除ボタン -->
				<!-- <v-divider></v-divider>				 -->
				<!-- <v-btn v-if="!isAdmin0" class="ma-10" dark color="black" @click="doDelete"><v-icon>mdi-account-remove</v-icon> この会員を削除する</v-btn> -->
			</v-form>
		</div>
	</v-app>
</template>
<script>
import { updateMemberDoc, deleteMemberDoc, getMailDocData, updateMailDoc /* setNewMailDoc */, getEventDocData, updateEventDoc } from '@/modules/utils.js'
import axios from 'axios'
import { getYMDHMfromTimeStamp, getYMDfromTimeStamp } from '@/modules/otherUtils'
import { arrayUnion } from '@firebase/firestore'
import { SERVER_URL } from '@/main'
// import /* onAuthStateChanged */ 'firebase/auth'
// import /* auth */ /* authStateChanged,  */ /* getadminUserInfo */ '../modules/admin.js'
export default {
	name: 'MyPageView',
	// SECTION:コンポーネント
	components: {},
	// SECTION:変数
	data() {
		return {
			memberDocData: {},
			eventDocDatas: [],
			// memberDocDataのフィールド名の日本語対応
			memberDocDataFieldNames: {
				memberID: '会員ID',
				status: 'ステータス',
				applicationTs: '申請日時',
				password: '開催報告フォームパスワード',
				campanyName: '事業者名',
				campanyNumber: '法人番号',
				managerName: '担当者名',
				mailAddress: 'メールアドレス',
				phoneNumber: '電話番号',
				postalCode: '郵便番号',
				prefecture: '都道府県',
				city: '市区町村',
				address: '番地以降',
				websiteURL: 'webサイトURL',
				eventInfo: 'イベント情報',
				eventAddresses: 'イベント開催地',
				events: 'イベントIDの一覧',
			},

			// memberDocDataのeventInfoフィールドの日本語対応
			eventInfoFieldNames: {
				postalCode: '郵便番号',
				prefecture: '都道府県',
				city: '市区町村',
				address: 'それ以降',
				eventName: 'イベント名',
				eventAims: 'イベントの目的',
				eventOtherAim: 'イベントの目的（その他）',
				eventPlaceCategory: 'イベント開催する場所',
				eventType: 'イベントの種類',
				eventFrequency: 'イベント開催頻度',
				// password: '注文ページ閲覧パスワード',
			},

			// eventDocDataのフィールド名の日本語対応
			eventDocDataFieldNames: {
				informTs: '開催報告した日時',
				managerName: 'ご担当者',
				campanyName: '会社名',
				phoneNumber: '電話番号',
				mailAddress: 'メールアドレス',
				beginDate: '開催開始日',
				endDate: '開催日終了日',
				beginTimeStamp: '開始日',
				endTimeStamp: '終了日',
				area: 'エリア',
				venue: '開催地名',
				postalCode: '開催池の郵便番号',
				fullAddress: '開催地住所',
				prefecture: '開催地の都道府県',
				city: '開催地の市区町村',
				address: '開催地のそれ以降',
				websiteURL: 'イベントサイト',
				password: '注文ページ閲覧PW',
				memberID: '会員ID（管理用）',
				eventID: 'イベントID（管理用）',
				category: '開催月',
				status: '開催ステータス（開催中/中止中）'
			},
			applicationYMD: '',
			examinationResultYMD: '',
			mailDocData: {
				examinationResultsSentence: {},
				letYouHoldSentence: '',
			},
			selectedEvent: null,
			statusItems: ['未対応', '許可', 'ダメ'],
			isAdmin: false,
			isExaminationResultEmailSend: false,
			isLetYouHoldEmailSend: false,
			// disableItems: [],//NOTE:会員自身が編集できない項目名。
			year: null,
			month: null,
			day: null,
			valid: false,
			isUpdated: false,
			isSpecialAdmin: false,
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
		getYMD(_ts) {
			return getYMDfromTimeStamp(_ts)
		},
		show() {
			console.log('this.selectedEvent: ', this.selectedEvent)
		},
		// 審査結果メール送信
		async sendExaminationResultEmail() {
			if (this.memberDocData.status != '未対応') {
				if (confirm('メール送信していいですか？')) {
					const exminationResultTs = new Date().getTime()
					const YMDHM = getYMDHMfromTimeStamp(exminationResultTs)
					const result = this.memberDocData.status
					const log = {
						YMDHM: YMDHM,
						result: result,
					}
					const data = {
						status: this.memberDocData.status,
						examinationResultMailLog: arrayUnion(log),
					}
					await updateMemberDoc(this.memberDocData.memberID, data)
					console.log('sendExaminationResultEmail起動')
					// サーバーにPOSTする！！！
					const URL = `${SERVER_URL}/admin`
					const options = {
						params: {
							email: this.memberDocData.mailAddress,
							memberID: this.memberDocData.memberID,
							keyword: this.memberDocData.status,
						},
					}
					console.log('options: ', options)

					const res = await axios.post(URL, options)
					console.log('res.data: ', res.data)
					// 更新完了のアラート
					if (res.data.success == true) {
						console.log('更新完了')
						this.isUpdated = true
						this.isExaminationResultEmailSend = true
					}
				}
			} else {
				alert('ステータス「未対応」以外でしかメール送信できません！')
			}
		},
		// メール文面のカーソル箇所に「変数」を追加
		addVariable(_refName, _variable) {
			// _refは、textareaのref属性参照
			// _variableの例：managerName（memberDocDataのフィールド名）						
			const textarea = this.$refs[_refName].$refs.input
			textarea.focus()
			const insertText = `<${_variable}>`
			document.execCommand('insertText', false, insertText)
		},
		// 審査結果メール文面の更新
		async updateExaminationEmailSentence() {
			console.log('更新')
			try {
				const data = {
					examinationResultsSentence: this.mailDocData.examinationResultsSentence,
				}
				console.log('data: ', data)

				await updateMailDoc(data)
			} catch (error) {
				console.log(error)
			}
		},
		// TODO:開催報告に対する返信メール送信
		async sendLetYouHoldEmail() {
			console.log('sendLetYouHoldEmail起動')
			// サーバーにPOSTする！！！
			const URL = `${SERVER_URL}/admin`
			const options = {
				params: {
					email: this.memberDocData.mailAddress,
					keyword: 'letYouHoldSentence',
				},
			}
			console.log('options: ', options)
			const res = await axios.post(URL, options)
			console.log('res.data: ', res.data)
			// 更新完了のアラート
			if (res.data.success == true) {
				console.log('更新完了')
				this.isUpdated = true
				this.isLetYouHoldEmailSend = true
			}
		},
		// 開催報告に対するメール文面の更新
		async updateLetYouHoldEmailSentence() {
			try {
				const data = {
					letYouHoldSentence: this.mailDocData.letYouHoldSentence,
				}
				await updateMailDoc(data)
			} catch (error) {
				console.log(error)
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
		async update() {
			try {
				const memberID = this.memberDocData.memberID
				const data = {
					note: this.memberDocData.note,
				}
				await updateMemberDoc(memberID, data)
				alert('更新完了！')
			} catch (error) {
				console.log(error)
			}
		},
		async stopThisEvent(_selectedEvent){
			if(confirm('このイベントを中止しますか？')){
				console.log('このイベントを中止します')
				console.log('selectedEvent: ', _selectedEvent)
				const eventID = _selectedEvent.eventID
				_selectedEvent.status = '中止'
				const data = {
					status: '中止'
				}
				await updateEventDoc(eventID, data)
			}			
		},
		async restartThisEvent(_selectedEvent){
			if(confirm('このイベントを再開しますか？')){
				console.log('このイベントを中止します')
				console.log('selectedEvent: ', _selectedEvent)
				const eventID = _selectedEvent.eventID
				_selectedEvent.status = '開催中'
				const data = {
					status: '開催中'
				}
				await updateEventDoc(eventID, data)
			}			
		},
		async ban() {
			const status = this.memberDocData.status
			if (status == 'BAN') {
				if (confirm('垢復活させますか？')) {
					try {
						const memberID = this.memberDocData.memberID
						this.memberDocData.status = '許可'
						const data = {
							status: this.memberDocData.status,
						}
						await updateMemberDoc(memberID, data)
					} catch (error) {
						console.log(error)
					}
				}
			} else {
				if (confirm('垢BANしますか？')) {
					try {
						const memberID = this.memberDocData.memberID
						this.memberDocData.status = 'BAN'
						const data = {
							status: this.memberDocData.status,
						}
						await updateMemberDoc(memberID, data)
					} catch (error) {
						console.log(error)
					}
				}
			}
		},
		getYMDHMfromTimeStamp(_timestamp) {
			const d = new Date(_timestamp)
			const year = d.getFullYear()
			const month = d.getMonth() + 1
			const date = d.getDate()
			const hours = d.getHours()
			const minutes = d.getMinutes()
			const YMDHM = `${year}年${month}月${date}日${hours}時${minutes}分`
			console.log('YMDHM: ', YMDHM)
			return YMDHM
		},
		// 解約するボタンがあってもいい
	},
	// SECTION:ビュー読み込み前処理
	beforeCreate: async function () {},
	created: async function () {
		console.log('this.isSpecialAdmin: ', this.isSpecialAdmin)
		this.memberDocData = this.$memDocData
		if (!this.memberDocData) {
			this.memberDocData = this.memberDocData0
		}
		this.isAdmin = this.$isAdmin
		console.log('this.memberDocData: ', this.memberDocData)
		console.log('this.memberDocData.examinationResultMailLog: ', this.memberDocData.examinationResultMailLog)

		console.log('this.isAdmin: ', this.isAdmin)
		this.mailDocData = await getMailDocData()
		console.log('this.mailDocData : ', this.mailDocData)
		this.memberDocData.events.forEach(async (eventID) => {
			try {
				const eveDocData = await getEventDocData(eventID)
				this.eventDocDatas.push(eveDocData)
				this.eventDocDatas.sort((a, b) => {
					if (a.beginTimeStamp <= b.beginTimeStamp) {
						return 1
					} else if (a.beginTimeStamp > b.beginTimeStamp) {
						return -1
					}
				})
				console.log('this.eventDocDatas: ', this.eventDocDatas)
			} catch (error) {
				console.log(error)
			}
		})
		// const
		this.applicationYMD = getYMDHMfromTimeStamp(this.memberDocData.applicationTs)
		if ('examinationResultTs' in this.memberDocData) {
			this.examinationResultYMD = getYMDHMfromTimeStamp(this.memberDocData.examinationResultTs)
		}
	},
	mounted() {
		document.title = '事業者管理サイト- みんなで繋ごうエクレべの輪'	
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
