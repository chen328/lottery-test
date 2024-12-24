import { useState, useEffect, LegacyRef, useRef } from 'react';
import { useQuery } from '@/public/hooks';
import dayjs from 'dayjs';
import defaultcompany from '@/public/images/default-company.png';
import { execAsync, openWebInAlipay } from '@/public/util';
import { DescItemTypeEnum, LOTTERY_STATE } from '@/public/enum';
import { capture } from '@/public/excepture';
import cst, { BUILTIN_CHANNELS, ERRCODETEXT } from '@/public/constant';
import {
	trackEntryDetail,
	trackDetailJoinActivity,
	trackDetailJoinActivitySuccess,
	trackDetailJumpOut,
	trackWishGoldThresholdExposure,
	trackWishGoldThresholdClick,
	trackGuideClick,
	trackGuideExposure,
	trackRecommendClick,
} from '@/public/track/awardDetail';
import {
	itemDetail,
	sendReport,
	messagePointProvide,
	lotteryAction,
	lotteryFreeQuery,
	channelReport,
	receiveAward,
} from '@/public/service/detail';
import lottie, { AnimationItem } from 'lottie-web';
import Modal from '@/components/Modal';
import classNames from 'classnames';
import { useGetState } from 'ahooks';
import { homePrizesList } from '@/public/service/home';
import PointCount from '@/components/PointCount';
import ParticipateArea from './components/ParticipateArea';
import DetailContent from './components/DetailContent';
// import ParticipateDialog from './components/ParticipateDialog';
import WishIcon from './components/WishIcon';
import helper from './utils';

import './index.less';

const ErrorMain = {
	INIT: '该活动还未开始',
	REJECT: '该活动审核未通过',
	INVALID: '该活动已下架',
	AUDITING: '该活动还在审核中',
	EXPIRED: '该活动已过期',
};

const ErrorSub = {
	INIT: '',
	REJECT: '',
	INVALID: '若有疑问，请联系平台客服4008067096',
	AUDITING: '',
};

let prizeItem;
let campLotteryTransVoList;
let campLotteryTransVo;
let prizeUserDigestVos;

let partnerRegionInfo;
let customParams;

let campList: any = [];

