import track from './track';
// import get from 'lodash/get';

export function enterPage(duration) {
	return track({
		bid: 'enterPage',
		eventName: '访问抽奖列表页',
		pageAlias: '抽奖列表页',
		appKey: 'lottery_everyday',
		extParams: {
			system_duration: duration,
		},
	});
}

function getCampParams(campInfo = {}) {
	const {
		campId,
		campName,
		consumeConfigInfoVo,
		partnerRegionName,
		partnerRegionId,
		myLotteryNum,
		displayStatus,
		openMode,
	} = campInfo;
	return {
		activity_id: campId, // 抽奖id
		activity_name: campName, // 活动名称
		activity_type: consumeConfigInfoVo ? 1 : 0, // 抽奖类型，0-0元抽奖,1-积分抽奖
		// brand_id: get(
		// 	campInfo,
		// 	'serviceFavoriteVo.serviceInfoVo.serviceId',
		// 	partnerRegionId,
		// ),
		// brand_name: get(
		// 	campInfo,
		// 	'serviceFavoriteVo.serviceInfoVo.serviceName',
		// 	partnerRegionName,
		// ),
		join_status: +myLotteryNum > 0 ? 1 : 0, // '0-未参与，1-已参与',
		activity_status: displayStatus,
		open_mode: openMode,
	};
}

export function lotteryExposure(camp, component, pageAlias = '抽奖列表页') {
	return track({
		bid: 'lotteryExposure',
		eventName: '抽奖曝光',
		pageAlias,
		appKey: 'lottery_everyday',
		component,
		// extParams: getCampParams(camp),
	});
}
export function lotteryClick(
	camp,
	component,
	pageAlias = '抽奖列表页', // 抽奖详情页
) {
	return track({
		bid: 'lotteryClick',
		eventName: '抽奖点击',
		pageAlias,
		appKey: 'lottery_everyday',
		component,
		// extParams: getCampParams(camp),
	});
}