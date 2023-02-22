/* NOTE:
さまざまな汎用的な便利関数をここで保管
*/

import {
	getCollectionRef,
	getDocSnaps,
	getDocRef,
	setaDoc,
	getDocSnap,
	updateaDoc,
	deleteaDoc,
	deleteAllDocsInCollection,
	/* getAllDocSnaps */
} from './firestore.js'
import { genHashID } from './otherUtils.js'

// :::DB操作（会員doc系）
/**
 * その会員のdocを検索して返す関数（LINEuIDをキーに）
 * @param {string} _collectionName
 * @param {string} _LINEuID
 * @returns {object} docData（会員docの内容）
 */
export async function searchMyDocData(_collectionName, _LINEuID) {
	const membersCollectionRef = getCollectionRef('members')
	const queryObj = {
		1: ['LINEuID', '==', _LINEuID],
	}
	let docData = null
	try {
		const docsnaps = await getDocSnaps(membersCollectionRef, queryObj)
		docsnaps.forEach((docsnap) => {
			docData = docsnap.data()
		})
		console.log('docData: ', docData)
	} catch (error) {
		console.log(error)
	}
	return docData
}

/**
 * 新しい会員docを生成する関数
 * @param {*} _memberID
 * @param {*} _data
 */
export async function setNewMemberDoc(_data, _memberID=null) {
	let memberID
	if(!_memberID){
		memberID = genHashID()
	}else{
		memberID = _memberID
	}
	
	console.log('ランダムに生成されたmemberID: ', memberID)
	// 生成docデータに「memberID」キーを追加する
	let data = _data
	data.memberID = memberID
	const docRef = getDocRef(`members/${memberID}`)
	try {
		await setaDoc(docRef, _data)
	} catch (error) {
		console.log(error)
	}
}

/**
 * 会員docを取得（LINEuIDで指定ver.）
 * @param {string} _LINEuID
 * @returns {object / null}
 */
export async function getMemberDocDataWithLINEuID(_LINEuID) {
	const collectionRef = getCollectionRef(`members`)
	const queryObj = {
		1: ['LINEuID', '==', _LINEuID],
	}
	try {
		let docData
		const docsnaps = await getDocSnaps(collectionRef, queryObj)
		docsnaps.forEach((docsnap) => {
			docData = docsnap.data()
		})
		console.log('docData: ', docData)
		return docData
	} catch (error) {
		console.log(error)
		return null
	}
}

/**
 * 会員docを取得（memberIDで指定ver.）
 * @param {string} _memberID
 * @returns {object / null}
 */
export async function getMemberDocDataWithMemberID(_memberID) {
	const docRef = getDocRef(`members/${_memberID}`)
	try {
		const docSnap = await getDocSnap(docRef)
		if (docSnap != null) {
			const data = docSnap.data()
			return data
		} else {
			return null
		}
	} catch (error) {
		console.log(error)
	}
}

/**
 * 会員docを更新（memberIDで指定）
 * @param {*} _memberID
 * @param {*} _data
 * NOTE:更新のさいのキーは「memeberID」のみ（LINEuIDではやらない）
 */
export async function updateMemberDoc(_memberID, _data) {
	const docRef = getDocRef(`members/${_memberID}`)
	try {
		await updateaDoc(docRef, _data)
	} catch (error) {
		console.log(error)
	}
}

/**
 * 条件にあてはまる会員docたちを取得
 * @param {*} _queryObj
 * @returns
 */
export async function searchMemberDocs(_queryObj) {
	const collectionRef = getCollectionRef('members')
	let docDatas = []
	try {
		const docsnaps = await getDocSnaps(collectionRef, _queryObj)
		if (docsnaps != null) {
			docsnaps.forEach((docsnap) => {
				docDatas.push(docsnap.data())
			})
			return docDatas
		} else {
			return null
		}
	} catch (error) {
		console.log(error)
		return null
	}
}
/**
 * 会員docを削除（memberIDで指定）
 * @param {*} _memberID
 * NOTE:削除のさいのキーは「memberID」のみ（LINEuIDではやらない）
 */
export async function deleteMemberDoc(_memberID) {
	const docRef = getDocRef(`members/${_memberID}`)
	try {
		await deleteaDoc(docRef)
	} catch (error) {
		console.log(error)
	}
}

