<template>
	<div class="home">		
		<LoginUI v-if="!isAdmin && !LINEuID" />
		<v-container>
			<v-row> memberDocData:{{ memberDocData }} </v-row>
		</v-container>
		<!-- 診察券 -->
		<v-card  class="mx-auto">
		<v-card-media src="src" height="200px">
		</v-card-media>
		<v-card-title primary-title>
			<div>
				<h1 class="headline ma-10 text-h3">診察券</h1>				
			</div>
		</v-card-title>
		<v-card-text>
			<v-container>
				<v-row class="my-10">
					<v-col cols="5">
						<p class="text-h4">お名前：  <big>{{memberDocData.name}}</big></p>
						<v-divider></v-divider>			
					</v-col>
				</v-row>
				<v-row>
					<v-col cols="5">
						<p class="text-h4">カルテ番号：  <big>{{memberDocData.karteID}}</big></p>
						<v-divider></v-divider>			
					</v-col>
					<v-col v-if="isAdmin">
						<v-text-field class="text-h4" outlined label="ここにカルテ番号入力" v-model="memberDocData.karteID"></v-text-field>
					</v-col>
				</v-row>													
			</v-container>
			
		</v-card-text>		
		<v-card-actions v-if="isAdmin">
			<v-container>
				<v-row justify="center">
					<v-btn @click="update()">会員情報を更新</v-btn>
				</v-row>
			</v-container>									
		</v-card-actions>
	</v-card>
	</div>	
</template>

<script>
import LoginUI from '@/components/LoginUI.vue'
import { updateMemberDoc } from '@/modules/utils'

export default {
	name: 'HomeView',
	// SECTION:コンポーネント
	components: {
		LoginUI,
	},
	// SECTION:変数
	data() {
		return {
			memberDocData: {},
			LINEuID: null,
			isAdmin: false,
		}
	},
	// SECTION:関数
	methods: {
		async update(){			
			if(confirm('この会員情報を更新しますか？')){
				const memberID = this.memberDocData.memberID
			try {
				await updateMemberDoc(memberID, this.memberDocData)				
				// DEBUG:
				// マルケトAPIをたたく
				// TODO:これらはバックエンドにうつす！！！
				// クライアントID
				const clientID = '830bd02a-98fc-43d8-8391-211d911f53d6'
				// シークレット
				const secret = 'HWHwXoFfpqAaErPUj2WEUt9ybMcfyqfY'
				// 認証済みユーザー
				const authentiatedUser = 'flalu@flalu.com'
				// トークン
				const token = '5f9a9f6d-2dba-46cc-aead-72d7517ff4a4:ab'
				// エンドポイントURL
				const endpointURL = 'https://907-YZP-528.mktorest.com/rest'
				// ここで、POSTやGETリクエストに試みる
				// 
				// リクエスト
				// めんどかったらGASにするのもアリか？？





				// DEBUG:
			} catch (error) {
				console.log(error)
			}		
			}				
		}
	},
	props: {
		isAdmin0: Boolean,
		memberDocData0: Object,
		LINEuID0: String,
	},
	created() {
		this.memberDocData = this.$memDocData
		this.LINEuID = this.$LINEuID
		this.isAdmin = this.$isAdmin
		console.log('this.memberDocData: ', this.memberDocData)
		console.log('this.LINEuID: ', this.LINEuID)
		console.log('this.isAdmin: ', this.isAdmin)
		if (this.LINEuID && !this.memberDocData && !this.isAdmin) {
			console.log('会員登録ページにpushします')
			this.$router.push({ name: 'subscribe' })
		}
	},
	mounted() {
		console.log('memberDocData: ', this.memberDocData)
		console.log('LINEuID: ', this.LINEuID)
	},
}
</script>