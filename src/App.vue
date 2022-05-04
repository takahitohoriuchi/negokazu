<template>
	<v-app>
		<v-app-bar app color="primary" dark>
			<div class="d-flex align-center">
				<v-img
					alt="Vuetify Logo"
					class="shrink mr-2"
					contain
					src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
					transition="scale-transition"
					width="40"
				/>

				<v-img
					alt="Vuetify Name"
					class="shrink mt-1 hidden-sm-and-down"
					contain
					min-width="100"
					src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
					width="100"
				/>
			</div>

			<v-spacer></v-spacer>

			<v-btn href="https://github.com/vuetifyjs/vuetify/releases/latest" target="_blank" text>
				<span class="mr-2">Latest Release</span>
				<v-icon>mdi-open-in-new</v-icon>
			</v-btn>
		</v-app-bar>

		<v-main>
			<!-- SECTION:ナビゲーション -->
			<nav><router-link to="/"> HOME </router-link> | <router-link to="/about"> ABOUT </router-link> |</nav>
			<!-- SECTION:ナビゲーション -->

			<router-view />
		</v-main>
	</v-app>
</template>

<script>
export default {
	name: 'App',
	data: () => ({
		//
	}),
}
</script>

<style>
/* NOTE:テスト（16進数で色チェックしたいためだけにある） */
#test {
	color: #d2bc40;
	color: #89d2ca;
	color: #dc395f;
}

#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
}

nav {
	padding: 30px;
}

nav a {
	font-weight: bold;
	color: #2c3e50;
}

nav a.router-link-exact-active {
	color: #57d123;
}
</style>
