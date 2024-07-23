import request from '../request';

/**
 * @name C端/聚合页页面任务列表
 * @api http://sapi.shuli.com/project/187/interface/api/33276
 */
export function homePrizesList(queryParams) {
	return request({
		method: 'POST',
		url: '/ipsponsorprod/lottery/camp/index',
		headers: {
			'content-type': 'application/json',
		},
		data: {
			...queryParams,
		},
	});
}
