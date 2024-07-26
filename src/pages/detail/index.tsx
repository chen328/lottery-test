import { useState, useEffect, LegacyRef, useRef } from 'react';
import { useQuery } from '@/public/hooks';
import dayjs from 'dayjs';
import defaultcompany from '@/public/images/default-company.png';
import {
	execAsync,
	openWebInAlipay,
	// isArray,
	// trim,
	// storageToday,
	storage,
	// delay,
} from '@/public/util';
import {
	DescItemTypeEnum,
	LOTTERY_STATE,
	// LOTTERY_CAMP_SCENE,
} from '@/public/enum';
import { capture } from '@/public/excepture';
import cst, {
	BUILTIN_CHANNELS,
	// NON_EXIST_REGION_ID,
	// TTCJ_LIFE_STYLE_PUBLIC_ID,
	ERRCODETEXT,
} from '@/public/constant';
import {
	trackEntryDetail,
	trackDetailJoinActivity,
	trackDetailJumpOut,
	// trackDetailShare,
	// trackTaskFinish,
	// trackGoWishGoldExposure,
	// trackLotteryExposure,
	// trackLotteryClick,
	// trackWishShareTaskVisit,
	// trackWishShareTaskHelpFinish,
	// trackLotteryPrizeFailedExposure,
	// trackLotteryPrizeFailedClick,
	trackWishGoldThresholdExposure,
	trackWishGoldThresholdClick,
	trackGuideClick,
	trackGuideExposure,
} from '@/public/track/awardDetail';
import {
	itemDetail,
	sendReport,
	messagePointProvide,
	// queryAdv,
	lotteryAction,
	lotteryFreeQuery,
	channelReport,
} from '@/public/service/detail';
import lottie, { AnimationItem } from 'lottie-web';
import Modal from '@/components/Modal';
import classNames from 'classnames';
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

// let prizeListIndex;
// let itemId;

// let benefits;
// let channel;
let partnerRegionInfo;
// let regionInfo;
// let targetRegionInfo;

// let targetRegionId;
let customParams;
// let additionalPrizeUserDigestVos;

let campList: any = [];
// let prizeColumnType;
// let lifeId;

// let channelName;
// let taskShareId;
// let channelSource;
// let outBizId;

// let topDistance = 0;
let isFirstAutoFlag;

// 渠道用的字段
// let isChannelLottery = false;
// let isChannelInited = false;
// let channelGoodsIndex = 0;

