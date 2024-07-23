import track from './track';

// 推荐抽奖曝光
export function trackRecommendExposure(params) {
	const { prizeId = '', subject = '' } =
		(params.prizeInfoVoList && params.prizeInfoVoList[0]) || {};
	return track({
		bid: 'lotteryExposure',
		eventName: '抽奖曝光',
		pageAlias: '抽奖详情页',
		component: params.component,
		extParams: {
			activity_id: prizeId,
			activity_name: subject,
			activity_type:
				(params.consumeConfigInfoVo &&
					params.consumeConfigInfoVo.consumeType) ||
				'NORMAL',
			join_status: '0',
			brand_id:
				params.serviceFavoriteVo &&
				params.serviceFavoriteVo.serviceInfoVo &&
				params.serviceFavoriteVo.serviceInfoVo.serviceId,
			brand_name:
				params.serviceFavoriteVo &&
				params.serviceFavoriteVo.serviceInfoVo &&
				params.serviceFavoriteVo.serviceInfoVo.serviceName,
			open_mode: params.openMode,
		},
	});
}
// 推荐抽奖点击
export function trackRecommendClick(params) {
	const { prizeId = '', subject = '' } =
		(params.prizeInfoVoList && params.prizeInfoVoList[0]) || {};
	return track({
		bid: 'lotteryClick',
		pageAlias: '抽奖详情页',
		eventName: '抽奖点击',
		component: params.component,
		extParams: {
			activity_id: prizeId,
			activity_name: subject,
			activity_type:
				(params.consumeConfigInfoVo &&
					params.consumeConfigInfoVo.consumeType) ||
				'NORMAL',
			join_status: '0',
			brand_id:
				params.serviceFavoriteVo &&
				params.serviceFavoriteVo.serviceInfoVo &&
				params.serviceFavoriteVo.serviceInfoVo.serviceId,
			brand_name:
				params.serviceFavoriteVo &&
				params.serviceFavoriteVo.serviceInfoVo &&
				params.serviceFavoriteVo.serviceInfoVo.serviceName,
			open_mode: params.openMode,
		},
	});
}
// 访问抽奖详情页
export function trackEntryDetail(params, duration) {
	const extParams = {
		activity_id: params.campId,
		activity_name: params.campName,
		activity_type:
			(params.consumeConfigInfoVo && params.consumeConfigInfoVo.consumeType) ||
			'NORMAL',
		brand_id:
			params.serviceFavoriteVo &&
			params.serviceFavoriteVo.serviceInfoVo &&
			params.serviceFavoriteVo.serviceInfoVo.serviceId,
		brand_name:
			params.serviceFavoriteVo &&
			params.serviceFavoriteVo.serviceInfoVo &&
			params.serviceFavoriteVo.serviceInfoVo.serviceName,
		join_status: params.myLotteryNum ? '1' : '0',
		system_duration: duration,
		open_mode: params.openMode,
		display_column: params.displayColumn,
	};

	if (duration) {
		extParams.system_duration = duration;
	}

	return track({
		bid: 'enterPage',
		eventName: '访问抽奖详情页',
		pageAlias: '抽奖详情页',
		extParams,
	});
}
// 参与抽奖
export function trackDetailJoinActivity(params) {
	return track({
		bid: 'joinActivity',
		eventName: '参与抽奖',
		pageAlias: '抽奖详情页',
		extParams: {
			activity_id: params.campId,
			activity_name: params.campName,
			activity_type:
				(params.consumeConfigInfoVo &&
					params.consumeConfigInfoVo.consumeType) ||
				'NORMAL',
			brand_id: params.regionId,
			brand_name: params.regionName,
			join_status: '0',
			wish_gold_num: params.wish_gold_num,
			open_mode: params.openMode,
			display_column: params.displayColumn,
		},
	});
}
// 详情页链接跳转
export function trackDetailJumpOut(params) {
	return track({
		bid: 'jumpOut',
		eventName: '链接跳转',
		pageAlias: '抽奖详情页',
		component: params.component,
		extParams: {
			activity_id: params.campId,
			activity_name: params.campName,
			activity_type:
				(params.consumeConfigInfoVo &&
					params.consumeConfigInfoVo.consumeType) ||
				'NORMAL',
			brand_id: params.regionId,
			brand_name: params.regionName,
			join_status: '0',
			link_url: params.link_url,
			open_mode: params.openMode,
		},
	});
}
// 分享点击
export function trackDetailShare(params) {
	return track({
		bid: 'shareClick',
		eventName: '分享点击',
		pageAlias: '抽奖详情页',
		extParams: {
			activity_id: params.campId,
			activity_name: params.campName,
			activity_type:
				(params.consumeConfigInfoVo &&
					params.consumeConfigInfoVo.consumeType) ||
				'NORMAL',
			brand_id: params.regionId,
			brand_name: params.regionName,
			join_status: params.myLotteryNum ? '1' : '0',
		},
	});
}
// 跳转心愿卡任务也
export function trackDetailGetLottery() {
	return track({
		bid: 'getLotteryCardClick',
		pageAlias: '抽奖详情页',
		eventName: '跳转心愿卡任务页',
	});
}

