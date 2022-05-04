/* firestoreへの参照をつくる
将来のリファクタリングを考えると、ここで独自関数をつくっとくのが得策か？
firestoreの構文は、SEE:https://scrapbox.io/discus4372-18115953/firestore%E3%81%82%E3%82%8C%E3%81%93%E3%82%8C
*/

// NOTE:ESMの場合SEE:https://cloud.google.com/firestore/docs/quickstart-mobile-web?hl=ja
// import { initializeApp } from 'firebase/app'
import { firebaseApp } from './firebaseApp'
import { getFirestore, collection, doc, getDoc, setDoc, query, where, getDocs } from 'firebase/firestore'
// const firebaseApp = initializeApp({
// 	// NOTE:APIキーは、GCPで設定・閲覧するものっぽい。GCPのAPIのとこにいったら、自動でキーがつくられてたのでそれをとりまペースト
// 	apiKey: 'AIzaSyBRlGcES1rH6rRh9n6oLbLK2mASlsGItoI',
// 	authDomain: 'pokapoka0-49645.appspot.com',
// 	projectId: 'pokapoka0-49645',
// })
export const db = getFirestore(firebaseApp)

/**
 * collectionへの参照をgetする
 * @param {db} _db
 * @param {string} _collectionName
 * @returns
 * NOTE:新規collection作成したいときは、未存在のdocのpathを、_pathに渡せばよい
 */
export function getCollectionRef(_db, _collectionName) {
	const ref = collection(_db, _collectionName)
	return ref
}

/**
 * docへの参照をgetする
 * @param {db} _db DB
 * @param {string} _path refを得たいdocのパス。「/」で区切る！！例：「members/doc名」
 * @returns {docref} ref
 * NOTE:新規doc作成したいときは、未存在のdocのpathを、_pathに渡せばよい
 */
export function getDocRef(_db, _path) {
	const collectionName = _path.split('/')[0]
	const docName = _path.split('/')[1]
	const ref = doc(_db, collectionName, docName)
	return ref
}

/**
 * docのsnapshotを取得する
 * @param {docref} _docRef
 * @returns {docsnap}
 */
export async function getDocSnap(_docRef) {
	const docSnap = await getDoc(_docRef)
	return docSnap
	// NOTE:「docSnap.data()」でデータ中身取得。「docSnap.フィールド名」で、あるフィールド値を取得。
}

/**
 * docにデータをセットする
 * @param {docref} _docRef docref
 * @param {Object} _data オブジェクトで表した、セットしたいデータ
 * @param {boolean} _merge （デフォでマージする）
 * NOTE:↓の関数内注意書き参照。
 */
export async function setaDoc(_docRef, _data, _merge = true) {
	await setDoc(_docRef, _data, _merge)
	/* 
    そのdocがなかったら、docを新規作成。
    そのdocがもともとあったら、既存のところに統合される。
    統合は、_dataで指定したフィールドのみ新規追加or更新され、その他フィールドは、もとあったまま保たれる。
    */
}

// TODO:updateDocも。ただしsetDocのmergeがtrueとなにが違うか？？

/**
 * クエリにあった複数docsnapを取得
 * @param {*} _collectionRef
 * @param {*} _queryObj
 * @returns {array} docsnapの配列
 */
export async function getDocSnaps(_collectionRef, _queryObj) {
	let q
	// １つのクエリのとき
	if (Object.keys(_queryObj).length == 1) {
		q = query(_collectionRef, where(_queryObj['1'][0], _queryObj['1'][1], _queryObj['1'][2]))
	}
	// ２つのクエリのとき（AND条件）
	else if (Object.keys(_queryObj).length == 2) {
		q = query(
			_collectionRef,
			where(_queryObj['1'][0], _queryObj['1'][1], _queryObj['1'][2]),
			where(_queryObj['2'][0], _queryObj['2'][1], _queryObj['2'][2])
		)
	}
	// ３つのクエリのとき（AND条件）
	else if (Object.keys(_queryObj).length == 3) {
		q = query(
			_collectionRef,
			where(_queryObj['1'][0], _queryObj['1'][1], _queryObj['1'][2]),
			where(_queryObj['2'][0], _queryObj['2'][1], _queryObj['2'][2]),
			where(_queryObj['3'][0], _queryObj['3'][1], _queryObj['3'][2])
		)
	}

	const docsnaps = await getDocs(q)
	// NOTE:ここで「.docs」をとっていることが重要！詳細は公式docmentを参照。https://firebase.google.cn/docs/reference/js/firestore_.querysnapshot?hl=ja
	const resultDocs = docsnaps.docs
	return resultDocs
	// NOTE:↑検索結果が１docsnapでも、その後forEachでデータ取得せよ！！∵returnはdocsnapの「配列」だから！
	/*
    【NOTE:クエリの文法】
    where()は必ず３つの引数をもつ。
    例：where('name', '==', 'taro')
    例：where('height', '>', 170)
    例：where('married', '!=', false)
    例：where('hobbies', 'array-contains', 'guitar')・・・趣味のなかにギターが含まれてるひと
    例：where('hobbies', 'array-contains-any', ['guitar', 'manga', 'bonsai'])・・・趣味のなかにギターor漫画or盆栽が含まれてるひと
    例：where('nearestStation', 'in', ['hashimoto', 'sagamihara', 'yabe'])・・・最寄りが橋本or相模原or矢部のひとってこと
    例：where('nearestStation', 'not-in', ['hashimoto', 'sagamihara', 'yabe'])・・・最寄りが橋本でも相模原でも矢部でもないってこと

    【NOTE:複合クエリの注意点】
    https://firebase.google.com/docs/firestore/query-data/queries
    （１）<,<=,>,>=,!=を含むクエリはひとつのフィールドでだけ可能。
    （「身長170cm以上」をつかったら、同じクエリで「体重80kg未満」は使えない）
    （２）'array-contains'と'array-contains-any'は、どちらかひとつのみ    
    */
}
