import { useEffect, useRef, LegacyRef } from 'react';
import lottie from 'lottie-web';
import { LOTTERY_STATE } from '@/public/enum';
import classNames from 'classnames';
import {
	// trackRecommendExposure,
	// trackRecommendClick,
	// trackLotteryPrizeFailedExposure,
	// trackGoWishGoldExposure,
	trackGoWishGoldClick,
} from '@/public/track/awardDetail';
import { trackShowPrizeClick } from '@/public/track/awardDetail';
import PointCount from '@/components/PointCount';
import RecommendLottery from '../RecommendLottery';
// import { useQuery } from '@/public/hooks';
// import { trackEnterPage } from '@/public/track/index';
// import { homePrizesList } from '@/public/service/home';
// import { BUILTIN_CHANNELS } from './config';
import './index.less';

function getBtnName(campLotteryTransVo, abstractCampInfo, lotteryShareStatus) {
	const { status, prizeType } = campLotteryTransVo;
	if (status === 'AWARDED') {
		if (prizeType === 'MATTER') {
			if (lotteryShareStatus === 'SHARE') {
				return '分享到群';
			} else if (lotteryShareStatus === 'WAIT_MATERIAL') {
				return '晒晒我的奖品';
			} else if (lotteryShareStatus === 'MATERIAL') {
				return '查看我的晒奖';
			} else {
				return '查看物流';
			}
		} else if (prizeType === 'WISH_GOLD') {
			return '查看我的心愿金';
		} else if (prizeType === 'CASH') {
			return '等待商家联系';
		} else {
			return '参与更多抽奖';
		}
	} else if (
		abstractCampInfo &&
		abstractCampInfo.awardDeadLine &&
		abstractCampInfo.awardDeadLine < Date.now() &&
		status === 'SUCCESS'
	) {
		// 领奖过期
		if (prizeType === 'WISH_GOLD') {
			return '查看我的心愿金';
		} else {
			return '参与更多抽奖';
		}
	} else if (status === 'SUCCESS') {
		return '立即领取';
	}
}

function getTip(campLotteryTransVo, abstractCampInfo) {
	const { status, prizeType } = campLotteryTransVo;
	if (status === 'AWARDED') {
		if (prizeType === 'MATTER') {
			return '奖品将在15个工作日内发货，  ';
		} else if (prizeType === 'WISH_GOLD') {
			return '心愿金已领取，可去心愿金页面兑换商品哦！';
		} else if (prizeType === 'CASH') {
			return '商家将在7日内发放， 请确保账号填写无误';
		} else {
			return '已领取，可在支付宝查看';
		}
	} else if (
		abstractCampInfo &&
		abstractCampInfo.awardDeadLine &&
		abstractCampInfo.awardDeadLine < Date.now() &&
		status === 'SUCCESS'
	) {
		return '奖品已失效（已超过3日未领取）';
	} else if (status === 'SUCCESS') {
		if (prizeType === 'MATTER' || prizeType === 'CASH') {
			return '请在3日内填写领奖信息，逾期不可领取';
		} else if (prizeType === 'WISH_GOLD') {
			return '点击【立即领取】即可收下心愿金';
		} else {
			return '请在开奖三日内领取， 领取后会落入支付宝账户';
		}
	}
}

// 获取奖品图片展示
function getLotteryLogo(prizeInfoVoList, campLotteryTransVo) {
	const prize = prizeInfoVoList.find(
		(item) =>
			item.prizeId === campLotteryTransVo.lotteryPrizeInfoVoList[0].prizeId,
	);

	if (prize && prize.prizeImage) {
		return prize.prizeImage;
	} else if (
		prizeInfoVoList[0].prizeId ===
		campLotteryTransVo.lotteryPrizeInfoVoList[0].prizeId
	) {
		return prizeInfoVoList[0].prizeLogo;
	} else {
		return 'https://mdn.alipayobjects.com/huamei_zjbdv1/afts/img/A*2UIsQLnLIsoAAAAAAAAAAAAADg6FAQ/original';
	}
}

