<template>
	<div class="home">
		<h1>HOME</h1>
		<LoginUI v-if="!isAdmin && !LINEuID" />
		<v-container>
			<v-row> memberDocData:{{ memberDocData }} </v-row>
		</v-container>
	</div>
</template>

<script>
import LoginUI from '@/components/LoginUI.vue'

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
	methods: {},
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