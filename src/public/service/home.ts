import request from '../request';
import config from '../../public/constant';

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
			clientVersion: config.clientVersion,
		},
	});
}

/**
 * @name C端/聚合页页面-查询最近中奖信息
 * @api http://sapi.shuli.com/project/187/interface/api/33276
 */
export function queryRecentLuckDogs(queryParams) {
	return request({
		method: 'POST',
		url: '/ipsponsorprod/lottery/camp/recent/luck/dog/list',
		headers: {
			'content-type': 'application/json',
		},
		data: {
			...queryParams,
			clientVersion: config.clientVersion,
		},
	});
}