function ResultDialogV(props) {
	const {
		pageReady = true,
		showResultPanel,
		abstractCampInfo,
		isImmediateLottery = false,
		prizeUserDigestForShow = [],
		// materialId,
		// pointAmount,
		wishGoldRedPacket,
		lotteryShareStatus,
		onTapCloseResultPanel,
		campLotteryTransVo,
		prizeInfoVoList,
		onEndAddressTap,
		nextCampInfoVo,
		serverTime,
		serviceFavoriteVo,
		onTapNextAwardDetail = () => {},
	} = props;
	const extraLottieDomRef = useRef<HTMLDivElement>();
	const extraLottieRef = useRef<unknown>(null);
	const noLottieDomRef = useRef<HTMLDivElement>();
	const noLottieRef = useRef<unknown>(null);
	const onGoAddressTap = () => {
		onEndAddressTap(true);
	};
	const onMyEndAddressTap = () => {
		if (
			lotteryShareStatus === 'SHARE' &&
			campLotteryTransVo.status === 'AWARDED'
		) {
			onTapCloseResultPanel();
		}
		onEndAddressTap(false);
	};
	const goWish = () => {
		trackGoWishGoldClick({ component: '详情页开奖弹窗-心愿金banner' });
		ap.pushWindow(
			'alipays://platformapi/startapp?appId=2018103161898599&page=pages%2FpointsIndex%2FpointsIndex',
		);
	};
	const goRed = () => {
		trackGoWishGoldClick({ component: '详情页开奖弹窗-心愿金banner' });
		ap.pushWindow(wishGoldRedPacket.adUrl);
	};
	const goSquare = () => {
		trackShowPrizeClick({ component: '开奖弹窗' });
		ap.pushWindow(
			'alipays://platformapi/startapp?appId=2018103161898599&page=firstSubpackage%2Fpages%2FprizeSquare%2Findex',
		);
	};
	useEffect(() => {
		if (!extraLottieRef.current) {
			setTimeout(() => {
				extraLottieRef.current = lottie.loadAnimation({
					container: extraLottieDomRef.current!, // 容器元素的引用
					renderer: 'canvas',
					loop: true, // 是否循环播放
					autoplay: true, // 是否自动播放
					path: 'https://gw.alipayobjects.com/os/bmw-prod/c0c8000d-beef-40e8-85b0-0e9d16eace7c.json', // 动画文件的路径
				});
			}, 50);
		}
		if (!noLottieRef.current) {
			setTimeout(() => {
				noLottieRef.current = lottie.loadAnimation({
					container: noLottieDomRef.current!, // 容器元素的引用
					renderer: 'canvas',
					loop: true, // 是否循环播放
					autoplay: true, // 是否自动播放
					path:
						abstractCampInfo.displayStatus === LOTTERY_STATE.ENDED &&
						!campLotteryTransVo &&
						!isImmediateLottery
							? 'https://mdn.alipayobjects.com/huamei_zjbdv1/afts/file/A*rg85Qp8mIsYAAAAAAAAAAAAADg6FAQ'
							: 'https://mdn.alipayobjects.com/huamei_zjbdv1/afts/file/A*LYVuTb8k70cAAAAAAAAAAAAADg6FAQ', // 动画文件的路径
				});
			}, 50);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<div>
			<div
				className={classNames(
					'r-mask',
					{ show: pageReady && showResultPanel },
					{ hide: !(pageReady && showResultPanel) },
				)}
				onClick={onTapCloseResultPanel}
			></div>
			<div
				className={classNames(
					'award-detail-result-dialog-v2',
					'r-thousand-lottery-bg--points',
					'r-panel-content',
					{ show: pageReady && showResultPanel },
					{ hide: !(pageReady && showResultPanel) },
					'r-thousand-lottery-bg',
					{
						'r-thousand-lottery-bg-no':
							campLotteryTransVo &&
							(campLotteryTransVo.status === 'SUCCESS' ||
								campLotteryTransVo.status === 'AWARDED'),
					},
				)}
			>
				{campLotteryTransVo &&
				(campLotteryTransVo.status === 'SUCCESS' ||
					campLotteryTransVo.status === 'AWARDED') ? (
					<>
						<div
							className='r-thousand-lottery-lottie'
							ref={extraLottieDomRef as LegacyRef<HTMLDivElement>}
						/>

						<img
							className='r-thousand-close'
							style={{ top: '-140px' }}
							src='https://gw.alipayobjects.com/mdn/TinyAppInnovation/afts/img/A*uMfFSKTb7a8AAAAAAAAAAAAAARQnAQ'
							onClick={onTapCloseResultPanel}
						/>
						<div className='r-thousand-lottery-title'>恭喜您中奖了</div>
						<div className='r-thousand-lottery-box'>
							<div className='r-thousand-points-award'>
								<div
									className='r-thousand-points-award-points-img '
									style={{
										backgroundImage: `url(${getLotteryLogo(prizeInfoVoList, campLotteryTransVo)})`,
									}}
								/>
								<div className='r-thousand-points-award__right'>
									<div className='r-thousand-points-award__txt1'>
										获得以下奖品：
									</div>
									<div className='r-thousand-points-award__txt2 textEllipsis'>
										{campLotteryTransVo.lotteryPrizeInfoVoList[0].subject}
									</div>
									<div className='r-thousand-points-award__txt3'>
										奖品数量 x1
									</div>
								</div>
							</div>
						</div>

						<div className='r-thousand-points-tips'>
							{getTip(campLotteryTransVo, abstractCampInfo)}
							{lotteryShareStatus &&
								campLotteryTransVo.status === 'AWARDED' && (
									<span className='tc-primary' onClick={onGoAddressTap}>
										{' '}
										查看物流{'>>'}
									</span>
								)}
						</div>
						<div className='btn-primary' onClick={onMyEndAddressTap}>
							{getBtnName(
								campLotteryTransVo,
								abstractCampInfo,
								lotteryShareStatus,
							)}
							{lotteryShareStatus &&
								lotteryShareStatus !== 'MATERIAL' &&
								campLotteryTransVo.status === 'AWARDED' && (
									<div className='l-flex-align-center'>
										<img
											className='w-40 h-40 ml-16'
											src='https://mdn.alipayobjects.com/huamei_zjbdv1/afts/img/A*FQ0oS56SC2MAAAAAAAAAAAAADg6FAQ/original'
										/>
										{lotteryShareStatus === 'SHARE' ? '+10' : '+500'}
									</div>
								)}
						</div>
					</>
				) : (
					<>
						<img
							className='r-thousand-close'
							src='https://gw.alipayobjects.com/mdn/TinyAppInnovation/afts/img/A*uMfFSKTb7a8AAAAAAAAAAAAAARQnAQ'
							onClick={onTapCloseResultPanel}
						/>
						<div
							className='r-thousand-no'
							ref={noLottieDomRef as LegacyRef<HTMLDivElement>}
						/>
						{prizeUserDigestForShow && prizeUserDigestForShow.length > 0 ? (
							<div className='r-thousand-end-winners-box'>
								<img
									className='r-thousand-end-winners-people-icon'
									src='https://mdn.alipayobjects.com/huamei_zjbdv1/afts/img/A*rF9OQL2ny_sAAAAAAAAAAAAADg6FAQ/original'
								/>
								<div className='r-thousand-end-winners-box1'>
									{prizeUserDigestForShow[0].userInfoDigestVos.map(
										(user, userIndex) => {
											if (userIndex > 9) return <></>;

											return (
												<div
													className='r-thousand-end-users-box'
													onClick={goSquare}
													// onFirstAppear="trackShowPrizeExposure"
												>
													<div className='r-thousand-end-users-flex'>
														<div
															className='r-thousand-end-user-icon'
															style={{
																backgroundImage: `url(${user.userIcon || 'https://gw.alipayobjects.com/mdn/TinyAppInnovation/afts/img/A*QRYrSY7LfzoAAAAAAAAAAAAAARQnAQ'})`,
															}}
														></div>
														<div className='r-thousand-end-user-name'>
															{user.userName}
														</div>
													</div>
												</div>
											);
										},
									)}

									{prizeUserDigestForShow[0].userInfoDigestVos.length > 2 && (
										<>
											<div className='r-thousand-end-user-placeholder'></div>
											<div className='r-thousand-end-user-placeholder'></div>
											<div className='r-thousand-end-user-placeholder'></div>
										</>
									)}
									{prizeUserDigestForShow[0].userInfoDigestVos.length > 9 && (
										<div className='r-thousand-end-user-onlynine'>
											仅展示前9位中奖者
										</div>
									)}
								</div>
							</div>
						) : (
							<div className='r-thousand-tips'>
								越努力越幸运，下一个大奖可能就是你！
							</div>
						)}
						{/* {wishGoldRedPacket && wishGoldRedPacket.adIcon && (
							<img
								// onLoad="appearWishGold"
								data-component='详情页开奖弹窗-心愿金banner'
								onClick={goRed}
								className='r-thousand-config'
								style={{
									marginTop:
										prizeUserDigestForShow && prizeUserDigestForShow.length > 0
											? '4px'
											: 'auto',
								}}
								src='{{wishGoldRedPacket.adIcon}}'
							/>
						)}

						<div className='r-thousand-wish l-flex-center' onClick={goWish}>
							<img
								className='w-56 h-56'
								src='https://mdn.alipayobjects.com/huamei_zjbdv1/afts/img/A*cdA1TbNgPOsAAAAAAAAAAAAADg6FAQ/original'
							/>
							<div className='fz-22 tc-9' style={{ margin: '0 8px' }}>
								抽奖累计获得:
							</div>
							{+pointAmount > -1 && (
								<div
									// onFirstAppear="appearWishGold"
									data-component='详情页开奖弹窗-心愿金数量'
									className='fz-36 tc-primary lh-normal relative top-[-3px]'
									style={{ fontFamily: 'DINPro-Medium' }}
								>
									<PointCount count={+pointAmount} />
								</div>
							)}
						</div> */}
						{/* <!-- 推荐抽奖--> */}
						{nextCampInfoVo && nextCampInfoVo?.prizeInfoVoList?.length > 0 && (
							<RecommendLottery
								onTapNextAwardDetail={onTapNextAwardDetail}
								nextCampInfoVo={nextCampInfoVo}
								serverTime={serverTime}
								serviceFavoriteVo={serviceFavoriteVo}
							/>
						)}
					</>
				)}
			</div>
		</div>
	);
}

export default ResultDialogV;
