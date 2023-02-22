import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
	theme: {
		themes: {
			light: {
				// appbarとかに使われてる色 （ひとまず青）
				primary: '#bfa379',
				theme: '#ffffff',
				secondary: '#d2bc40',
				accent: '#dc395f',
				error: '#fd3c2f',
				warning: '#fd3c2f',
				info: '#ff5722',
				success: '#795548',
			},
		},
	},
})
