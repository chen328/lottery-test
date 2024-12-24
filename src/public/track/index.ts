import track from './track';
import cst from '../constant';

/**
 * 系统信息
 */
export function trackSystemInfo() {
	return track({
		bid: 'systemInfo',
		eventName: '系统信息',
		extParams: {
			systemInfo: JSON.stringify({
				model: navigator.userAgent,
			}),
		},
	});
}

export function trackSource(source) {
	return track({
		bid: 'source',
		eventName: '用户来源',
		extParams: {
			source: JSON.stringify(source),
		},
	});
}

export function trackUserInfo() {
	const { userId, uid } = cst.USER;
	return track({
		bid: 'userInfo',
		eventName: '用户信息',
		extParams: {
			userInfo: JSON.stringify({
				userId: userId,
				bizUserId: userId,
				uid,
			}),
		},
	});
}

export function trackEnterPage({
	pageId = '',
	eventName = '访问社群h5页',
	pageAlias = '社群h5页',
}) {
	return track({
		bid: 'enterPage',
		eventName,
		pageAlias,
		extParams: {
			page_id: pageId,
		},
	});
}
