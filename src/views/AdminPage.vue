<template>
	<div class="admin">
		<LoginUI v-if="!isAdmin && !LINEuID" />
		<!-- SECTION:会員検索エリア -->

		<v-card>
			<v-card-title>会員の検索</v-card-title>
			<v-card-text>検索すると、会員リストが下に表示されます。</v-card-text>
			<v-card-text>※検索窓になにも入力しないまま検索すると、全会員リストを取得します。</v-card-text>
			<v-card-actions>
				<v-container>
					<v-row justify="center">
						<v-col cols="3">
							<v-select outlined :items="Object.keys(items)" label="この項目で検索" v-model="selectedItem"></v-select>
						</v-col>
						<v-col cols="5">
							<v-text-field outlined label="ここに値を入力" v-model="keyword"></v-text-field>
						</v-col>
						<v-col cols="3">
							<v-btn color="primary" x-large @click="searchMembers(keyword)"><v-icon>mdi-account-search</v-icon> 検索</v-btn>
						</v-col>
					</v-row>
				</v-container>
			</v-card-actions>
		</v-card>

		<!-- （２）全会員リストを取得するボタン（firestoreの負荷は高い） -->
		<v-container class="ma-10">
			<v-row justify="space-around">
				<v-card width="50%" color="blue">
					<v-list>
						<v-subheader>検索結果会員リスト</v-subheader>
						<v-list-item v-for="member in memberDocDatas" :key="member.memberID" @click="go2MembersMyPage(member.memberID)">
							<v-list-item-content>
								<v-list-item-title>
									{{ member.name }}
								</v-list-item-title>
							</v-list-item-content>
						</v-list-item>
						<!-- 該当会員ナシの場合 -->
						<v-list-item v-if="memberDocDatas == null">
							<v-list-item-content>
								<v-list-item-title> ※該当会員がいません！ </v-list-item-title>
							</v-list-item-content>
						</v-list-item>
						<v-divider></v-divider>
					</v-list>
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
import { searchMemberDocs } from '@/modules/utils'
// import { queryEqual } from '@firebase/firestore'
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
			keyword: null,
			// items: [
			// 	{
			// 		label: '氏名',
			// 		fieldName: 'name',
			// 	},
			// 	{
			// 		label: 'メールアドレス',
			// 		fieldName: 'address',
			// 	},
			// ],
			items: {
				氏名: 'name',
				メールアドレス: 'address',
			},
			selectedItem: null,
		}
	},	
	// SECTION:関数
	methods: {
		async tryLogOut() {
			await logOut()
			console.log('管理者ログアウトしました')
			location.reload()
		},
		async searchMembers(_keyword) {
			// membersを初期化
			this.memberDocDatas = []
			const queryObj = _keyword == null ? { 1: ['exist', '==', true] } : { 1: [`${this.items[this.selectedItem]}`, '==', `${_keyword}`] }
			// 実際に取得
			try {
				this.memberDocDatas = await searchMemberDocs(queryObj)
				console.log('検索結果としてのthis.memberDocDatas: ', this.memberDocDatas)
			} catch (error) {
				console.log(error)
			}
		},
		async go2MembersMyPage(_memberID) {
			console.log('_memberID: ', _memberID)
			let tempMemberDocData
			for (let i = 0; i < this.memberDocDatas.length; i++) {
				if (this.memberDocDatas[i].memberID == _memberID) {
					tempMemberDocData = this.memberDocDatas[i]
				}
			}
			this.$router.push({ name: 'mypage', params: { memberDocData0: tempMemberDocData } })
		},
		// async setSearchTags() {
		// 	// 曖昧検索結果を初期化
		// 	if (this.AsearchResults && this.AsearchResults.length > 0) this.AsearchResults.splice(0)
		// 	if (this.searchTagObjs.length > 0) {
		// 		// TODO:検索欄の文字数
		// 		console.log('その文字数: ', tagName4Aimai.length)
		// 		// 末尾タグの文字数が２以上なら
		// 		if (tagName4Aimai.length >= 2) {
		// 			// 曖昧検索実行
		// 			try {
		// 				this.AsearchResults = await searchAimai(tagName4Aimai)
		// 				console.log('AsearchResults: ', this.AsearchResults)
		// 			} catch (error) {
		// 				console.log(error)
		// 			}
		// 		}
		// 	}
		// },
		// // searchTags内該当タグが、選択した曖昧検索結果チップ値に変化する
		// replaceTag(_selectedAsearchResult) {
		// 	// 「検索窓に表示されたタグ群」と「最終的な検索タグ群」のうち、最後のタグを選択チップにすげ替え
		// 	if (this.searchTagObjs.length > 0) {
		// 		// NOTE:ここも要チェック
		// 		this.searchTagObjs[this.searchTagObjs.length - 1].tagName = _selectedAsearchResult
		// 		// AsearchResultをいったん削除
		// 		if (this.AsearchResults.length > 0) this.AsearchResults.splice(0)
		// 	}
		// },
		// /**
		//  * タグの2-gramを作成して、tokenに格納する関数\
		//  * （正規表現でもっとスッキリかけないかな）
		//  * @param {string} tag
		//  * @return {Array<string>} tag n-grammed in array
		//  */
		// getTagTokens(tag) {
		// 	const token = []
		// 	const chars = tag.split('')
		// 	for (let j = 0; j < chars.length - 1; j++) {
		// 		token.push(chars[j] + chars[j + 1])
		// 	}
		// 	return uniquifyArray(token)
		// },

		// /**
		//  * タグを曖昧検索する（似た表記のタグを見つけてくる）関数\
		//  * @param {string} tag
		//  * @param {number} numAimaiTags 実際に返す類似タグの数
		//  * @return {Array<Object>} tag Document in array
		//  */
		// async searchAimai(tag, numAimaiTags = 3) {
		// 	// １文字だけの場合はそもそも2gram化できないので、nullを返す
		// 	if (tag.length <= 1) return null
		// 	// 入力語を2gram化する（例：「腹筋崩壊」→→→[腹筋, 筋崩, 崩壊]）
		// 	console.log('tag 2 aimai:', tag)
		// 	let inputToken = getTagTokens(tag)
		// 	// array-contains-anyが受け取れる配列の長さは１０個まで
		// 	if (inputToken.length > maxQueryArrayLength) {
		// 		// 文字列の最初の方に重要な情報（正しい文字列）があるだろうという仮定
		// 		inputToken = inputToken.slice(0, maxQueryArrayLength)
		// 	}
		// 	// console.log('inputToken:', inputToken)
		// 	try {
		// 		let tagDocs = []
		// 		// タグ自身のドキュメントを取得
		// 		const docSnap = await get(`publicTags/${tag}`)
		// 		if (docSnap) tagDocs.push(docSnap.data())
		// 		else tagDocs.push(getPublicTagInitValue(tag, 0))
		// 		// 類似タグを検索、追加
		// 		const qrySnap = await getDocuments('publicTags', [
		// 			['where', 'token', 'array-contains-any', inputToken],
		// 			['limit', numAimaiTags - 1],
		// 		])
		// 		if (qrySnap) tagDocs = tagDocs.concat(qrySnap.docs.map((doc) => doc.data()))
		// 		return tagDocs
		// 	} catch (e) {
		// 		console.log(e)
		// 	}
		// },
	},
	created() {
		this.isAdmin = this.$isAdmin
		if (!this.isAdmin) {
			console.log('adminじゃないので、HOMEにpushします')
			this.$router.push({ name: 'home' })
		}
	},
	// SECTION:その他
	mounted() {
		console.log('\n\n----------')
		console.log('AdminPage.vue')					
	},
}
</script>
