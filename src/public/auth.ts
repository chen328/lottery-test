import qs from 'qs';
import cst from './constant';
import { auth } from './service/common';
import { showToast } from './util';

export function getAuth() {
	return new Promise((resolve, reject) => {
		const { search, href } = location || {};
		const hrefSplit = href.split('?') || [];
		const hrefSearch = hrefSplit[1] || '';
		const { AUTH_CODE } = qs.parse(search || hrefSearch, {
			ignoreQueryPrefix: true,
		}); // 本地开发鉴权
		// const isBackUrl = href.includes(cst.ALIPAY_CALLBACK_URL);

		if (ap.isAlipay && !AUTH_CODE) {
			ap.getAuthCode(
				{
					appId: cst.APP_ID,
					scopes: ['auth_base'],
				},
				function (res) {
					const { authCode, errorMessage } = res;

					if (cst.ENV === 'k8s') {
						console.log(res, 'getAuthCode');
					}

					if (authCode) {
						auth(authCode).then(
							(data) => resolve(data),
							(error) => reject(error),
						);
					} else {
						showToast({ message: JSON.stringify(errorMessage) });
						reject(errorMessage);
					}
				},
			);
		} else if (AUTH_CODE) {
			auth(AUTH_CODE).then(
				(data) => resolve(data),
				(error) => reject(error),
			);
		}
	});
}