// 广告位曝光
export function trackAdSpotExposure(params) {
	return track({
		bid: 'adSpotExposure',
		eventName: '广告位曝光',
		pageAlias: '抽奖详情页',
		component: params.component, // 详情页图片/开奖消息弹窗
		extParams: {
			activity_id: params.campId,
			activity_name: params.campName,
			activity_type:
				(params.consumeConfigInfoVo &&
					params.consumeConfigInfoVo.consumeType) ||
				'NORMAL',
			brand_id: params.regionId,
			brand_name: params.regionName,
			link_url: params.link_url,
		},
	});
}

// 广告位点击
export function trackAdSpotClick(params) {
	return track({
		bid: 'adSpotClick',
		eventName: '广告位点击',
		pageAlias: '抽奖详情页',
		component: params.component, // 详情页图片/开奖消息弹窗
		extParams: {
			activity_id: params.campId,
			activity_name: params.campName,
			activity_type:
				(params.consumeConfigInfoVo &&
					params.consumeConfigInfoVo.consumeType) ||
				'NORMAL',
			brand_id: params.regionId,
			brand_name: params.regionName,
			link_url: params.link_url,
		},
	});
}

/**
  * 任务埋点对象
  * @param {*} extParams 
  * {
      task_id: params.task_id,
      task_name: params.task_name,
      task_status: params.task_status, // 1-未参与 0-参与成功？
      event_source: params.event_source, // homeGuideClick
    }
  * @returns 
*/
// 翻倍任务曝光
export function trackTaskExposure(extParams) {
	return track({
		bid: 'taskExposure',
		eventName: '任务曝光',
		pageAlias: '抽奖详情页',
		component: '翻倍任务',
		extParams,
	});
}

// 翻倍任务点击: 任务埋点对象同上
export function trackTaskClick(extParams) {
	return track({
		bid: 'taskClick',
		eventName: '任务点击',
		pageAlias: '抽奖详情页',
		component: '翻倍任务',
		extParams,
	});
}

// 翻倍任务完成: 任务埋点对象同上
export function trackTaskFinish(extParams) {
	return track({
		bid: 'taskFinish',
		eventName: '任务完成',
		pageAlias: '抽奖详情页',
		component: '翻倍任务',
		extParams,
	});
}

// 心愿金去领取曝光
export function trackGoWishGoldExposure(params) {
	return track({
		bid: 'goWishGoldExposure',
		eventName: '心愿金去领取曝光',
		pageAlias: '抽奖详情页',
		component: params.component, // 新用户弹窗/参与3次抽奖弹窗/参与5次抽奖弹窗/心愿金悬浮标/详情页底部心愿金入口 首页-心愿金入口/详情页开奖弹窗-心愿金banner/详情页开奖弹窗-心愿金数量
	});
}

// 心愿金去领取点击
export function trackGoWishGoldClick(params) {
	return track({
		bid: 'goWishGoldClick',
		eventName: '心愿金去领取点击',
		pageAlias: '抽奖详情页',
		component: params.component, // 新用户弹窗/参与3次抽奖弹窗/参与5次抽奖弹窗/心愿金悬浮标/详情页底部心愿金入口 首页-心愿金入口/详情页开奖弹窗-心愿金banner/详情页开奖弹窗-心愿金数量
	});
}

// 心愿金去领取关闭
export function trackGoWishGoldClose(params) {
	return track({
		bid: 'goWishGoldClose',
		eventName: '心愿金去领取关闭',
		pageAlias: '抽奖详情页',
		component: params.component, // 新用户弹窗/参与3次抽奖弹窗/参与5次抽奖弹窗/心愿金悬浮标/详情页底部心愿金入口
	});
}

// 抽奖曝光
export function trackLotteryExposure(params) {
	return track({
		bid: 'lotteryExposure',
		eventName: '抽奖曝光',
		pageAlias: '抽奖详情页',
		component: params.component, // '参与成功弹窗-私域抽奖-图片版'
		extParams: {
			activity_id: params.campId, // 抽奖id
			activity_name: params.campName, // 活动名称
			activity_type:
				(params.consumeConfigInfoVo &&
					params.consumeConfigInfoVo.consumeType) ||
				'NORMAL', //
			join_status: 0, // '0-未参与，1-已参与',
			open_mode: params.openMode,
		},
	});
}

