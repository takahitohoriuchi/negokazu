/* NOTE:firebaseAppの初期化専用。
firestore.jsとかauthentication.jsではまずコイツが読み込まれる。
*/

import { initializeApp } from 'firebase/app'

export const firebaseApp = initializeApp({
	// NOTE:APIキーは、GCPで設定・閲覧するものっぽい。GCPの「APIとサービス」の「認証情報」にて、自動でキーがつくられている
	apiKey: 'AIzaSyCBHDWaHsDoSFrBmPm_EzIvu8vDIDmx9nA',
	//※プロジェクトID.appspot.com（プロジェクト名じゃないよ）
	authDomain: 'negokazu-72015.appspot.com',
	// ※プロジェクトID
	projectId: 'negokazu-72015',
})
