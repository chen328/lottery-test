/* eslint-disable no-nested-ternary */
/* eslint-disable no-lonely-if */
const LOTTERY_STATE = {
	INIT: 'INIT', // 编辑中: 待提审/审核拒绝
	AUDITING: 'AUDITING', // 已提审: 待审核
	WAIT_GOING: 'WAIT_GOING', // 审核通过: 待开始
	GOING: 'GOING', // 进行中: 待开奖
	WAIT_OPEN: 'WAIT_OPEN', // 开奖中，备注: 后端开奖需要一定时间
	ENDED: 'ENDED', // 已经开奖
	EXPIRED: 'EXPIRED', // 已过期: 未上架
	INVALID: 'INVALID', // 下架
	REJECT: 'REJECT', // 审核未通过
};

/**
 * 可展示
 */
function isCampValid(status) {
	return (
		[
			LOTTERY_STATE.GOING,
			LOTTERY_STATE.WAIT_GOING,
			LOTTERY_STATE.WAIT_OPEN,
			LOTTERY_STATE.ENDED,
		].indexOf(status) >= 0
	);
}

function getSubText({ openMode, budgetValue }, cGmtEnd) {
	if (openMode === 'TIME') {
		return `${cGmtEnd}`;
	} else if (openMode === 'PERSON') {
		return `满${budgetValue}人`;
	} else {
		return '';
	}
}

function getWishCardProductCode(wishCardProductVos) {
	if (!wishCardProductVos || !wishCardProductVos[0]) {
		return '';
	}

	const { productCode } = wishCardProductVos[0] || {};
	return productCode || '';
}

function getWishState(status, participated) {
	if (!isCampValid(status)) {
		return 'pa-disabled';
	}
	return participated ? 'pa-done' : null;
}

function getParticipateNum(participantNum, isAdmin) {
	if (isNaN(participantNum)) {
		return '';
	}

	if (+participantNum < 10000) {
		return participantNum;
	} else {
		if (!isAdmin && +participantNum > 100000) {
			return '10万+';
		}

		return `${Math.round(participantNum / 1000) / 10}万+`;
	}
}

function isCanMakeWish(prizeItemParam) {
	return (
		prizeItemParam.displayWeight === 95 &&
		prizeItemParam.displayColumn === 'NORMAL'
	);
}