// 抽奖点击
export function trackLotteryClick(params) {
	return track({
		bid: 'lotteryClick',
		eventName: '抽奖点击',
		pageAlias: '抽奖详情页',
		component: params.component, // 参与成功弹窗-私域抽奖-图片版/ 参与成功弹窗-私域抽奖-文字版
		extParams: {
			activity_id: params.campId, // 抽奖id
			activity_name: params.campName, // 活动名称
			activity_type:
				(params.consumeConfigInfoVo &&
					params.consumeConfigInfoVo.consumeType) ||
				'NORMAL', //
			join_status: 0, // '0-未参与，1-已参与',
			open_mode: params.openMode,
		},
	});
}

// 跳转做任务列表点击
export function trackPointsLotteryJumpTask(params) {
	return track({
		bid: 'jumpToTaskListClick',
		eventName: '跳转做任务列表点击',
		pageAlias: '抽奖详情页',
		component: '心愿金任务',
		extParams: {
			activity_id: params.campId, // 抽奖id
			activity_name: params.campName, // 活动名称
			activity_type:
				(params.consumeConfigInfoVo &&
					params.consumeConfigInfoVo.consumeType) ||
				'NORMAL',
			open_mode: params.openMode,
		},
	});
}

// 心愿金抽奖按钮曝光
export function trackPointsLotteryBtnExposure(params) {
	return track({
		bid: 'activityExposure',
		eventName: '抽奖按钮曝光',
		pageAlias: '抽奖详情页',
		extParams: {
			activity_id: params.campId, // 抽奖id
			activity_name: params.campName, // 活动名称
			activity_type: 'WISH_GOLD',
			join_status: '0',
		},
	});
}

/**
 * 心愿金限时活动入口曝光
 */
export function trackNewYearWishGoldExposure() {
	return track({
		bid: 'goTimeActivityWishGoldExposure',
		eventName: '心愿金限时活动入口曝光',
		pageAlias: '抽奖详情页',
		component: '抽奖详情页右下角气泡',
	});
}

/**
 * 心愿金限时活动入口点击
 */
export function trackNewYearWishGoldClick() {
	return track({
		bid: 'goTimeActivityWishGoldClick',
		eventName: '心愿金限时活动入口点击',
		pageAlias: '抽奖详情页',
		component: '抽奖详情页右下角气泡',
	});
}

/**
 * 心愿金分享召回
 */
export function trackWishShareTaskVisit(shareTaskId) {
	return track({
		bid: 'wishShareTaskVisit',
		eventName: '心愿金分享召回',
		pageAlias: '抽奖详情页',
		component: '心愿金分享任务',
		extParams: {
			help_uid: shareTaskId,
		},
	});
}

/**
 * 心愿金分享助力成功
 */
export function trackWishShareTaskHelpFinish(shareTaskId) {
	return track({
		bid: 'wishShareTaskHelpFinish',
		eventName: '心愿金分享助力成功',
		pageAlias: '抽奖详情页',
		component: '心愿金分享任务',
		extParams: {
			help_uid: shareTaskId,
		},
	});
}

// 奖品发放失败
export function trackPrizeLotteryError(params) {
	return track({
		bid: 'prizeLotteryError',
		eventName: '奖品发放失败',
		pageAlias: '抽奖详情页',
		extParams: {
			activity_id: params.campId,
			activity_name: params.campName,
			activity_type:
				(params.consumeConfigInfoVo &&
					params.consumeConfigInfoVo.consumeType) ||
				'NORMAL',
			brand_id: params.regionId,
			brand_name: params.regionName,
			join_status: '1',
			wish_gold_num: params.wish_gold_num,
			open_mode: params.openMode,
		},
	});
}

/**
 * 查看中奖点击
 */
export function trackLookLotteryPrizeClick(params) {
	return track({
		bid: 'lookLotteryPrizeClick',
		eventName: '查看中奖点击',
		pageAlias: '抽奖详情页',
		component: '即时抽奖',
		extParams: {
			activity_id: params.campId,
			activity_name: params.campName,
			activity_type:
				(params.consumeConfigInfoVo &&
					params.consumeConfigInfoVo.consumeType) ||
				'NORMAL',
			brand_id: params.regionId,
			brand_name: params.regionName,
			join_status: '1',
			wish_gold_num: params.wish_gold_num,
			open_mode: params.openMode,
		},
	});
}

/**
 * 未中奖曝光
 */
export function trackLotteryPrizeFailedExposure(params) {
	return track({
		bid: 'lotteryPrizeFailedExposure',
		eventName: '未中奖曝光',
		pageAlias: '抽奖详情页',
		component: params.component, // '即时抽奖-0.1元-弹窗/即时抽奖-0.1元-按钮'
		extParams: {
			activity_id: params.campId,
			activity_name: params.campName,
			activity_type:
				(params.consumeConfigInfoVo &&
					params.consumeConfigInfoVo.consumeType) ||
				'NORMAL',
			brand_id: params.regionId,
			brand_name: params.regionName,
			join_status: '1',
			wish_gold_num: params.wish_gold_num,
			open_mode: params.openMode,
		},
	});
}

