<template>
	<div class="home">	
	</div>	
</template>

<script>
// import LoginUI from '@/components/LoginUI.vue'
import { /* updateMemberDoc */ } from '@/modules/utils'
// import axios from 'axios'
// import {PROXY_URL} from '../main.js'

// import fetch from 'fetch'

export default {
	name: 'HomeView',
	// SECTION:コンポーネント
	components: {
		// LoginUI,
	},
	// SECTION:変数
	data() {
		return {
			memberDocData: {},
			LINEuID: null,
			isAdmin: false,
			isUpdated: false,
			name : '',
			items: ['登録済み', '保留中', '未登録']

		}
	},
	// SECTION:関数
	methods: {		

	},
	props: {
		isAdmin0: Boolean,
		memberDocData0: Object,
		LINEuID0: String,
	},
	created() {
		console.log('memberDocData0: ', this.memberDocData0)
		
		if(this.memberDocData0){
			this.memberDocData = this.memberDocData0
			this.LINEuID = this.memberDocData0.LINEuserID__c
			this.isAdmin = true
		}else{
			this.memberDocData = this.$memDocData
			this.LINEuID = this.$LINEuID
			this.isAdmin = this.$isAdmin

		}
		console.log('this.memberDocData: ', this.memberDocData)
		console.log('this.LINEuID: ', this.LINEuID)
		console.log('this.isAdmin: ', this.isAdmin)		
		// console.log('会員登録ページにpushします')
		// this.$router.push({ name: 'application' })								
	},
	mounted() {
		console.log('memberDocData: ', this.memberDocData)
		console.log('LINEuID: ', this.LINEuID)
		this.name = this.memberDocData.lastName + this.memberDocData.firstName
	},
}
</script>

<style>

body {
 overflow-x: hidden;
}

</style>