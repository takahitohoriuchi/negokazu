<template>
	<div class="admin">
		<LoginUI v-if="!isAdmin && !LINEuID" />
			
		<!-- :::開発用 -->
			<!-- <div>
				<v-btn @click='genDummyMemberDoc()'>ダミーメンバー生成</v-btn>
				<v-btn @click='deleteDummyMemberDoc()'>ダミーメンバー削除</v-btn>
				<v-btn @click='genDummyEventDoc()'>ダミーイベント生成</v-btn>
				<v-btn @click='deleteDummyEventDoc()'>ダミーイベント削除</v-btn>
			</div> -->
			<!-- :::開発用 -->
		<!-- SECTION:会員検索エリア -->
		<v-card>
			<v-card-title>事業者の検索</v-card-title>
			<v-card-text>検索すると、事業者リストが下に表示されます。</v-card-text>			
			<v-card-actions>
				<v-container>
					<v-row justify="center">
						<v-col cols="3">
							<v-select outlined :items="Object.keys(items)" label="この項目で検索" v-model="selectedItem"></v-select>
						</v-col>
						<v-col cols="5">
							<v-text-field outlined label="ここに値を入力" v-model="value"></v-text-field>
						</v-col>
						<v-col cols="3">
							<v-btn color="primary" x-large @click="searchMembers(selectedItem, value)"><v-icon>mdi-account-search</v-icon> 検索</v-btn>
						</v-col>
					</v-row>
					<v-row justify="center">				
						<v-alert  color="blue-grey" dark :value="isNowLoading">検索中...</v-alert>				
					</v-row>
				</v-container>
			</v-card-actions>
		</v-card>

		<!-- （２）全会員リストを取得するボタン（firestoreの負荷は高い） -->
		<v-container class="ma-10">
			<v-row justify="space-around">
				<v-card v-if="memberDocDatas.length > 0">
					<!-- <v-row v-for="member in memberDocDatas" :key="member.id"> -->
						<!-- <v-col cols="3"> -->
							<v-data-table :headers="headers" :items="memberDocDatas" @click:row="go2MembersMyPage">
							</v-data-table>														
						<!-- </v-col> -->
					<!-- </v-row>												 -->					
				</v-card>
			</v-row>
		</v-container>
		<!-- SECTION:そのた -->
		<v-container>
			<v-row>
				<!-- <p>adminUserInfo:{{ adminUserInfo }}</p> -->
			</v-row>
			<v-row class="my-15">
				<v-col cols="3"></v-col>
				<v-col cols="6">
					<v-btn @click="tryLogOut" color="black" :dark="true">ログアウト</v-btn>
				</v-col>
				<v-col cols="3"></v-col>
			</v-row>
		</v-container>
	</div>
</template>

