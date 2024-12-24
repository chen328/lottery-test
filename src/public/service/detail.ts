import request from '../request';

export function itemDetail(param) {
	return request({
		headers: {
			'content-type': 'application/json',
		},
		data: {
			...param,
		},
		method: 'POST',
		url: '/ipsponsorprod/lottery/camp/query',
	});
}

export function sendReport(queryParams) {
	return request({
		headers: {
			'content-type': 'application/json',
		},
		data: {
			...queryParams,
		},
		method: 'POST',
		url: '/ipsponsorprod/lottery/camp/read/result/report',
	});
}

export function messagePointProvide(params) {
	return request({
		headers: {
			'content-type': 'application/json',
		},
		data: {
			...params,
		},
		method: 'POST',
		url: '/ipsponsorprod/lottery/point/message/point/provide',
	});
}

export function queryAdv(params) {
	return request({
		headers: {
			'content-type': 'application/json',
		},
		data: {
			...params,
		},
		method: 'POST',
		url: '/ipsponsorprod/lottery/camp/adv/config/list',
	});
}

export async function lotteryAction(param) {
	return await request({
		headers: {
			'content-type': 'application/json',
		},
		data: {
			...param,
		},
		method: 'POST',
		url: '/ipsponsorprod/lottery/camp/lottery',
		disabledErrorToast: true,
	});
}

// 参与门槛查询
export async function lotteryFreeQuery() {
	return request({
		headers: {
			'content-type': 'application/json',
		},
		data: {},
		method: 'GET',
		url: '/ipsponsorprod/lottery/point/lottery/free/query',
	});
}

export function channelReport(params) {
	return request({
		headers: {
			'content-type': 'application/json',
		},
		data: {
			...params,
		},
		method: 'POST',
		url: '/ipsponsorprod/lottery/channel/config/user/report',
	});
}

export function receiveAward(param) {
	return request({
		headers: {
			'content-type': 'application/json',
		},
		data: {
			...param,
		},
		method: 'POST',
		url: '/ipsponsorprod/lottery/camp/award',
	});
}
