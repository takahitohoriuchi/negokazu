/* NOTE:firebaseAppの初期化専用。
firestore.jsとかauthentication.jsではまずコイツが読み込まれる。
*/

import { initializeApp } from 'firebase/app'

export const firebaseApp = initializeApp({
	// NOTE:APIキーは、GCPで設定・閲覧するものっぽい。GCPの「APIとサービス」の「認証情報」にて、自動でキーがつくられている
	apiKey: 'AIzaSyAUKz7IkIM79BvXMWRbH1fWYqQmtzi7PbI',
	//※プロジェクトID.appspot.com（プロジェクト名じゃないよ）
	authDomain: 'extolevel-54e01.appspot.com',
	// ※プロジェクトID
	projectId: 'extolevel-54e01',
})