// 抽奖详情
function LotteryDetail() {
	const {
		campList: querylist,
		channelSource,
		messageId,
		channelName,
	} = useQuery();
	// eslint-disable-next-line prefer-const
	let { itemId, outBizId, hdType } = useQuery();

	const [abstractCampInfo, setabstractCampInfo, getabstractCampInfo] =
		useGetState<any>(null);
	const [totalPrice, setTotalPrice] = useState<number>(0);
	const [residualCampList, setresidualCampList] = useState([]); //剩余campList
	const [haveGoToServiceLink, sethaveGoToServiceLink] = useState(false); // 是否已逛一逛 或者完成前置任务
	const isGoToLinkTimeRef = useRef<number>(0); // 逛一逛前时间
	const taskDurationRef = useRef<number>(0);
	const [pointAmount, setpointAmount] = useState(-1); // 心愿金总额
	const [lotteryNum, setlotteryNum] = useState(0); // 参与抽奖次数
	const [pointTaskStatus, setpointTaskStatus] = useState(0); // 心愿金icon是否领取
	// const [showCoinAnimation, setshowCoinAnimation] = useState(false); // 是否显示心愿金获取动效
	const [, setrecommendPopCampInfo] = useState(null); // 推荐位抽奖
	const [wishGoldRedPacket, setwishGoldRedPacket] = useState(null); // 心愿金红包配置
	const [receiveWishGold, setreceiveWishGold] = useState(0); // 已领取 // 抽奖门槛
	const [unclaimedWishGold, setunclaimedWishGold] = useState(0); // 待领取
	// const [totalWishGold, settotalWishGold] = useState(0); // 心愿金门槛
	const [unimktTaskInfoVo, setunimktTaskInfoVo, getunimktTaskInfoVo] =
		useGetState<any>(null); // 云码前置任务
	const isLightPreRef = useRef<boolean>(false); // 云码和灯火前置判断
	const [, setriskUserType] = useState('NORMAL'); //用户人群是否白名单
	const [campClause, setcampClause, getcampClause] = useGetState<any>();
	const [serviceFavoriteVo, setserviceFavoriteVo, getserviceFavoriteVo] =
		useGetState<any>();
	const [lotteryShareStatus, setlotteryShareStatus] = useState();
	const [materialId, setmaterialId] = useState();
	const [campDescItemInfos, setcampDescItemInfos] = useState();
	const [myCampLotteryTransVo, setmyCampLotteryTransVo] = useState<any>();
	const [myprizeUserDigestVos, setmyprizeUserDigestVos] = useState();
	const [userSetting, setuserSetting] = useState();
	const [needLotteryPreGuide, setneedLotteryPreGuide] = useState();
	const [lotteryPreGuideVo, setlotteryPreGuideVo] = useState();
	const [lotteryDoingGuideVo, setlotteryDoingGuideVo] = useState();
	const [lotteryPostGuideVo, setlotteryPostGuideVo] = useState();
	const [consumeConfigInfoVo, setconsumeConfigInfoVo, getconsumeConfigInfoVo] =
		useGetState<any>();
	const [prizeInfoVoList, setprizeInfoVoList] = useState();
	const [mynextCampInfoVo, setmynextCampInfoVo] = useGetState<any>();
	const lottieDomRef = useRef<HTMLDivElement>();
	const lottieRef = useRef<AnimationItem | null>(null);
	const [isShowFirstAutoDialog, setIsShowFirstAutoDialog] =
		useState<boolean>(false);
	// const [limitDialog, setlimitDialog] = useState(false); // 限制抽奖弹窗
	// const limitLottieDomRef = useRef<HTMLDivElement>();
	// const limitLottieRef = useRef<AnimationItem | null>(null);
	const childRef = useRef<any>();
	const refreshRef = useRef<boolean>(false);

	const goHome = () => {
		location.href = '/';
	};
	// const receivePoint = () => {
	// 	messagePointProvide({ messageId }).then((data) => {
	// 		if (data.success) {
	// 			// 先写死,页面刷新会更新心愿金数量
	// 			setpointAmount(pointAmount + 2);
	// 		}
	// 	});
	// };
	const handleItemId = ({ type = 'init', cb = () => {} }) => {
		const nextCampId = campList && campList.length ? campList[0] : '';

		itemDetail({
			campId: itemId,
			chInfo: cst.PAGE_SOURCE,
			nextCampId,
			channelSource,
			outBizId,
			channelName,
		}).then((response) => {
			if (response.success) {
				dealWithDetail(response, type);
				// 领取消息心愿金
				// if (messageId && type === 'init') {
				// 	receivePoint();
				// }
				if (type === 'init') {
					if (!nextCampId) {
						const param = {
							page: 1,
							pageSize: 10,
							displayChannel: 'LOTTERY_LIST',
							displayColumn: 'NORMAL',
							regionId: BUILTIN_CHANNELS.official.id,
							displaySubChannel: 'H5',
						};
						homePrizesList(param).then((res) => {
							if (
								res.success &&
								res.campInfoVoList &&
								res.campInfoVoList.length > 0
							) {
								res.campInfoVoList.forEach((item) => {
									if (item.campId && Array.isArray(campList)) {
										campList.push(item.campId);
									}
								});
								setresidualCampList(campList);
								handleItemId({ type: 'reload' });
							}
						});
					}
					trackEntryDetail(prizeItem);
				}

				execAsync(cb);
			} else {
				capture({
					type: 'other',
					msg: '抽奖详情接口返回异常',
				});
			}
		});
	};
	const dealWithDetail = (response, type = 'reload') => {
		if (!response.success) {
			ap.hideLoading();
			return;
		}

		prizeItem = response.campInfoVo;
		prizeItem.campClause = prizeItem.campClauseVo;
		prizeItem.cGmtStart = dayjs(+prizeItem.gmtStart).format('MM月DD日 HH:mm');
		prizeItem.myLotteryNum = prizeItem.myLotteryNum && +prizeItem.myLotteryNum;
		if (prizeItem.gmtEnd) {
			prizeItem.cGmtEnd = dayjs(
				prizeItem.gmtFinished ? +prizeItem.gmtFinished : +prizeItem.gmtEnd,
			).format('MM月DD日 HH:mm');
		}
		// 优先渲染图片
		setabstractCampInfo({
			campId: prizeItem.campId,
			displayStatus: prizeItem.displayStatus,
			campName: prizeItem.campName,
			myLotteryNum: prizeItem.myLotteryNum && +prizeItem.myLotteryNum,
			longButtonText: prizeItem.longButtonText,
			campScene: prizeItem.campScene,
			participantNum: prizeItem.participantNum && +prizeItem.participantNum,
			shareNum: +prizeItem.shareNum,
			notifyAtStart: prizeItem.notifyAtStart,
			cGmtStart: prizeItem.cGmtStart,
			cGmtEnd: prizeItem.cGmtEnd,
			gmtEnd: prizeItem.gmtEnd,
			displayWeight: prizeItem.displayWeight,
			displayColumn: prizeItem.displayColumn,
			gmtModified: prizeItem.gmtModified,
			campLogo: prizeItem.campLogo,
			campCreateTime: prizeItem.gmtCreate,
			refuelTaskSwitch: +prizeItem.refuelTaskSwitch,
			campType: prizeItem.campType,
			channelBannerUrl: prizeItem.channelBannerUrl,
			openMode: prizeItem.campClause.openMode,
			campLogoType: prizeItem.campLogoType ? +prizeItem.campLogoType : 0,
			awardDeadLine: prizeItem.awardDeadLine,
			priceDesc: prizeItem.priceDesc,
			advInfoType:
				prizeItem?.serviceFavoriteVo?.serviceInfoVo?.serviceAdvInfoVo
					?.advInfoType,
		});
		setcampClause(prizeItem.campClause);
		setserviceFavoriteVo(prizeItem.serviceFavoriteVo);
		setpointAmount(+response.pointAmount);
		setlotteryNum(+response.lotteryNum);
		setpointTaskStatus(response.pointTaskStatus);
		setrecommendPopCampInfo(response.recommendPopCampInfo);
		setwishGoldRedPacket(response.wishGoldRedPacket);
		setlotteryShareStatus(response.lotteryShareStatus);
		setmaterialId(response.materialId);
		setunimktTaskInfoVo(response.unimktTaskInfoVo);
		setriskUserType(response.riskUserType);

		//  渲染图文简介
		prizeItem.campDescItemInfos = prizeItem.campDescItemVos;
		if (prizeItem.campDescItemInfos) {
			prizeItem.campDescItemInfos.map(async (campDescItemInfo) => {
				if (campDescItemInfo.descItemType === DescItemTypeEnum.link) {
					try {
						campDescItemInfo.descItem = JSON.parse(campDescItemInfo.descItem);
					} catch (e) {
						console.log('JsonParse Error', e);
					}
				}
			});
		}

		setcampDescItemInfos(prizeItem.campDescItemInfos);

		partnerRegionInfo = response.partnerRegionVo;

		prizeItem.prizeInfoList = prizeItem.prizeInfoVoList;

		if (prizeItem.displayStatus === LOTTERY_STATE.ENDED) {
			prizeItem.advInfos = prizeItem.advInfoVos;
		}

		campLotteryTransVoList = response.campLotteryTransVoList;
		campLotteryTransVo = null;

		if (campLotteryTransVoList && campLotteryTransVoList.length) {
			for (let i = 0; i < campLotteryTransVoList.length; i++) {
				if (
					campLotteryTransVoList[i].status === 'SUCCESS' ||
					campLotteryTransVoList[i].status === 'AWARDED'
				) {
					campLotteryTransVo = campLotteryTransVoList[i];
					break;
				}
				campLotteryTransVo = campLotteryTransVoList[i];
			}
		}

		prizeUserDigestVos = response.prizeUserDigestVos;
		// 关联活动中奖者信息
		// additionalPrizeUserDigestVos = response.additionalPrizeUserDigestVos || [];

		const tempPrizeUserDigestVos: any = [];
		if (prizeItem.prizeInfoList && prizeUserDigestVos) {
			prizeItem.prizeInfoList.map((item) => {
				prizeUserDigestVos.map((prizeUserDigest) => {
					if (item.prizeId === prizeUserDigest.prizeId) {
						// 只展示前9个 其余数据后端返回也不用同步到数据状态
						if (
							prizeUserDigest &&
							prizeUserDigest.userInfoDigestVos.length > 9
						) {
							prizeUserDigest.userInfoDigestVos.splice(
								9,
								prizeUserDigest.userInfoDigestVos.length - 9,
							);
						}
						tempPrizeUserDigestVos.push(prizeUserDigest);
					}
				});
			});
		}
		prizeUserDigestVos = tempPrizeUserDigestVos;

		// 详情页下一个奖品详情
		const { nextCampInfoVo = {} } = response || {};
		const { prizeInfoVoList } = nextCampInfoVo;
		if (nextCampInfoVo && prizeInfoVoList) {
			nextCampInfoVo.timeFmt =
				dayjs(nextCampInfoVo.gmtEnd).format('MM月DD日 HH:mm') || '';
			nextCampInfoVo.processLogo = nextCampInfoVo.campLogo;
			nextCampInfoVo.totalPrice = prizeInfoVoList.reduce(
				(total, currentValue) => {
					return total + +currentValue.price;
				},
				0,
			);
			const titleLen = prizeInfoVoList.length - 1;
			nextCampInfoVo.lottoryTitles = prizeInfoVoList
				.map((value, index) => {
					if (index === titleLen) {
						return `${value.subject} x${value.totalQuantity}`;
					} else {
						return `${value.subject} x${value.totalQuantity}；`;
					}
				})
				.join('');
		}
		let totalPrice = 0;
		if (prizeItem.prizeInfoVoList && prizeItem.prizeInfoVoList.length > 0) {
			totalPrice = prizeItem.prizeInfoVoList.reduce((total, currentValue) => {
				return total + +currentValue.price;
			}, 0);
		}

		setmyCampLotteryTransVo(campLotteryTransVo);
		setmyprizeUserDigestVos(prizeUserDigestVos);
		setuserSetting(response.userSetting);
		setneedLotteryPreGuide(response.needLotteryPreGuide);
		setlotteryPreGuideVo(
			prizeItem?.lotteryGuideInfoVo?.lotteryPreGuideVo || {},
		);
		setlotteryDoingGuideVo(
			prizeItem?.lotteryGuideInfoVo?.lotteryDoingGuideVo || {},
		);
		setlotteryPostGuideVo(
			prizeItem?.lotteryGuideInfoVo?.lotteryPostGuideVo || {},
		);
		setconsumeConfigInfoVo(prizeItem.consumeConfigInfoVo || {});
		setprizeInfoVoList(prizeItem.prizeInfoList);
		setmynextCampInfoVo(nextCampInfoVo);
		setTotalPrice(totalPrice);

		ap.hideLoading();

		// 已经开奖进入详情页 上报查看
		if (prizeItem.displayStatus === LOTTERY_STATE.ENDED) {
			sendReport({ campId: prizeItem.campId });
		}
		// 如果是三个前置条件任务完成 或限时开奖前置问卷缓存
		if (
			prizeItem.serviceFavoriteVo &&
			prizeItem.serviceFavoriteVo.serviceInfoVo &&
			prizeItem.serviceFavoriteVo.serviceInfoVo.serviceAdvInfoVo &&
			prizeItem.serviceFavoriteVo.serviceInfoVo.serviceAdvInfoVo.advInfoType &&
			!haveGoToServiceLink
		) {
			const { advInfoType, quantity } =
				prizeItem.serviceFavoriteVo.serviceInfoVo.serviceAdvInfoVo;

			if (
				advInfoType === 'UNIMKT' &&
				response.unimktTaskInfoVo &&
				response.unimktTaskInfoVo.unimktUrl
			) {
				trackGuideExposure('YUN_MA');
			}

			if (advInfoType === 'FINISH_TASK' && +quantity === 3) {
				sethaveGoToServiceLink(true);
			}
			// 携带参数 自动去做前置任务
			if (
				type === 'init' &&
				!(prizeItem.myLotteryNum && +prizeItem.myLotteryNum) &&
				hdType === 'browse'
			) {
				execAsync(() => {
					onTapLeftBtn();
				}, 100);
			}
		}
	};
	// 获取右下角心愿金配置
	// const getWishGuide = () => {
	// 	queryAdv({ adType: ['lotteryDetailGuideConfig'] }).then((data) => {
	// 		if (
	// 			data.success &&
	// 			data.adConfig &&
	// 			data.adConfig.lotteryDetailGuideConfig
	// 		) {
	// 			setlotteryDetailGuideConfig(data.adConfig.lotteryDetailGuideConfig);
	// 		}
	// 	});
	// };
	const onLotterySubmit = async (type = '') => {
		const lotteryObj = {
			campId: getabstractCampInfo().campId, // 活动id
			clientVersion: cst.clientVersion,
			chInfo: cst.PAGE_SOURCE,
		};

		if (type === 'isLightPre') {
			if (getunimktTaskInfoVo()?.unimktUrl) {
				lotteryObj['outBizNo'] = getunimktTaskInfoVo().outBizNo;
			}
		}
		trackDetailJoinActivity({
			campId: getabstractCampInfo().campId,
			campName: getabstractCampInfo().campName,
			consumeConfigInfoVo: getconsumeConfigInfoVo(),
			regionId: getserviceFavoriteVo()?.serviceInfoVo?.serviceId,
			regionName: getserviceFavoriteVo()?.serviceInfoVo?.serviceName,
			wish_gold_num: getconsumeConfigInfoVo()?.consumePoint,
			openMode: getcampClause()?.openMode,
			displayColumn: getabstractCampInfo().displayColumn,
		});
		ap.showLoading();

		const response = await lotteryAction(lotteryObj);

		ap.hideLoading();

		const {
			success,
			errorCode,
			errorMsg,
			lotteryTransId,
			pointAmount = 0,
			popType = '',
			lotteryNum = '',
		} = response || {};
		if (!success) {
			if (errorCode === '2160') {
				// 社群任务未入群
				ap.showToast({
					content: '任务未完成',
				});
				sethaveGoToServiceLink(true);
			} else if (errorCode === '2175') {
				// 云码没完成
				ap.showToast({
					content: '任务未完成',
				});
				// sethaveGoToServiceLink(true);
			} else {
				ap.showToast({
					content: ERRCODETEXT[errorCode] || errorMsg,
				});
				capture({
					type: 'other',
					msg: `抽奖失败: ${errorMsg}`,
				});
			}

			return;
		}

		trackDetailJoinActivitySuccess({
			campId: getabstractCampInfo().campId,
			campName: getabstractCampInfo().campName,
			consumeConfigInfoVo: getconsumeConfigInfoVo(),
			regionId: getserviceFavoriteVo()?.serviceInfoVo?.serviceId,
			regionName: getserviceFavoriteVo()?.serviceInfoVo?.serviceName,
			wish_gold_num: getconsumeConfigInfoVo()?.consumePoint,
			openMode: getcampClause()?.openMode,
			displayColumn: getabstractCampInfo().displayColumn,
		});

		prizeItem.participantNum++;
		prizeItem.myLotteryNum = 1;

		handleWishDialogType({ pointAmount, popType, lotteryNum });

		setmyCampLotteryTransVo({
			lotteryTransId,
			gmtCreate: Date.now(),
			...(myCampLotteryTransVo || {}),
		});
		setabstractCampInfo({
			...getabstractCampInfo(),
			participantNum: prizeItem.participantNum && +prizeItem.participantNum,
			myLotteryNum: 1,
		});
	};
	// 处理心愿金弹窗类型 (也包含其他所有情况的弹窗)
	const handleWishDialogType = (_data) => {
		const { lotteryNum } = _data;
		ap.showToast({
			content: '参与抽奖成功',
		});
		setlotteryNum(+lotteryNum);
	};

	const onTapReceiveCoupon = async () => {
		ap.showLoading();
		// const { campLotteryTransVo } = this.data;
		const { success } = await receiveAward({
			lotteryTransId: campLotteryTransVo.lotteryTransId,
		});
		ap.hideLoading();
		if (success) {
			ap.showToast({ content: '领取成功' });
			setmyCampLotteryTransVo({
				...campLotteryTransVo,
				status: 'AWARDED',
			});
			handleItemId({ type: 'reload' });
		}
	};

	/*
    中奖弹窗点击处理
    过期：心愿金去心愿金页，其他去首页
    未领取：实物、现金去填写,心愿金领取去心愿金页,卡券领取去卡包 
   */
	const onEndAddressTap = () => {
		// const { lotteryShareStatus, materialId } = this.data;
		if (
			abstractCampInfo?.awardDeadLine < Date.now() &&
			campLotteryTransVo.status === 'SUCCESS'
		) {
			// 过期
			if (campLotteryTransVo.prizeType === 'WISH_GOLD') {
				ap.pushWindow(
					'alipays://platformapi/startapp?appId=2018103161898599&page=pages%2FpointsIndex%2FpointsIndex',
				);
			} else {
				location.href = '/';
			}
		} else if (campLotteryTransVo.status === 'SUCCESS') {
			if (
				campLotteryTransVo.prizeType === 'MATTER' ||
				campLotteryTransVo.prizeType === 'CASH'
			) {
				ap.pushWindow(
					`alipays://platformapi/startapp?appId=2018103161898599&page=${encodeURIComponent(
						`firstSubpackage/pages/receive/receive?itemId=${
							abstractCampInfo.campId
						}&campLotteryTransVo=${encodeURIComponent(
							JSON.stringify(campLotteryTransVo),
						)}&prizeType=${campLotteryTransVo.prizeType}`,
					)}`,
				);
				refreshRef.current = true;
			} else {
				onTapReceiveCoupon();
			}
		}
		// else if (
		// 	campLotteryTransVo.status === 'AWARDED' &&
		// 	campLotteryTransVo.prizeType === 'MATTER' &&
		// 	lotteryShareStatus &&
		// 	!isGoAddress
		// ) {
		// 	// 实物领奖后分享晒奖
		// 	if (lotteryShareStatus === 'SHARE') {
		// 		// 分享
		// 		this.shareToGroupDialog.show();
		// 	} else if (lotteryShareStatus === 'WAIT_MATERIAL') {
		// 		// 晒奖
		// 		my.navigateTo({
		// 			url: `/firstSubpackage/pages/sharePrize/index?materialId=${materialId}`,
		// 		});
		// 	} else if (lotteryShareStatus === 'MATERIAL') {
		// 		my.navigateTo({
		// 			url: `/firstSubpackage/pages/showAwardDetails/index?materialId=${materialId}`,
		// 		});
		// 	}
		// }
		else if (
			campLotteryTransVo.prizeType === 'MATTER' ||
			campLotteryTransVo.prizeType === 'CASH'
		) {
			ap.pushWindow(
				`alipays://platformapi/startapp?appId=2018103161898599&page=${encodeURIComponent(
					`firstSubpackage/pages/logistics/logistics?itemId=${
						abstractCampInfo.campId
					}&campLotteryTransVo=${encodeURIComponent(
						JSON.stringify(campLotteryTransVo),
					)}&regionId=${partnerRegionInfo.regionId}&prizeType=${
						campLotteryTransVo.prizeType
					}`,
				)}`,
			);
		} else if (campLotteryTransVo.prizeType === 'VOUCHER') {
			location.href = '/';
		} else if (campLotteryTransVo.prizeType === 'WISH_GOLD') {
			ap.pushWindow(
				'alipays://platformapi/startapp?appId=2018103161898599&page=pages%2FpointsIndex%2FpointsIndex',
			);
		} else {
			location.href = '/';
		}
	};

	const onTapRightBtn = () => {};

	// const handleCoinAnimationClose = () => {
	// 	setshowCoinAnimation(false);
	// 	lottieRef.current?.destroy();
	// };
	// const handleLimitDialog = () => {
	// 	setlimitDialog(false);
	// 	limitLottieRef.current?.destroy();
	// };
	const goWish = () => {
		trackWishGoldThresholdClick({
			campId: abstractCampInfo.campId,
			campName: abstractCampInfo.campName,
			consumeConfigInfoVo: consumeConfigInfoVo,
			regionId: serviceFavoriteVo?.serviceInfoVo?.serviceId,
			regionName: serviceFavoriteVo?.serviceInfoVo?.serviceName,
			receiveWishGold: receiveWishGold + unclaimedWishGold,
		});
		openWebInAlipay(
			'alipays://platformapi/startapp?appId=2018103161898599&page=pages%2FpointsIndex%2FpointsIndex%3FallLottery%3Dtrue',
		);
		// handleLimitDialog();
	};

	const handlePageShow = () => {
		// 点击逛一逛回来
		if (isGoToLinkTimeRef.current) {
			// 有时长读时长 没有超过3秒返回才可以参与 私域活动15s
			const time = taskDurationRef.current * 1000 || 3000;
			if (isGoToLinkTimeRef.current + time < +new Date()) {
				// 如果是不需要点击参与的直接抽
				// isFirstAutoFlag = true;
				isGoToLinkTimeRef.current = 0;
				onLotterySubmit();
			}
			// 灯火或者云码前置任务时长不足,也去完成判断是否完成
			else if (isLightPreRef.current) {
				onLotterySubmit('isLightPre');
			} else {
				ap.showToast({ content: '需完成任务才可参与抽奖' });
			}
			isGoToLinkTimeRef.current = 0;
			taskDurationRef.current = 0;
			isLightPreRef.current = false;
		}

		// 刷新页面
		if (prizeItem) {
			const nextCampId = campList && campList.length ? campList[0] : '';
			if (refreshRef.current) {
				handleItemId({ type: 'reload' });
				refreshRef.current = false;
			} else {
				itemDetail({
					campId: itemId,
					chInfo: cst.PAGE_SOURCE,
					nextCampId,
					channelSource,
					outBizId,
					channelName,
				}).then((response) => {
					setneedLotteryPreGuide(response.needLotteryPreGuide);
					setlotteryPreGuideVo(
						response?.lotteryGuideInfoVo?.lotteryPreGuideVo || {},
					);
					setpointAmount(+response.pointAmount);
					setpointTaskStatus(response.pointTaskStatus);
				});
			}
		}
	};

	const onTapLeftBtn = async () => {
		const abstractCampInfo = getabstractCampInfo();
		const serviceFavoriteVo = getserviceFavoriteVo();
		const campClause = getcampClause();

		// 活动进行中的 参与抽奖
		if (abstractCampInfo?.displayStatus === LOTTERY_STATE.GOING) {
			if (
				serviceFavoriteVo?.serviceInfoVo?.serviceAdvInfoVo?.advInfoType &&
				!haveGoToServiceLink
			) {
				// 前置抽奖按钮处理
				const { advInfoType, link, channelId, stopSecond } =
					serviceFavoriteVo.serviceInfoVo.serviceAdvInfoVo;

				switch (advInfoType) {
					case 'JUMP_STOP_TASK':
						// 3s任务
						isGoToLinkTimeRef.current = +new Date();
						taskDurationRef.current = stopSecond || 0;
						// 逛一逛 点击埋点
						trackDetailJumpOut({
							campId: abstractCampInfo.campId,
							campName: abstractCampInfo.campName,
							consumeConfigInfoVo: consumeConfigInfoVo,
							regionId: serviceFavoriteVo?.serviceInfoVo?.serviceId,
							regionName: serviceFavoriteVo?.serviceInfoVo?.serviceName,
							link_url:
								serviceFavoriteVo?.serviceInfoVo?.serviceAdvInfoVo?.link,
							component: '去逛逛',
							openMode: campClause.openMode,
						});
						if (channelId) {
							channelReport({
								channelId,
							});
						}
						ap.pushWindow(
							serviceFavoriteVo.serviceInfoVo.serviceAdvInfoVo.link,
						);
						break;
					case 'JUMP_TASK':
						// 跳转任务
						isGoToLinkTimeRef.current = +new Date() - 3000;
						sethaveGoToServiceLink(true);
						trackDetailJumpOut({
							campId: abstractCampInfo.campId,
							campName: abstractCampInfo.campName,
							consumeConfigInfoVo: consumeConfigInfoVo,
							regionId: serviceFavoriteVo?.serviceInfoVo?.serviceId,
							regionName: serviceFavoriteVo?.serviceInfoVo?.serviceName,
							link_url:
								serviceFavoriteVo?.serviceInfoVo?.serviceAdvInfoVo?.link,
							component: '去逛逛',
							openMode: campClause.openMode,
						});
						ap.pushWindow(
							serviceFavoriteVo.serviceInfoVo.serviceAdvInfoVo.link,
						);
						break;
					case 'JOIN_GROUP':
						// 已入过群不需要浏览时长
						isGoToLinkTimeRef.current = +new Date() - 3000;
						ap.pushWindow(link);

						trackDetailJumpOut({
							campId: abstractCampInfo.campId,
							campName: abstractCampInfo.campName,
							consumeConfigInfoVo: consumeConfigInfoVo,
							regionId: serviceFavoriteVo?.serviceInfoVo?.serviceId,
							regionName: serviceFavoriteVo?.serviceInfoVo?.serviceName,
							link_url:
								serviceFavoriteVo?.serviceInfoVo?.serviceAdvInfoVo?.link,
							component: '去逛逛',
							openMode: campClause.openMode,
						});
						break;

					case 'UNIMKT':
						// eslint-disable-next-line no-case-declarations
						const { unimktUrl = '' } = unimktTaskInfoVo;
						if (unimktUrl) {
							isGoToLinkTimeRef.current = +new Date();
							taskDurationRef.current = stopSecond || 0;
							isLightPreRef.current = true;
							trackGuideClick('YUN_MA');
							ap.pushWindow(unimktUrl);
						} else {
							isGoToLinkTimeRef.current = +new Date();
							taskDurationRef.current = stopSecond || 0;
							ap.pushWindow(link);
						}
						break;
					default:
						onLotterySubmit();
						break;
				}
			} else if (
				serviceFavoriteVo?.serviceInfoVo?.serviceAdvInfoVo?.link &&
				abstractCampInfo?.campCreateTime > 1612540799000 &&
				!haveGoToServiceLink
			) {
				// 满足去逛逛的条件 逛一逛后抽奖  特定id
				sethaveGoToServiceLink(true);
				// 逛一逛 点击埋点
				trackDetailJumpOut({
					campId: abstractCampInfo.campId,
					campName: abstractCampInfo.campName,
					consumeConfigInfoVo: consumeConfigInfoVo,
					regionId: serviceFavoriteVo?.serviceInfoVo?.serviceId,
					regionName: serviceFavoriteVo?.serviceInfoVo?.serviceName,
					link_url: serviceFavoriteVo?.serviceInfoVo?.serviceAdvInfoVo?.link,
					component: '去逛逛',
					openMode: campClause.openMode,
				});
				ap.pushWindow(serviceFavoriteVo.serviceInfoVo.serviceAdvInfoVo.link);
			} else {
				onLotterySubmit();
			}
		}
	};

	// 推荐抽奖
	const onTapNextAwardDetail = () => {
		outBizId = ''; // 如果是限时开奖下一个商品清除bizid
		const newResidualCampList = [...residualCampList];
		const id = newResidualCampList.shift();
		if (!id) {
			location.href = '/';
			return;
		}
		itemId = id;
		ap.showLoading();
		setresidualCampList(newResidualCampList);
		setabstractCampInfo(null);
		setmyCampLotteryTransVo(null);
		sethaveGoToServiceLink(false);
		isGoToLinkTimeRef.current = 0;
		itemDetail({
			campId: id,
			chInfo: cst.PAGE_SOURCE,
			nextCampId: newResidualCampList[0],
			channelSource,
			outBizId,
			channelName,
		}).then((response) => {
			dealWithDetail(response);
		});
		ap.hideLoading();
	};
	useEffect(() => {
		if (!itemId && !channelName) {
			capture({
				type: 'other',
				msg: '详情入口参数不存在',
			});
			return;
		}
		campList = querylist ? querylist.split(',') : [];

		handleItemId({
			type: 'init',
		});
		prizeItem = null;
		campLotteryTransVoList = null;
		campLotteryTransVo = null;
		setresidualCampList(JSON.parse(JSON.stringify(campList)));

		ap.onResume(() => {
			console.log('onResume');
			handlePageShow();
		});

		return () => {
			ap.offResume();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<div className='container'>
			{/* 骨架图 */}
			{!abstractCampInfo ? (
				<div className='detail-loading-image'></div>
			) : (
				<div>
					{/* <!-- 错误显示 --> */}
					{!helper.isCampValid(abstractCampInfo.displayStatus) && (
						<div className='error-box'>
							<img className='error-icon' src={defaultcompany} />
							<div className='error-main'>
								{ErrorMain[abstractCampInfo.displayStatus]}
							</div>
							{ErrorSub[abstractCampInfo.displayStatus] && (
								<div className='error-sub'>
									{ErrorSub[abstractCampInfo.displayStatus]}
								</div>
							)}

							<div className='tc-primary tac mt-52' onClick={goHome}>
								{/* 参与更多抽奖 >> */}
							</div>
						</div>
					)}
					<div style={{ height: '100vh' }}>
						<div className='l-flex-v l-flex-0' id='view-top-anchor'>
							{/* <!-- 正文 --> */}
							<div className='award-main'>
								<DetailContent
									ref={childRef}
									totalPrice={totalPrice}
									onTapNextAwardDetail={onTapNextAwardDetail}
									onEndAddressTap={onEndAddressTap}
									nextCampInfoVo={mynextCampInfoVo}
									campLotteryTransVo={campLotteryTransVo}
									prizeUserDigestVos={myprizeUserDigestVos}
									serviceFavoriteVo={serviceFavoriteVo}
									campDescItemInfos={campDescItemInfos}
									abstractCampInfo={abstractCampInfo}
									campClause={campClause}
									prizeInfoVoList={prizeInfoVoList}
									consumeConfigInfoVo={consumeConfigInfoVo}
									wishGoldRedPacket={wishGoldRedPacket}
									pointAmount={pointAmount}
									lotteryShareStatus={lotteryShareStatus}
									materialId={materialId}
								/>
								{/* 参与抽奖区域 & 参与人数、分享按钮 */}
								<ParticipateArea
									// onSubscribe='onSubscribe'
									onTapLeftBtn={onTapLeftBtn}
									onTapRightBtn={onTapRightBtn}
									onTapNextAwardDetail={onTapNextAwardDetail}
									abstractCampInfo={abstractCampInfo}
									onShowResultPanel={() => {
										childRef?.current?.showResultPanel();
									}}
									config={helper.getBtnsConfig({
										campLotteryTransVo,
										customParams,
										userSetting,
										haveGoToServiceLink,
										needLotteryPreGuide,
										lotteryPreGuideVo,
										lotteryPostGuideVo,
										consumeConfigInfoVo,
										lotteryDoingGuideVo,
										abstractCampInfo,
										campClause,
										serviceFavoriteVo,
										// isChannelLottery,
										unimktTaskInfoVo,
									})}
									campName={abstractCampInfo?.campName}
									pointAmount={pointAmount}
									consumeConfigInfoVo={consumeConfigInfoVo}
									nextCampInfoVo={mynextCampInfoVo}
								/>
								{/* <ParticipateDialog /> */}

								{/* 心愿金浮标 */}
								{/* {lotteryNum &&
									!(lotteryNum === 3 && pointTaskStatus) &&
									!(lotteryNum >= 5 && pointTaskStatus) && (
										<WishIcon
											pointTaskStatus={pointTaskStatus}
											lotteryNum={lotteryNum}
										/>
									)} */}

								{/* <!-- 心愿金不足 --> */}
								{/* <wish-noenough a:if="{{showWishNo}}" onCloseWishNo="onCloseWishNo" /> */}
							</div>
						</div>
						<div className='g-iphonex-bottom' id='view-top-anchor-bottom'></div>
					</div>
					{/* 首次自动抽奖 */}
					{isShowFirstAutoDialog && (
						<Modal>
							<img
								className='w-582 h-[480px] top-[50%] left-[50%]'
								src='https://mdn.alipayobjects.com/huamei_zjbdv1/afts/img/A*QwllT7XM7B0AAAAAAAAAAAAADg6FAQ/original'
								onClick={() => {
									setIsShowFirstAutoDialog(false);
								}}
							/>
						</Modal>
					)}

					{/* 心愿金落入 */}
					{/* {
						<div
							ref={lottieDomRef as LegacyRef<HTMLDivElement>}
							className={classNames('coinAnimation-lottie', {
								'coinAnimation-lottie-no': !showCoinAnimation,
							})}
						/>
					} */}
				</div>
			)}
		</div>
	);
}

export default LotteryDetail;
