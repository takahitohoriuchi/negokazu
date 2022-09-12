// SECTION:なんでも系
import Hashids from 'hashids'

/**
 * 好きな時間処理を止めて、その後に指定した関数を実行する
 * @param {*} waitSec
 * @param {*} callbackFunc
 */
export function sleep(waitSec, callbackFunc) {
	// 経過時間（秒）
	var spanedSec = 0
	// 1秒間隔で無名関数を実行
	var id = setInterval(function () {
		spanedSec++
		// 経過時間 >= 待機時間の場合、待機終了。
		if (spanedSec >= waitSec) {
			// タイマー停止
			clearInterval(id)
			// 完了時、コールバック関数を実行
			if (callbackFunc) callbackFunc()
		}
	}, 1000)
}

const dayMap = {
	0: '日',
	1: '月',
	2: '火',
	3: '水',
	4: '木',
	5: '金',
	6: '土',
}
export function jstNewDate() {
	const d = new Date(Date.now() + (new Date().getTimezoneOffset() + 9 * 60) * 60 * 1000)
	console.log('jstNewDate: ', d)
}

/**
 * timestampから●年●月●日●時●分を取得
 * @param {*} _timestamp
 * @returns
 */
export function getYMDHMfromTimeStamp(_timestamp) {
	const d = new Date(_timestamp)
	const year = d.getFullYear()
	const month = d.getMonth() + 1
	const date = d.getDate()
	const hours = d.getHours()
	const minutes = d.getMinutes()

	const YMDHM = `${year}年${month}月${date}日${hours}時${minutes}分`
	console.log('YMDHM: ', YMDHM)
	return YMDHM
}

/**
 * タイムスタンプから年月日表示に変える
 * @param {*} _timestamp
 * @returns
 */
export function getYMDfromTimeStamp(_timestamp) {
	const d = new Date(_timestamp)
	const year = d.getFullYear()
	const month = d.getMonth() + 1
	const date = d.getDate()
	const YMDHM = `${year}年${month}月${date}日`
	return YMDHM
}

/**
 * timestampから曜日（'日' or '月' or ...を取得）
 * @param {*} _timestamp
 * @returns
 */
export function getYoubiFromTimeStamp(_timestamp) {
	const d = new Date(_timestamp)
	const day = d.getDay()
	const youbi = dayMap[day]
	return youbi
}

/**
 * タイムスタンプから「●時●分」という文字列を返す
 * @param {*} _timestamp
 * @returns
 */
export function getHMfromTimeStamp(_timestamp) {
	const d = new Date(_timestamp)
	const hour = d.getHours()
	const minutes = d.getMinutes()
	const HM = `${hour}時${minutes}分`
	return HM
}

export function getHiduke4PickerDateFromTimeStamp(_timestamp) {
	const d = new Date(_timestamp)
	return d.toISOString().substr(0, 10)
	// const year = d.getFullYear()
	// const minutes = d.getMonth()
	// const date = d.getDate()
	// const string = String(year) + '-' +  String(month+1) + '-' + String(date)
	// console.log('string: ', string)
	// return string
}

/**
 * ランダムなIDを生成する
 * @returns id
 */
export function genHashID(_n = 0) {
	const hashids = new Hashids('', 10)
	const time = new Date().getTime()
	const rand = Math.floor(Math.random() * 100000)
	const hashSeed = time + rand - _n
	const id = hashids.encode(hashSeed)
	console.log('ランダムに生成されたid: ', id)
	return id
}