// 抽奖详情
function LotteryDetail() {
	const {
		campList: querylist,
		channelSource,
		messageId,
		channelName,
	} = useQuery();
	let { itemId, outBizId } = useQuery();

	const [abstractCampInfo, setabstractCampInfo] = useState<any>(null);
	const [totalPrice, setTotalPrice] = useState<number>(0);
	// const [isAdmin, setisAdmin] = useState(false);
	const [residualCampList, setresidualCampList] = useState([]); //剩余campList
	const [haveGoToServiceLink, sethaveGoToServiceLink] = useState(false); // 是否已逛一逛 或者完成前置任务
	const [isGoToLinkTime, setisGoToLinkTime] = useState<number>(0); // 逛一逛前时间
	const [taskDuration, settaskDuration] = useState(0); // 任务浏览时长
	// const [showParticipateSuccess, setshowParticipateSuccess] = useState(0); // 参与成功弹窗展示  1参与私域 2参与推荐
	// const [adData, setadData] = useState(null); // 参与成功广告弹窗数据
	const [pointAmount, setpointAmount] = useState(-1); // 心愿金总额
	const [lotteryNum, setlotteryNum] = useState(0); // 参与抽奖次数
	// const [wishType, setwishType] = useState(''); // 心愿金弹窗类型
	// const [wishImage, setwishImage] = useState(''); // 心愿金弹窗配置图片
	const [pointTaskStatus, setpointTaskStatus] = useState(0); // 心愿金icon是否领取
	// const [showWishNo, setshowWishNo] = useState(false); // 心愿金不足弹窗
	const [showCoinAnimation, setshowCoinAnimation] = useState(false); // 是否显示心愿金获取动效
	const [, setrecommendPopCampInfo] = useState(null); // 推荐位抽奖
	const [wishGoldRedPacket, setwishGoldRedPacket] = useState(null); // 心愿金红包配置
	// const [lotteryDetailGuideConfig, setlotteryDetailGuideConfig] =
	// 	useState(null); // 心愿金引导配置
	// const [showLotteryDetailGuideConfig, setshowLotteryDetailGuideConfig] =
	// 	useState(false); // 心愿金引导配置展示
	const [receiveWishGold, setreceiveWishGold] = useState(0); // 已领取 // 抽奖门槛
	const [unclaimedWishGold, setunclaimedWishGold] = useState(0); // 待领取
	const [totalWishGold, settotalWishGold] = useState(0); // 心愿金门槛
	const [unimktTaskInfoVo, setunimktTaskInfoVo] = useState<any>(null); // 云码前置任务
	const [isLightPre, setisLightPre] = useState(false); // 云码和灯火前置判断
	const [, setriskUserType] = useState('NORMAL'); //用户人群是否白名单
	const [campClause, setcampClause] = useState<any>();
	const [serviceFavoriteVo, setserviceFavoriteVo] = useState<any>();
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
	const [consumeConfigInfoVo, setconsumeConfigInfoVo] = useState<any>();
	const [prizeInfoVoList, setprizeInfoVoList] = useState();
	const [mynextCampInfoVo, setmynextCampInfoVo] = useState();
	// const [showMessageCoinAnimation, setshowMessageCoinAnimation] =
	// 	useState(false);
	const lottieDomRef = useRef<HTMLDivElement>();
	const lottieRef = useRef<AnimationItem | null>(null);
	const [isShowFirstAutoDialog, setIsShowFirstAutoDialog] =
		useState<boolean>(false);
	const [limitDialog, setlimitDialog] = useState(false); // 限制抽奖弹窗
	const limitLottieDomRef = useRef<HTMLDivElement>();
	const limitLottieRef = useRef<AnimationItem | null>(null);
  const childRef = useRef<any>();

	const goHome = () => {
		location.href = '/';
	};
	const receivePoint = () => {
		messagePointProvide({ messageId }).then((data) => {
			if (data.success) {
				// 先写死,页面刷新会更新心愿金数量
				setpointAmount(pointAmount + 2);
				// setshowMessageCoinAnimation(true);
			}
		});
	};
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
				dealWithDetail(response);
				// 领取消息心愿金
				if (messageId && type === 'init') {
					receivePoint();
				}
				if (type === 'init') {
					// getWishGuide();
					if (!nextCampId) {
						const param = {
							page: 1,
							pageSize: 10,
							displayChannel: 'LOTTERY_LIST',
							displayColumn: 'NORMAL',
							regionId: BUILTIN_CHANNELS.official.id,
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
	const dealWithDetail = (response) => {
		if (!response.success) {
			ap.hideLoading();
			return;
		}

		prizeItem = response.campInfoVo;
		prizeItem.campClause = prizeItem.campClauseVo;
		prizeItem.cGmtStart = dayjs(+prizeItem.gmtStart).format('MM月DD日 hh:mm');
		prizeItem.myLotteryNum = prizeItem.myLotteryNum && +prizeItem.myLotteryNum;
		if (prizeItem.gmtEnd) {
			prizeItem.cGmtEnd = dayjs(
				prizeItem.gmtFinished ? +prizeItem.gmtFinished : +prizeItem.gmtEnd,
			).format('MM月DD日 hh:mm');
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

		// 抽奖定制参数
		// targetRegionId = response.targetRegionId || '';

		partnerRegionInfo = response.partnerRegionVo;
		// regionInfo = response.regionInfoVo || {};
		// targetRegionInfo = response.targetRegionInfoVo || {};

		prizeItem.prizeInfoList = prizeItem.prizeInfoVoList;

		if (prizeItem.displayStatus === LOTTERY_STATE.ENDED) {
			prizeItem.advInfos = prizeItem.advInfoVos;

			// const pizeBenefits =
			// 	(prizeItem.advInfos &&
			// 		prizeItem.advInfos[0] &&
			// 		prizeItem.advInfos[0].advItemInfoVos) ||
			// 	[];
			// let regionBenefits =
			// 	(regionInfo.advInfos &&
			// 		regionInfo.advInfos[0] &&
			// 		regionInfo.advInfos[0].advItemInfos) ||
			// 	[];
			// const targetRegionBenefits =
			// 	(targetRegionInfo.advInfos &&
			// 		targetRegionInfo.advInfos[0] &&
			// 		targetRegionInfo.advInfos[0].advItemInfos) ||
			// 	[];

			// 隐藏抽奖不使用兜底福利
			// if (prizeItem.displayChannel !== 'LOTTERY_LIST') {
			// 	regionBenefits = [];
			// }
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
				dayjs(nextCampInfoVo.gmtEnd).format('MM月DD日 hh:mm') || '';
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
			campId: abstractCampInfo.campId, // 活动id
			// targetRegionId: app.globalData.targetRegionId, // 引流regionId 链接拼接或者官方渠道id
			clientVersion: cst.clientVersion,
			chInfo: cst.PAGE_SOURCE,
		};

		if (type === 'isLightPre') {
			if (unimktTaskInfoVo?.unimktUrl) {
				lotteryObj['outBizNo'] = unimktTaskInfoVo.outBizNo;
			}
		}
		trackDetailJoinActivity({
			campId: abstractCampInfo.campId,
			campName: abstractCampInfo.campName,
			consumeConfigInfoVo: consumeConfigInfoVo,
			regionId: serviceFavoriteVo?.serviceInfoVo?.serviceId,
			regionName: serviceFavoriteVo?.serviceInfoVo?.serviceName,
			wish_gold_num: consumeConfigInfoVo?.consumePoint,
			openMode: campClause?.openMode,
			displayColumn: abstractCampInfo?.displayColumn,
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
			if (errorCode === '2158') {
				setlimitDialog(true);
				const {
					success: suc,
					receiveWishGold,
					unclaimedWishGold,
					totalWishGold,
				} = await lotteryFreeQuery();
				if (suc) {
					setreceiveWishGold(+receiveWishGold);
					setunclaimedWishGold(+unclaimedWishGold);
					settotalWishGold(+totalWishGold);
				}
				setTimeout(() => {
					limitLottieRef.current = lottie.loadAnimation({
						container: limitLottieDomRef.current!, // 容器元素的引用
						renderer: 'canvas',
						loop: true, // 是否循环播放
						autoplay: true, // 是否自动播放
						path: 'https://mdn.alipayobjects.com/huamei_zjbdv1/afts/file/A*RRC0TJdPT0cAAAAAAAAAAAAADg6FAQ', // 动画文件的路径
					});
				}, 50);

				trackWishGoldThresholdExposure({
					campId: abstractCampInfo.campId,
					campName: abstractCampInfo.campName,
					consumeConfigInfoVo: consumeConfigInfoVo,
					regionId: serviceFavoriteVo?.serviceInfoVo?.serviceId,
					regionName: serviceFavoriteVo?.serviceInfoVo?.serviceName,
					receiveWishGold: +receiveWishGold + unclaimedWishGold,
				});
			} else if (errorCode === '2160') {
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
				sethaveGoToServiceLink(true);
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

		prizeItem.participantNum++;
		prizeItem.myLotteryNum = 1;

		// getRecommend();
		handleWishDialogType({ pointAmount, popType, lotteryNum });

		setmyCampLotteryTransVo({
			lotteryTransId,
			gmtCreate: Date.now(),
			...(myCampLotteryTransVo || {}),
		});
		setabstractCampInfo({
			...abstractCampInfo,
			participantNum: prizeItem.participantNum && +prizeItem.participantNum,
			myLotteryNum: 1,
		});
	};
	// 处理心愿金弹窗类型 (也包含其他所有情况的弹窗)
	const handleWishDialogType = (_data) => {
		// const { popType } = _data;
		// const privateData = storageToday('PRIVATE');
		// const RECOMMENDPOP = storageToday('RECOMMENDPOP');
		// const CHANNELGUIDE = storage('CHANNELGUIDE');
		const IS_FIRST_AUTO = storage('IS_FIRST_AUTO');
		// const { recommendPopCampInfo } = this.data;
		const showCoinAnimation = true;

		// 首次浏览返回自动弹窗
		if (!IS_FIRST_AUTO && isFirstAutoFlag) {
			setIsShowFirstAutoDialog(true);
			storage('IS_FIRST_AUTO', true);
			return;
		}
		isFirstAutoFlag = false;
		// 弹窗逻辑暂时不需要
		ap.showToast({
			content: '参与成功, 心愿金+10',
		});

		handleAfterDialogRefresh(_data, { showCoinAnimation });
	};

	const handleAfterDialogRefresh = (_data, { showCoinAnimation }) => {
		const { pointAmount, lotteryNum } = _data;
		setlotteryNum(+lotteryNum);
		setpointAmount(pointAmount);
		setshowCoinAnimation(showCoinAnimation);
		setTimeout(() => {
			lottieRef.current = lottie.loadAnimation({
				container: lottieDomRef.current!, // 容器元素的引用
				renderer: 'canvas',
				loop: false, // 是否循环播放
				autoplay: true, // 是否自动播放
				path: 'https://mdn.alipayobjects.com/huamei_zjbdv1/afts/file/A*45WLQbfr9S4AAAAAAAAAAAAADg6FAQ', // 动画文件的路径
			});
			lottieRef.current.addEventListener('complete', () => {
				// 动画播放完毕后的操作
				console.log('动画播放完毕！');
				handleCoinAnimationClose();
			});
		}, 100);
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
						`/firstSubpackage/pages/receive/receive?itemId=${
							abstractCampInfo.campId
						}&campLotteryTransVo=${encodeURIComponent(
							JSON.stringify(campLotteryTransVo),
						)}&prizeType=${campLotteryTransVo.prizeType}`,
					)}`,
				);
			} else {
				// this.onTapReceiveCoupon();
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
				`alipays://platformapi/startapp?appId=2018103161898599&page=${`/firstSubpackage/pages/logistics/logistics?itemId=${
					abstractCampInfo.campId
				}&campLotteryTransVo=${encodeURIComponent(
					JSON.stringify(campLotteryTransVo),
				)}&regionId=${partnerRegionInfo.regionId}&prizeType=${
					campLotteryTransVo.prizeType
				}`}`,
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

	// const onTapCloseParicipate = () => {
	// 	setshowParticipateSuccess(0);
	// };

	const onTapRightBtn = () => {

	};

	// const onCloseWishNo = () => {
	// 	setshowWishNo(false);
	// };
	const handleCoinAnimationClose = () => {
		setshowCoinAnimation(false);
		// setshowMessageCoinAnimation(false);
		lottieRef.current?.destroy();
	};
	const handleLimitDialog = () => {
		setlimitDialog(false);
		limitLottieRef.current?.destroy();
	};
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
		handleLimitDialog();
	};

	const handlePageShow = () => {
		// const { taskDuration, isGoToLinkTime, isImmediateLottery, isLightPre } =
		// 	this.data;
		// 点击逛一逛回来
		if (isGoToLinkTime) {
			// 有时长读时长 没有超过3秒返回才可以参与 私域活动15s
			const time = taskDuration * 1000 || 3000;
			if (isGoToLinkTime + time < +new Date()) {
				// 如果是不需要点击参与的直接抽
				isFirstAutoFlag = true;
				setisGoToLinkTime(0);
				onLotterySubmit();
			}
			// 灯火或者云码前置任务时长不足,也去完成判断是否完成
			else if (isLightPre) {
				onLotterySubmit('isLightPre');
			} else {
				ap.showToast({ content: '需完成任务才可参与抽奖' });
			}
			setisGoToLinkTime(0);
			settaskDuration(0);
			setisLightPre(false);
		}

		// 刷新页面
		if (prizeItem) {
			const nextCampId = campList && campList.length ? campList[0] : '';

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
	};

	const onTapLeftBtn = async () => {
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
						setisGoToLinkTime(+new Date());
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
						setisGoToLinkTime(+new Date() - 3000);
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
							setisGoToLinkTime(+new Date());
							settaskDuration(stopSecond || 0);
							setisLightPre(true);
							trackGuideClick('YUN_MA');
							ap.pushWindow(unimktUrl);
						} else {
							setisGoToLinkTime(+new Date());
							settaskDuration(stopSecond || 0);
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
		setisGoToLinkTime(0);
		// setshowParticipateSuccess(0);
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
		// benefits = [];
		setresidualCampList(JSON.parse(JSON.stringify(campList)));

		ap.onResume(() => {
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
									// onRateClick='onRateClick'
									// couponInfo='{{coupon}}'
									// condition='{{condition}}'
									// pageReady='{{pageReady}}'
									// campInviteVo='{{campInviteVo}}'
									nextCampInfoVo={mynextCampInfoVo}
									// hideMore='{{hideMore}}'
									campLotteryTransVo={campLotteryTransVo}
									// benefits='{{benefits}}'
									prizeUserDigestVos={myprizeUserDigestVos}
									serviceFavoriteVo={serviceFavoriteVo}
									// additionalPrizeUserDigestVos='{{additionalPrizeUserDigestVos}}'
									// channel='{{channel}}'
									campDescItemInfos={campDescItemInfos}
									// objectId='{{objectId}}'
									// partnerRegionInfo='{{partnerRegionInfo}}'
									abstractCampInfo={abstractCampInfo}
									campClause={campClause}
									prizeInfoVoList={prizeInfoVoList}
									// adData={adData}
									consumeConfigInfoVo={consumeConfigInfoVo}
									// isChannelLottery='{{ isChannelLottery }}'
									// certificateCodeList='{{ certificateCodeList }}'
									// isImmediateLottery='{{ isImmediateLottery }}'
									// advTaskInfoVo='{{serviceFavoriteVo.serviceInfoVo.serviceAdvInfoVo.multiLinks && serviceFavoriteVo.serviceInfoVo.serviceAdvInfoVo.multiLinks[serviceFavoriteVo.serviceInfoVo.serviceAdvInfoVo.multiLinks.length - 1]}}'
									// immediateRedDialog='{{ immediateRedDialog }}'
									wishGoldRedPacket={wishGoldRedPacket}
									pointAmount={pointAmount}
									lotteryShareStatus={lotteryShareStatus}
									materialId={materialId}
									// topAdSpaceCode='{{ topAdSpaceCode }}'
								/>
								{/* 参与抽奖区域 & 参与人数、分享按钮 */}
								<ParticipateArea
									// onSubscribe='onSubscribe'
									onTapLeftBtn={onTapLeftBtn}
									onTapRightBtn={onTapRightBtn}
									onTapNextAwardDetail={onTapNextAwardDetail}
									abstractCampInfo={abstractCampInfo}
									onShowResultPanel={() => {
										childRef?.current?.showResultPanel()
									}}
									// userSetting='{{userSetting}}'
									// campId='{{abstractCampInfo.campId}}'
									config={helper.getBtnsConfig({
										// isAdmin,
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
									// campScene='{{abstractCampInfo.campScene}}'
									// systemColor='{{systemColor}}'
									// needLotteryPreGuide='{{needLotteryPreGuide}}'
									// circleButton='{{circleButton}}'
									// longButton='{{longButton}}'
									// campLotteryTransVo='{{campLotteryTransVo}}'
									// fromHome='{{fromHome}}'
									campName={abstractCampInfo?.campName}
									pointAmount={pointAmount}
									consumeConfigInfoVo={consumeConfigInfoVo}
									// showSliderBottom='{{showSliderBottom}}'
									// subtitle={subtitle}
									// showLotteryDetailGuideConfig='{{showLotteryDetailGuideConfig}}'
									// lotteryDetailGuideConfig='{{lotteryDetailGuideConfig}}'
									// isStudent='{{isStudent}}'
									// serviceAdvInfoVo={serviceFavoriteVo?.serviceInfoVo?.serviceAdvInfoVo}
									// lightTask='{{lightTask}}'
									// topAdRenderError='{{ topAdRenderError }}'
								/>
								{/* <ParticipateDialog /> */}

								{/* 心愿金浮标 */}
								{lotteryNum &&
									!(lotteryNum === 3 && pointTaskStatus) &&
									!(lotteryNum >= 5 && pointTaskStatus) && (
										<WishIcon
											pointTaskStatus={pointTaskStatus}
											lotteryNum={lotteryNum}
										/>
									)}

								{/* <!-- 心愿金弹窗 -->
          <wish-dialog
            a:if="{{wishType}}"
            wishType="{{wishType}}"
            wishImage="{{wishImage}}"
            onCloseWish="onCloseWish"
            onGoSelf="onGoSelf"
          /> */}

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
								// style={{ transform: 'translate(-50%,-50%)' }}
							/>
						</Modal>
					)}

					{/* 心愿金落入 */}
					{
						<div
							ref={lottieDomRef as LegacyRef<HTMLDivElement>}
							className={classNames('coinAnimation-lottie', {
								'coinAnimation-lottie-no': !showCoinAnimation,
							})}
						/>
					}
					{/* <!-- 解锁抽奖弹窗 --> */}
					{limitDialog && (
						<Modal>
							<div
								className='w-[714px] h-[656px]'
								style={{
									backgroundImage:
										'url(https://mdn.alipayobjects.com/huamei_zjbdv1/afts/img/A*oR_wSZxG08wAAAAAAAAAAAAADg6FAQ/original)',
								}}
							>
								{totalWishGold < receiveWishGold + unclaimedWishGold ? (
									<div className='fz-32 tc-3 limitDialog-text fw-medium'>
										收
										<text className='tc-primary' style={{ padding: '0 4px' }}>
											心愿金气泡
										</text>
										即可解锁
									</div>
								) : (
									<div className='fz-32 tc-3 limitDialog-text fw-medium l-flex items-baseline mt-[262px] relative left-6'>
										今日需再集
										<div className='fz-60 tc-primary ff-dm relative top-[-4px]'>
											<PointCount
												count={
													totalWishGold - receiveWishGold - unclaimedWishGold
												}
											/>
										</div>
										<text className='tc-primary'>心愿金</text>
									</div>
								)}
								<div
									className='limitDialog-lottie'
									ref={limitLottieDomRef as LegacyRef<HTMLDivElement>}
								></div>

								{/* <!-- 进度条 --> */}
								<div
									className={classNames('limitDialog-box')}
									style={{
										left:
											totalWishGold > receiveWishGold + unclaimedWishGold
												? '6px'
												: 'auto',
									}}
								>
									<div
										style={{
											width: `${((receiveWishGold + unclaimedWishGold) * 100) / totalWishGold}%`,
										}}
										className='limitDialog-box-progress'
									>
										<img
											lazy-load
											className='limitDialog-box-progress-mask'
											src='https://mdn.alipayobjects.com/huamei_zjbdv1/afts/img/A*QEmZSrkAeKYAAAAAAAAAAAAADg6FAQ/original'
										/>
									</div>
									<div className='limitDialog-box-tip fz-24 white lh-normal'>
										{totalWishGold > receiveWishGold + unclaimedWishGold
											? `集满${totalWishGold}心愿金`
											: '心愿金进度已完成100%'}
									</div>
								</div>

								<div
									className='limitDialog-btn white l-flex-center'
									onClick={goWish}
								>
									去收集
								</div>
							</div>
						</Modal>
					)}
				</div>
			)}
		</div>
	);
}

export default LotteryDetail;