/**
 * 未中奖点击
 */
export function trackLotteryPrizeFailedClick(params) {
	return track({
		bid: 'lotteryPrizeFailedClick',
		eventName: '未中奖点击',
		pageAlias: '抽奖详情页',
		component: params.component,
		extParams: {
			activity_id: params.campId,
			activity_name: params.campName,
			activity_type:
				(params.consumeConfigInfoVo &&
					params.consumeConfigInfoVo.consumeType) ||
				'NORMAL',
			brand_id: params.regionId,
			brand_name: params.regionName,
			join_status: '1',
			wish_gold_num: params.wish_gold_num,
			open_mode: params.openMode,
		},
	});
}

/**
 * 曝光错误
 */
export function trackExposureError(params) {
	return track({
		eventId: 'exposureError',
		eventName: '曝光错误',
		pageAlias: params.pageAlias,
		component: 'cpm组件',
		extParams: {
			space_code: params.space_code,
		},
	});
}

/**
 * 曝光成功
 */
export function trackExposureSuccess(params) {
	return track({
		eventId: 'exposureSuccess',
		eventName: '曝光成功',
		pageAlias: params.pageAlias,
		component: 'cpm组件',
		extParams: {
			space_code: params.space_code,
		},
	});
}

export function trackAbTest(test_label) {
	return track({
		eventId: 'abTest',
		eventName: 'abTest',
		extParams: {
			test_name: '抽奖详情页改版',
			test_label, // A-旧版，B-新版
		},
	});
}

/**
 * 心愿金门槛曝光
 */
export function trackWishGoldThresholdExposure(params) {
	return track({
		eventId: 'wishGoldThresholdExposure',
		eventName: '心愿金门槛曝光',
		pageAlias: '抽奖详情页',
		extParams: {
			activity_id: params.campId,
			activity_name: params.campName,
			activity_type:
				(params.consumeConfigInfoVo &&
					params.consumeConfigInfoVo.consumeType) ||
				'NORMAL',
			brand_id: params.regionId,
			brand_name: params.regionName,
			join_status: '0', // "0-未参与，1-已参与"
			wish_gold_progress: params.receiveWishGold, // 心愿金进度个数
		},
	});
}

/**
 * 心愿金门槛点击
 */
export function trackWishGoldThresholdClick(params) {
	return track({
		eventId: 'wishGoldThresholdClick',
		eventName: '心愿金门槛点击',
		pageAlias: '抽奖详情页',
		extParams: {
			activity_id: params.campId,
			activity_name: params.campName,
			activity_type:
				(params.consumeConfigInfoVo &&
					params.consumeConfigInfoVo.consumeType) ||
				'NORMAL',
			brand_id: params.regionId,
			brand_name: params.regionName,
			join_status: '0',
			wish_gold_progress: params.receiveWishGold,
		},
	});
}

/**
 * 渠道私域红包弹窗曝光
 */
export function trackPrivateSourceRedPacketExposure() {
	return track({
		eventId: 'privateSourceRedPacketExposure',
		eventName: '渠道私域红包弹窗曝光',
		pageAlias: '抽奖详情页',
	});
}

/**
 * 渠道私域红包弹窗点击
 */
export function trackPrivateSourceRedPacketClick() {
	return track({
		eventId: 'privateSourceRedPacketClick',
		eventName: '渠道私域红包弹窗点击',
		pageAlias: '抽奖详情页',
	});
}

/**
 * 优选广告曝光
 */
export function trackGuideExposure(task_type) {
	return track({
		eventId: 'guideExposure',
		eventName: '隐藏任务曝光',
		pageAlias: '抽奖详情页',
		component: '隐藏资源位',
		extParams: {
			task_type,
		},
	});
}

/**
 * 优选广告点击
 */
export function trackGuideClick(task_type) {
	return track({
		eventId: 'guideClick',
		eventName: '隐藏任务点击',
		pageAlias: '抽奖详情页',
		component: '隐藏资源位',
		extParams: {
			task_type,
		},
	});
}


/**
 * 晒奖入口曝光
 */
export function trackShowPrizeExposure(params) {
	return track({
		eventId: 'showPrizeExposure',
		eventName: '晒奖入口曝光',
		pageAlias: '页面名称',
		// component: '顶部中奖轮播/开奖弹窗/消息列表banner/中奖记录banner',
		component: params.component,
	});
}

/**
 * 晒奖入口点击
 */
export function trackShowPrizeClick(params) {
	return track({
		eventId: 'showPrizeClick',
		eventName: '晒奖入口点击',
		pageAlias: '页面名称',
		// component: '顶部中奖轮播/开奖弹窗/消息列表banner/中奖记录banner',
		component: params.component,
	});
}