// :::DB操作（イベントdoc系）
/**
 * イベントdocを取得（eventIDで指定）
 * @param {string} _eventID
 * @returns {object / null}
 */
export async function getEventDocData(_eventID) {
	const docRef = getDocRef(`events/${_eventID}`)
	try {
		const docSnap = await getDocSnap(docRef)
		if (docSnap != null) {
			const data = docSnap.data()
			return data
		} else {
			return null
		}
	} catch (error) {
		console.log(error)
	}
}

/**
 * 新しいeventDocを生成
 * @param {object} _data
 */
export async function setNewEventDoc(_data, _eventID = null) {
	// ランダムなeventIDを生成する

	// 生成docデータに「eventID」キーを追加する
	let data = _data
	let eventID = _eventID
	if (!eventID) {
		eventID = genHashID()
		console.log('ランダムに生成されたeventID: ', eventID)
	}
	data.eventID = eventID

	const docRef = getDocRef(`events/${eventID}`)
	try {
		await setaDoc(docRef, _data)
	} catch (error) {
		console.log(error)
	}
}

/**
 * 条件にあてはまるイベントdoc群を検索して返す関数
 * @param {*} _queryObj
 * @returns
 */
export async function searchEventDocs(_queryObj) {
	const collectionRef = getCollectionRef('events')
	let docDatas = []
	try {
		const docsnaps = await getDocSnaps(collectionRef, _queryObj)
		if (docsnaps != null) {
			docsnaps.forEach((docsnap) => {
				docDatas.push(docsnap.data())
			})
			return docDatas
		} else {
			return null
		}
	} catch (error) {
		console.log(error)
		return null
	}
}

/**
 * イベントdocを更新（eventIDで指定）
 * @param {*} _eventID
 * @param {*} _data
 */
export async function updateEventDoc(_eventID, _data) {
	const docRef = getDocRef(`events/${_eventID}`)
	try {
		await updateaDoc(docRef, _data)
	} catch (error) {
		console.log(error)
	}
}

/**
 * イベントdocを削除（イベントIDで指定）
 * @param {*} _eventID
 */
export async function deleteEventDoc(_eventID) {
	const docRef = getDocRef(`events/${_eventID}`)
	try {
		await deleteaDoc(docRef)
	} catch (error) {
		console.log(error)
	}
}

export async function deleteAllEventDoc() {
	try {
		await deleteAllDocsInCollection('events')
	} catch (error) {
		console.log(error)
	}
}

// :::メールdoc系
/**
 * イベントdocを取得（eventIDで指定）
 * @returns {object / null}
 */
export async function getMailDocData() {
	const docRef = getDocRef(`texts/mail`)
	try {
		const docSnap = await getDocSnap(docRef)
		if (docSnap != null) {
			const data = docSnap.data()
			return data
		} else {
			return null
		}
	} catch (error) {
		console.log(error)
	}
}

/**
 * 新しいeventDocを生成
 * @param {object} _data
 */
export async function setNewMailDoc(_data, _mailID = null) {
	// ランダムなeventIDを生成する

	// 生成docデータに「eventID」キーを追加する
	let data = _data
	let mailID = _mailID
	if (!mailID) {
		mailID = genHashID()
		console.log('ランダムに生成されたmailID: ', mailID)
	}
	data.mailID = mailID

	const docRef = getDocRef(`texts/${mailID}`)
	try {
		await setaDoc(docRef, _data)
	} catch (error) {
		console.log(error)
	}
}

/**
 * イベントdocを更新（eventIDで指定） 
 * @param {*} _data
 */
export async function updateMailDoc(_data) {
	const docRef = getDocRef(`texts/mail`)
	try {
		console.log('起動したよ')
		await updateaDoc(docRef, _data)
	} catch (error) {
		console.log(error)
	}
}

/**
 * イベントdocを削除（イベントIDで指定）
 * @param {*} _mailID
 */
export async function deleteMailDoc(_mailID) {
	const docRef = getDocRef(`texts/${_mailID}`)
	try {
		await deleteaDoc(docRef)
	} catch (error) {
		console.log(error)
	}
}