import { pureRequest } from '../request';
import cst from '../constant';
import { showErrorDialog } from '../util';

export function auth(authCode) {
	return pureRequest({
		url: '/alipay/auth',
		data: `authCode=${authCode}&source=${cst.SOURCE}`,
	}).then(
		({ data }) => {
			const { token, user } = data || {};
			const { userId, uid } = user || {};

			cst.USER = {
				token,
				userId,
				uid,
				authCode,
			};

			return data;
		},
		(error) => {
			const { msg } = error;
			showErrorDialog({
				message: msg || '网络状态不佳\n请稍后重试',
			});
			return Promise.reject(error);
		},
	);
}