<script>
import LoginUI from '@/components/LoginUI.vue'
import { logOut } from '@/modules/admin'
import { deleteMemberDoc, searchMemberDocs, setNewMemberDoc } from '@/modules/utils'
// import axios from 'axios'
// import { SERVER_URL } from '@/main'
import { genHashID } from '@/modules/otherUtils.js'
export default {
	name: 'AdminPage',
	// SECTION:コンポーネント
	components: { LoginUI },
	// SECTION:変数
	data() {
		return {
			// memberDocData: {}
			memberDocDatas: [],
			// LINEuID: null,
			isAdmin: false,
			// keyword: null,	
			items: {												
				電話番号: 'phoneNumber',
				担当者名: 'managerName',
				法人名: 'campanyName',
				ステータス: 'status'
			},
			headers: [
				{
					text: 'ID',
					value: 'memberID'
				},
				{
					text: '法人名',
					value: 'campanyName'
				},
				{
					text: '担当者名',
					value: 'managerName'

				},
				{
					text: '電話番号',
					value: 'phoneNumber'
				},							
				{
					text: 'メールアドレス',
					value: 'mailAddress',				
				},
				{
					text: 'ステータス',
					value: 'status',				
				},																	
			],
			selectedItem: null,
			value: null,
			isNowLoading: false
		}
	},	
	// SECTION:関数
	methods: {
		show(_row){
			console.log('_row: ', _row)
		},
		async tryLogOut() {
			await logOut()
			console.log('管理者ログアウトしました')
			location.reload()
		},
		async searchMembers(_selectedItem, _value){
			try {
				console.log('this.selectedItem: ', _selectedItem)
				console.log('this.value: ', _value)
				const key = this.items[_selectedItem]
				console.log('key: ', key)
				const queryObj = {
					'1': [key, `==`, _value]
				}
				this.memberDocDatas = await searchMemberDocs(queryObj)
				if(this.memberDocDatas){
					console.log('memberDocData: ', this.memberDocDatas)
					
				}else{
					console.log('該当eventDocがない')
				}				
			} catch (error) {
				console.log(error)
			}

		},		
		async go2MembersMyPage(_item) {			
			console.log('_item: ', _item)
			// console.log('id: ', id)
			// let tempMemberDocData
			// for (let i = 0; i < this.memberDocDatas.length; i++) {
			// 	if (this.memberDocDatas[i].id == id) {
			// 		tempMemberDocData = this.memberDocDatas[i]
			// 	}
			// }
			// console.log('tempMemberDocData: ', tempMemberDocData)
			this.$router.push({ name: 'mypage', params: { memberDocData0: _item } })
		},		
		// :::【開発用テスト】
		// ダミー会員docの生成
		async genDummyMemberDoc(){
			// 各種うめる
			// this.memberDocData.password = genHashID()
			// this.memberDocData.memberID = genHashID()
			// this.memberDocData.applicationTs = new Date().getTime()
			this.memberDocData = {
				memberID: 'test',
				applicationTs: new Date().getTime(),
				examinationResultMailLog: [],
				status: '未対応',//未対応、許可、ダメ
				password: genHashID(),
				campanyName: 'テストカンパニー', //法人名
				campanyNumber: '2222222222222', //法人番号
				websiteURL: 'google.com', //webサイトURL,
				phoneNumber: '09011111111',
				mailAddress: '9yak50@gmail.com',
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
					eventOtherAim: 'なんとなくやりたい',//イベント目的（↑で「その他」を選択した場合のみ）
					postalCode: '', // 郵便番号（事業所以外の場合。開催地複数なら、メインの開催地）
					prefecture: '', // 都道府県（事業所以外の場合。開催地複数なら、メインの開催地）
					city: '', //市区町村（事業所以外の場合。開催地複数なら、メインの開催地）
					address: '', // 番地以降（事業所以外の場合。開催地複数なら、メインの開催地）
				},

			}
			Object.entries(this.memberDocData.eventInfo).forEach(kAndV=>{
				const k = kAndV[0]
				const v = kAndV[1]
				if(k == 'postalCode' || k == 'prefecture' || k == 'city' || k =='address'){
					
					if(v == '' || v == null){
						this.memberDocData.eventInfo[k] = this.memberDocData[k]
					}	
				}
				
			})
			try {						
				const result = await setNewMemberDoc(this.memberDocData, this.memberDocData.memberID)
				console.log('result: ', result)												
			} catch (error) {
				console.log(error)
			}
		},
		// ダミー会員の削除
		async deleteDummyMemberDoc(){
			try {
				const memberID = 'test'				
				deleteMemberDoc(memberID)
			} catch (error) {
				console.log(error)				
			}
		},
		// ダミーイベントdocの生成
		async genDummyEventDoc(){

		},
		// ダミーイベントdocの削除
		async deleteDummyEventDoc(){

		}
	},
	async created() {
		document.title = '事業者管理サイト- みんなで繋ごうエクレべの輪'
		this.isAdmin = this.$isAdmin		
		// if (!this.isAdmin) {
		// 	console.log('adminじゃないので、HOMEにpushします')
		// 	this.$router.push({ name: 'home' })
		// }
		await this.searchMembers('ステータス', '未対応')
		
	},
	// SECTION:その他
	mounted() {
		console.log('\n\n----------')
		console.log('AdminPage.vue')					
	},
}
</script>
