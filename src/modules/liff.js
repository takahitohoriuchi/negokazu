// import { getMemberDocDataWithLINEuID } from '@/modules/utils'

const liffID = '1657647955-me5dOKZR' //たとえば、1657042783-Xo1lzbmv
const liff = require('@line/liff')

/**
 * LINEuIDを取得して返す関数
 * @returns {Any}LINEuID（文字列またはnull）
 */
export async function getLIFFInfo() {
	await liff.init({ liffId: liffID })
	let isInClient = await liff.isInClient()
	let LINEuID = undefined
	if (isInClient) {
		const liffProfile = await liff.getProfile()
		LINEuID = liffProfile.userId
	} else {
		LINEuID = null
	}
	console.log('LINEuID（@liff.js）: ', LINEuID)
	return LINEuID
}
