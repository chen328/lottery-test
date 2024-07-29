import { pureRequest } from '../request';
import cst from '../constant';
import { genRandomStr, showToast } from '../util';

export function auth(authCode) {
	return pureRequest({
		url: '/ipsponsorprod/lottery/auth',
		data: {
			authCode,
			source: cst.SOURCE
		},
		headers: {
			'content-type': 'application/json',
			'X-B3-TraceId': genRandomStr(32),
		}
	}).then(
		({ data }) => {
			const { invUserInfo, sessionId } = data || {};
			const { userId, uid } = invUserInfo || {};

			cst.USER = {
				token: sessionId,
				userId,
				uid,
				authCode,
			};

			return data;
		},
		(error) => {
			const { msg } = error;
			showToast({
				message: msg || '网络状态不佳\n请稍后重试',
			});
			return Promise.reject(error);
		},
	);
}