function getBtnsConfig({
	fromHome = false,
	isAdmin = false,
	campLotteryTransVo = {},
	followLifeName,
	rightBtnAction,
	condition, // 参与条件
	customParams = {}, // 针对场景的定制参数
	campInviteVo = {}, // 邀请人
	customerActionBtn = {}, // 活动定制按钮样式(包括文字、背景图、气泡)
	haveGoToServiceLink = false, // 是否已完成逛一逛
	needLotteryPreGuide = false, // 是否需要引导获取抽奖资格
	lotteryPreGuideVo = {}, // 抽奖前动作
	lotteryPostGuideVo = {}, // 抽奖后动作
	consumeConfigInfoVo = {}, // 消费配置
	mainSubText = '', // 收藏关注天天抽奖小程序的小字文案
	lotteryDoingGuideVo = {}, // 抽奖时动作
	abstractCampInfo = {}, // 活动摘要信息
	campClause = {}, // 活动配置
	serviceFavoriteVo = {}, // 服务信息配置
	isSubscribe = false, // 活动提醒订阅
	campRefuelTaskTransVoList = [], // 翻倍任务概率
	campRefuelTaskVoList = [],
	isChannelLottery = false, // 是否为渠道抽奖
	isImmediateLottery = false,
	unimktTaskInfoVo = null,
}: any) {
	let leftBtn;
	let rightBtn;
	let startInfo;
	// 是否可分享
	const sharable = !!campClause.supportForward;
	// 参与抽奖人数显示状态 pa-disabled/pa-done/pa-active
	const participateNumStatus = getWishState(
		abstractCampInfo.displayStatus,
		abstractCampInfo.myLotteryNum,
	);
	// 抽奖码个数
	const { myLotteryNum } = abstractCampInfo;
	// 参与总人数
	const participateNum = getParticipateNum(
		abstractCampInfo.participantNum,
		isAdmin,
	);
	// 分享数
	const shareNum = getParticipateNum(abstractCampInfo.shareNum, isAdmin);
	const { campScene } = abstractCampInfo;
	// 是否有显示红包
	let showTmsRedPacket = !(
		consumeConfigInfoVo && consumeConfigInfoVo.consumeType
	);

	// A. 未开始
	if (abstractCampInfo.displayStatus === LOTTERY_STATE.WAIT_GOING) {
		// 未开始，不显示红包入口
		showTmsRedPacket = false;
		startInfo = `活动将于${abstractCampInfo.cGmtStart}开始`;
		leftBtn = {
			show: true,
			text: '暂未开始',
			state: 'btn-disabled',
			buttonBg:
				(customerActionBtn &&
					customerActionBtn.stepOneButton &&
					customerActionBtn.stepOneButton.disabledButtonBg) ||
				'/images/awardDetail/btn-disabled.png',
		};
	} else if (abstractCampInfo.displayStatus === LOTTERY_STATE.GOING) {
		// B. 进行中

		// B.1 未参与

		if (!abstractCampInfo.myLotteryNum) {
			let { tip } = condition || {};
			const { hideTip } = condition || {};
			tip = hideTip ? null : tip;
			// 未参与，不显示红包入口
			showTmsRedPacket = false;

			// 未参与新增前置任务配置逻辑
			if (
				serviceFavoriteVo &&
				serviceFavoriteVo.serviceInfoVo &&
				serviceFavoriteVo.serviceInfoVo.serviceAdvInfoVo &&
				serviceFavoriteVo.serviceInfoVo.serviceAdvInfoVo.advInfoType &&
				!haveGoToServiceLink
			) {
				const { advInfoType, quantity } =
					serviceFavoriteVo.serviceInfoVo.serviceAdvInfoVo;
				if (advInfoType === 'SHARE_TASK') {
					leftBtn = {
						show: true,
						tip:
							serviceFavoriteVo.serviceInfoVo.serviceAdvInfoVo.title ||
							'完成下面任务后, 可参与抽奖',
						tipUrl: '',
						text:
							serviceFavoriteVo.serviceInfoVo.serviceAdvInfoVo.linkDesc ||
							'分享后参与抽奖',
						subText: '',
						state: 'pa-active',
						buttonBg: '/images/awardDetail/btn-active.png',
					};
				} else if (advInfoType === 'FINISH_TASK') {
					// 前置 3次抽奖任务
					let title;
					switch (quantity) {
						case '0':
							title =
								serviceFavoriteVo.serviceInfoVo.serviceAdvInfoVo.title ||
								'完成下面任务后, 可参与抽奖';
							break;
						case '1':
							title = '再参与2个其他抽奖, 即可完成';
							break;
						case '2':
							title = '再参与1个其他抽奖, 即可完成';
							break;
						default:
							title = '高概率中奖, 越努力越幸运';
							break;
					}
					leftBtn = {
						show: true,
						tip: title,
						tipUrl: '',
						text:
							serviceFavoriteVo.serviceInfoVo.serviceAdvInfoVo.linkDesc ||
							'去逛逛',
						subText: '',
						state: 'pa-active',
						buttonBg: '/images/awardDetail/btn-active.png',
					};
				} else if (advInfoType === 'JUMP_STOP_TASK') {
					leftBtn = {
						show: true,
						tip:
							serviceFavoriteVo.serviceInfoVo.serviceAdvInfoVo.title ||
							'浏览3秒,参与抽奖',
						tipUrl: '',
						text: isChannelLottery
							? '参与抽奖'
							: serviceFavoriteVo.serviceInfoVo.serviceAdvInfoVo.linkDesc ||
								'去逛逛',
						subText: '',
						state: 'pa-active',
						buttonBg: '/images/awardDetail/btn-active.png',
					};
				} else if (advInfoType === 'JUMP_TASK') {
					leftBtn = {
						show: true,
						tip:
							serviceFavoriteVo.serviceInfoVo.serviceAdvInfoVo.title ||
							'逛一逛参与抽奖',
						tipUrl: '',
						text:
							serviceFavoriteVo.serviceInfoVo.serviceAdvInfoVo.linkDesc ||
							'去逛逛',
						subText: '',
						state: 'pa-active',
						buttonBg: '/images/awardDetail/btn-active.png',
					};
				} else if (advInfoType === 'QUESTIONNAIRE') {
					leftBtn = {
						show: true,
						tip:
							serviceFavoriteVo.serviceInfoVo.serviceAdvInfoVo.title ||
							'填写问卷, 参与抽奖',
						tipUrl: '',
						text:
							serviceFavoriteVo.serviceInfoVo.serviceAdvInfoVo.linkDesc ||
							'去逛逛',
						subText: '',
						state: 'pa-active',
						buttonBg: '/images/awardDetail/btn-active.png',
					};
				} else if (advInfoType === 'MULTIPLE_TASK') {
					// 多前置任务 不是首次展示再抽一次
					const index =
						serviceFavoriteVo.serviceInfoVo.serviceAdvInfoVo.multiLinks.findIndex(
							(i) => i.status === 0,
						);
					const item =
						serviceFavoriteVo.serviceInfoVo.serviceAdvInfoVo.multiLinks[index];
					const getTip = () => {
						if (index !== 0) {
							if (item.taskType === 'SHARE_TASK') {
								return '分享好友，参与抽奖';
							} else if (item.taskType === 'JOIN_GROUP') {
								return '加入抽奖群后抽奖';
							} else {
								return '逛3s, 返回即可抽奖';
							}
						} else {
							return serviceFavoriteVo.serviceInfoVo.serviceAdvInfoVo.title;
						}
					};
					leftBtn = {
						show: true,
						tip: getTip(),
						tipUrl: '',
						text:
							index > 0
								? '再抽一次'
								: serviceFavoriteVo.serviceInfoVo.serviceAdvInfoVo.linkDesc ||
									'再抽一次',
						subText: '',
						state: 'pa-active',
						buttonBg: '/images/awardDetail/btn-active.png',
					};
				} else if (advInfoType === 'JOIN_GROUP') {
					leftBtn = {
						show: true,
						tip:
							serviceFavoriteVo.serviceInfoVo.serviceAdvInfoVo.title ||
							'加入品牌社群，参与抽奖',
						tipUrl: '',
						text:
							serviceFavoriteVo.serviceInfoVo.serviceAdvInfoVo.linkDesc ||
							'参与抽奖',
						subText: '',
						state: 'pa-active',
						buttonBg: '/images/awardDetail/btn-active.png',
					};
				} else if (advInfoType === 'MEMBERSHIP') {
					leftBtn = {
						show: true,
						tip:
							serviceFavoriteVo.serviceInfoVo.serviceAdvInfoVo.title ||
							'加入品牌会员，参与抽奖',
						tipUrl: '',
						text:
							serviceFavoriteVo.serviceInfoVo.serviceAdvInfoVo.linkDesc ||
							'参与抽奖',
						subText: '',
						state: 'pa-active',
						buttonBg: '/images/awardDetail/btn-active.png',
					};
				} else if (advInfoType === 'HIDE_CPM') {
					leftBtn = {
						show: true,
						tip:
							serviceFavoriteVo.serviceInfoVo.serviceAdvInfoVo.title ||
							'加入品牌会员，参与抽奖',
						tipUrl: '',
						text:
							serviceFavoriteVo.serviceInfoVo.serviceAdvInfoVo.linkDesc ||
							'参与抽奖',
						subText: '',
						state: 'pa-active',
						buttonBg: '/images/awardDetail/btn-active.png',
					};
				} else if (advInfoType === 'UNIMKT') {
					leftBtn = {
						show: true,
						tip:
							unimktTaskInfoVo.lotteryPreTitle ||
							serviceFavoriteVo.serviceInfoVo.serviceAdvInfoVo.title ||
							'完成入会/浏览任务即可参与',
						tipUrl: '',
						text:
							serviceFavoriteVo.serviceInfoVo.serviceAdvInfoVo.linkDesc ||
							'参与抽奖',
						subText: '',
						state: 'pa-active',
						buttonBg: '/images/awardDetail/btn-active.png',
					};
				} else if (advInfoType === 'LIGHT_AD') {
					leftBtn = {
						show: true,
						tip:
							serviceFavoriteVo.serviceInfoVo.serviceAdvInfoVo.title ||
							'完成浏览任务即可参与抽奖',
						tipUrl: '',
						text:
							serviceFavoriteVo.serviceInfoVo.serviceAdvInfoVo.linkDesc ||
							'参与抽奖',
						subText: '',
						state: 'pa-active',
						buttonBg: '/images/awardDetail/btn-active.png',
					};
				} else if (advInfoType === 'TOP_AD') {
					leftBtn = {
						show: true,
						tip:
							serviceFavoriteVo.serviceInfoVo.serviceAdvInfoVo.title ||
							'完成浏览任务即可参与抽奖',
						tipUrl: '',
						text:
							serviceFavoriteVo.serviceInfoVo.serviceAdvInfoVo.linkDesc ||
							'参与抽奖',
						subText: '',
						state: 'pa-active',
						buttonBg: '/images/awardDetail/btn-active.png',
					};
				}
			} else if (campScene === 'MERCHANT_TRANSFER') {
				if (customParams) {
					if (customParams.wishCardExist === 'true') {
						leftBtn = {
							show: true,
							tip: '消耗一张商家转账1888心愿卡',
							tipUrl: '',
							text: '参与抽奖',
							state: 'pa-active',
							buttonBg:
								(customerActionBtn &&
									customerActionBtn.stepOneButton &&
									customerActionBtn.stepOneButton.buttonBg) ||
								'/images/awardDetail/btn-active.png',
						};
					} else if (customParams.userRole === 'merchant') {
						leftBtn = {
							show: true,
							tip: '立即转账免费抽1888元花呗红包',
							tipUrl: '',
							text: '立即转账',
							state: 'pa-active',
							buttonBg: '/images/awardDetail/btn-active.png',
						};
					} else {
						leftBtn = {
							show: true,
							tip: '收到商家转账即可抽1888元花呗红包',
							tipUrl: '',
							text: '立即邀请',
							state: 'pa-active',
							buttonBg: '/images/awardDetail/btn-active.png',
						};
					}
				}
			} else {
				// 有服务条 需要逛一逛服务条内容后参与抽奖
				if (
					serviceFavoriteVo &&
					serviceFavoriteVo.serviceInfoVo &&
					serviceFavoriteVo.serviceInfoVo.serviceAdvInfoVo &&
					serviceFavoriteVo.serviceInfoVo.serviceAdvInfoVo.link &&
					abstractCampInfo.campCreateTime > 1612540799000 &&
					!haveGoToServiceLink
				) {
					leftBtn = {
						show: true,
						tip:
							serviceFavoriteVo.serviceInfoVo.serviceAdvInfoVo.title ||
							'逛一逛参与抽奖',
						tipUrl: '',
						text:
							serviceFavoriteVo.serviceInfoVo.serviceAdvInfoVo.linkDesc ||
							'去逛逛',
						subText: '',
						state: 'pa-active',
						buttonBg: '/images/awardDetail/btn-active.png',
					};
				} else {
					const { consumeType, consumePoint, consumeTypeName } =
						consumeConfigInfoVo;
					let consumeName = '';
					if (consumeType) {
						consumeName = consumeTypeName;
					}
					const consumeTip = consumeName
						? `消耗${consumePoint}${consumeName}`
						: '';
					const usingCertificate = campClause && campClause.usingCertificate;
					// 心愿卡不足时，引导用户用户去集心愿卡页面
					const isNoWishCardToGuide =
						needLotteryPreGuide &&
						lotteryPreGuideVo &&
						lotteryPreGuideVo.redirectLink &&
						lotteryPreGuideVo.redirectLink === 'cardTutorial';
					leftBtn = {
						show: true,
						tipBtn: isNoWishCardToGuide ? '获得心愿卡' : '',
						tip: isNoWishCardToGuide
							? '心愿卡用完了!'
							: tip || consumeTip || lotteryPreGuideVo.desc || '',
						tipUrl: '',
						text: isNoWishCardToGuide
							? '参与抽奖'
							: needLotteryPreGuide
								? lotteryPreGuideVo.title || '参与抽奖'
								: fromHome || !usingCertificate
									? '参与抽奖'
									: '许个愿',
						subText:
							lotteryDoingGuideVo && lotteryDoingGuideVo.title
								? `并${lotteryDoingGuideVo.title}`
								: mainSubText ||
									(followLifeName ? `并关注${followLifeName}生活号` : ''),
						state: 'pa-active',
						buttonBg:
							(customerActionBtn &&
								customerActionBtn.stepOneButton &&
								customerActionBtn.stepOneButton.buttonBg) ||
							'/images/awardDetail/btn-active.png',
					};
				}
			}

			rightBtn = null;
		} else {
			leftBtn = {
				show: false,
			};
		}
		//  else if (isImmediateLottery) {
		// 	// 已参与且限时抽奖 不展示
		// 	leftBtn = {
		// 		show: false,
		// 	};
		// } else if (campScene === 'MERCHANT_TRANSFER') {
		// 	// 已参与 且商家转帐场景
		// 	leftBtn = {
		// 		show: true,
		// 		tip: null,
		// 		text: '待开奖',
		// 		subText: '',
		// 		state: 'pa-disabled',
		// 		buttonBg: '/images/awardDetail/btn-disabled.png',
		// 	};
		// 	if (customParams && customParams.userRole === 'merchant') {
		// 		rightBtn = {
		// 			show: true,
		// 			tip:
		// 				(campInviteVo &&
		// 					campInviteVo.inviteNum &&
		// 					`你的中奖概率提升了${campInviteVo.inviteNum}倍，好棒！`) ||
		// 				'暂时没有收款人受邀参与抽奖',
		// 			text: '继续转账',
		// 			state: 'pa-active',
		// 			type: 'action',
		// 			buttonBg: '/images/awardDetail/btn-active.png',
		// 		};
		// 	} else {
		// 		rightBtn = {
		// 			show: true,
		// 			tip: '',
		// 			text: '分享给好友',
		// 			state: 'pa-active',
		// 			type: 'share',
		// 			buttonBg: '/images/awardDetail/btn-active.png',
		// 		};
		// 	}
		// } else {
		// 	// B.2 已参与无小惊喜
		// 	leftBtn = {
		// 		show: true,
		// 		tip: null,
		// 		text: getSubText(campClause, abstractCampInfo.cGmtEnd)
		// 			? '自动开奖'
		// 			: '待开奖',
		// 		subText: getSubText(campClause, abstractCampInfo.cGmtEnd),
		// 		state: 'pa-disabled',
		// 		buttonBg:
		// 			(customerActionBtn &&
		// 				customerActionBtn.stepOneButton &&
		// 				customerActionBtn.stepOneButton.disabledButtonBg) ||
		// 			'/images/awardDetail/btn-disabled.png',
		// 	};
		// 	const wishSubmitted =
		// 		campLotteryTransVo && campLotteryTransVo.lotteryWish;

		// 	const canMakeAWish = isCanMakeWish(abstractCampInfo);
		// 	if (rightBtnAction && rightBtnAction.actUrl) {
		// 		// B.2.1 去捡漏等系统功能
		// 		rightBtn = {
		// 			show: true,
		// 			tip: rightBtnAction.tip || '',
		// 			text: rightBtnAction.btnText,
		// 			subText: '',
		// 			state: 'pa-active',
		// 			type: 'action',
		// 			buttonBg: '/images/awardDetail/btn-active.png',
		// 		};
		// 	} else if (
		// 		abstractCampInfo.refuelTaskSwitch &&
		// 		campRefuelTaskVoList &&
		// 		campRefuelTaskVoList.length > 0
		// 	) {
		// 		// 后置任务列表开
		// 		let tip = '每日可完成任务, 中奖率翻倍';
		// 		if (campRefuelTaskTransVoList.length > 0) {
		// 			let refuelNum = campRefuelTaskTransVoList.reduce((init, item) => {
		// 				return init + item.refuelNum;
		// 			}, 0);
		// 			tip = `中奖率已 +${refuelNum} 倍`;
		// 		}
		// 		rightBtn = {
		// 			show: true,
		// 			tip,
		// 			text: '点我增加中奖率',
		// 			subText: '',
		// 			state: 'pa-active',
		// 			// type: lotteryPostGuideVo.redirectLink === 'share' ? 'share' : 'action',
		// 			buttonBg: '/images/awardDetail/btn-active.png',
		// 		};
		// 	} else if (lotteryPostGuideVo && lotteryPostGuideVo.title) {
		// 		// B.2.3 创建活动时带出的右按钮动作
		// 		rightBtn = {
		// 			show: true,
		// 			tip: lotteryPostGuideVo.desc || '',
		// 			text: lotteryPostGuideVo.title,
		// 			subText: '',
		// 			state: 'pa-active',
		// 			type:
		// 				lotteryPostGuideVo.redirectLink === 'share' ? 'share' : 'action',
		// 			buttonBg: '/images/awardDetail/btn-active.png',
		// 		};
		// 	} else if (canMakeAWish) {
		// 		// B.2.4 可以许愿露出许愿/晒心愿按钮
		// 		rightBtn = {
		// 			show: true,
		// 			tip: '',
		// 			text: wishSubmitted ? '晒心愿' : '去许愿',
		// 			subText: '',
		// 			state: 'pa-active',
		// 			type: 'wish',
		// 			buttonBg: '/images/awardDetail/btn-wish.png',
		// 		};
		// 	} else if (sharable) {
		// 		// B.2.2 不需要心愿卡且可分享
		// 		rightBtn = {
		// 			show: true,
		// 			tip: '邀请好友提高中奖率',
		// 			text: '分享好友',
		// 			subText: '',
		// 			state: 'pa-active',
		// 			type: 'share',
		// 			buttonBg: '/images/awardDetail/btn-active.png',
		// 		};
		// 	}
		// }
	} else if (abstractCampInfo.displayStatus === LOTTERY_STATE.WAIT_OPEN) {
		leftBtn = {
			show: true,
			tip: '',
			text: '开奖中',
			state: 'pa-disabled',
			buttonBg: '/images/awardDetail/btn-disabled.png',
		};
	}

	return {
		leftBtn: leftBtn || {},
		rightBtn: rightBtn || {},
		startInfo,
		sharable,
		participateNum,
		participateNumStatus,
		shareNum,
		myLotteryNum,
		showTmsRedPacket,
		isSubscribe,
	};
}
// 多前置任务失败弹窗按钮
function getMultiLinkBtn(serviceFavoriteVo) {
	const item = serviceFavoriteVo.serviceInfoVo.serviceAdvInfoVo.multiLinks.find(
		(i) => i.status === 0,
	);
	if (item) {
		if (item.taskType === 'SHARE_TASK') {
			return '分享好友 再抽一次';
		} else if (item.taskType === 'JOIN_GROUP') {
			return '加入社群 再抽一次';
		} else {
			return '去逛3秒 再抽一次';
		}
	} else {
		return '去逛3秒 再抽一次';
	}
}

export default {
	isCampValid,
	getWishState,
	getParticipateNum,
	getBtnsConfig,
	getWishCardProductCode,
	getMultiLinkBtn,
};
