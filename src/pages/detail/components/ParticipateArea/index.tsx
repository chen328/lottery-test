import { useState, LegacyRef, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { useThrottleFn } from 'ahooks';
import { trackGoWishGoldClick } from '@/public/track/awardDetail';
import { storageToday } from '@/public/util';
import PointCount from '@/components/PointCount';
import lottie from 'lottie-web';
import { LOTTERY_STATE } from '@/public/enum';

import './index.less';

function formatWish(point) {
	if (+point >= 10000) {
		return `${(Math.floor(+point / 1000) / 10).toFixed(1)}w`;
	} else {
		return point;
	}
}

const ParticipateArea = (props) => {
	const {
		config,
		pointAmount = 0,
		circleButton = true,
		showLotteryDetailGuideConfig = false,
		lotteryDetailGuideConfig,
		showSliderBottom = false,
		onTapRightBtn = () => {},
		onTapLeftBtn = () => {},
		abstractCampInfo = null,
		onTapNextAwardDetail = () => {},
		onShowResultPanel = () => {},
	} = props;

	const [focusRight, setfocusRight] = useState(true);
	const [showTips, setshowTips] = useState(false);
	const lottieDomRef = useRef<HTMLDivElement>();
	const lottieRef = useRef<unknown>(null);
	const { run } = useThrottleFn(
		() => {
			onTapRightBtn();
		},
		{ wait: 1000 },
	);
	const { run: runLeft } = useThrottleFn(
		() => {
			onTapLeftBtn();
		},
		{ wait: 1000 },
	);

	const goWish = () => {
		trackGoWishGoldClick({ component: '详情页底部心愿金入口' });
		ap.pushWindow(
			'alipays://platformapi/startapp?appId=2018103161898599&page=pages%2FpointsIndex%2FpointsIndex',
		);

		storageToday('WISHTIPS', true);
		storageToday('GOODSRECOMMEND', true);
		setshowTips(true);
	};

	const onTapLeftBtnTip = () => {
		if (config?.leftBtn?.tipUrl) {
			ap.pushWindow(config.leftBtn.tipUrl);
		}
	};
	const lotteryDetailGuideConfigClick = () => {
		ap.pushWindow(lotteryDetailGuideConfig.adUrl);
		storageToday('GOODSRECOMMEND', true);
	};
	// 点击左按钮
	const onMyTapLeftBtn = () => {
		// 如果未聚焦到左按钮，点击后聚焦
		if (config?.rightBtn?.show && focusRight) {
			setfocusRight(false);
			return;
		}

		if (!config?.leftBtn?.text || config?.leftBtn?.state !== 'pa-active') {
			return;
		}

		runLeft();
	};
	const onMyTapRightBtn = () => {
		// 如果未聚焦到右按钮，点击后聚焦
		if (config?.rightBtn?.show && !focusRight) {
			setfocusRight(true);
			return;
		}

		if (
			!config?.rightBtn?.show ||
			config?.rightBtn?.state !== 'pa-active' ||
			config?.rightBtn?.type == 'share'
		) {
			return;
		}

		run();
	};
	useEffect(() => {
		if (!lottieRef.current) {
			setTimeout(() => {
				lottieRef.current = lottie.loadAnimation({
					container: lottieDomRef.current!, // 容器元素的引用
					renderer: 'canvas',
					loop: true, // 是否循环播放
					autoplay: true, // 是否自动播放
					path: 'https://mdn.alipayobjects.com/portal_s6jpcc/afts/file/A*tNr0SIngd0QAAAAAAAAAAAAAAQAAAQ', // 动画文件的路径
				});
			}, 50);
		}
	}, []);
	return (
		<div className='lottery-service-bar-wrap'>
			{config.leftBtn?.show || config.rightBtn?.show ? (
				<>
					{/* <!-- 左 圆形按钮 --> */}
					{config.leftBtn && (
						<div
							className={classNames('lottery-service-bar-top')}
							style={{
								display: config.rightBtn.show && focusRight ? 'none' : '',
							}}
						>
							{/* <!-- 活动未开始tips --> */}
							{config.startInfo && (
								<div
									className={classNames('pa-tip-wrap', {
										hideTips: !circleButton,
									})}
								>
									<div className='pa-tip'>
										<div className='pa-tip-text' style={{ color: '#ff3c2c' }}>
											{config.startInfo}
										</div>
										<div className='pa-tip-triangle'></div>
									</div>
								</div>
							)}

							{/* <!-- 圆形按钮上方tips --> */}
							{config.leftBtn.tip && (
								<div
									className={classNames('pa-tip-wrap', {
										hideTips: !circleButton,
									})}
								>
									<div className='pa-tip' onClick={onTapLeftBtnTip}>
										<div
											className={classNames(
												'pa-tip-text',
												{ flex: config.leftBtn.tipBtn },
												{ 'items-center': config.leftBtn.tipBtn },
											)}
											style={{ color: '#ff3c2c' }}
										>
											{config?.leftBtn?.tip}
											{config.leftBtn.tipBtn && (
												<div
													className='getWishTips_Btn'
													onClick={onMyTapLeftBtn}
												>
													{config?.leftBtn?.tipBtn}
												</div>
											)}
										</div>
										<div className='pa-tip-triangle'></div>
									</div>
								</div>
							)}

							{/* <!-- 中心圆按钮 --> */}
							<div
								className={classNames(
									'service-bar-button',
									{ hideCircleButton: !circleButton },
									{ [config?.leftBtn?.state]: true },
									{ circleButton_gray: config.leftBtn?.tipBtn },
								)}
								onClick={onMyTapLeftBtn}
							>
								<div
									className={classNames('name', {
										gray_name_circle: config?.leftBtn?.tipBtn,
									})}
								>
									{config?.leftBtn?.text}
								</div>
								{config.leftBtn.subText && (
									<div className='tips'>{config?.leftBtn?.subText}</div>
								)}
							</div>

							{/* <!-- 渐变透明背景 --> */}
							{circleButton && <div className='service-bar-bg'></div>}
						</div>
					)}

					{/* <!-- 右 圆形按钮 --> */}
					<div
						className={classNames('lottery-service-bar-top', {
							'pa-invisible': !config.rightBtn.show,
						})}
						style={{
							display: !(config.rightBtn.show && focusRight) ? 'none' : '',
						}}
					>
						{/* <!-- 圆形按钮上方tips --> */}
						{config.rightBtn.tip && (
							<div
								className={classNames('pa-tip-wrap', {
									hideTips: !circleButton,
								})}
							>
								<div className='pa-tip'>
									<div className='pa-tip-text' style={{ color: '#ff3c2c' }}>
										{config?.rightBtn?.tip}
									</div>
									<div className='pa-tip-triangle'></div>
								</div>
							</div>
						)}

						{/* <!-- 中心圆按钮 --> */}
						<div
							className={classNames(
								'service-bar-button',
								{ hideCircleButton: !circleButton },
								{ [config.rightBtn.state]: true },
							)}
							onClick={onMyTapRightBtn}
						>
							<div className='name'>{config.rightBtn?.text}</div>
							{config.rightBtn.subText && (
								<div className='tips'>{config.rightBtn?.subText}</div>
							)}
						</div>
						{/* <!-- 渐变透明背景 --> */}
						{circleButton && <div className='service-bar-bg'></div>}
					</div>
				</>
			) : (
				<div className='service-bar-bg--big'>
					{abstractCampInfo?.myLotteryNum && (
						<div className='winners-wrap relative top-[170px]'>
							<div
								className='view-all-winners awardDetail-newdetail__winner'
								style={{
									backgroundColor:
										abstractCampInfo.displayStatus === LOTTERY_STATE.ENDED
											? '#ffffff'
											: '#FFF2F3',
									border:
										abstractCampInfo.displayStatus === LOTTERY_STATE.ENDED
											? '1px solid #EC171F'
											: '',
								}}
								onClick={() => {
									if (abstractCampInfo.displayStatus === LOTTERY_STATE.ENDED) {
										onShowResultPanel && onShowResultPanel();
									}
								}}
								// onTap='onTapImmediateShowResultPanel'
							>
								{[LOTTERY_STATE.GOING, LOTTERY_STATE.WAIT_OPEN].includes(
									abstractCampInfo.displayStatus,
								)
									? '等待开奖 ...'
									: '查看开奖结果'}
							</div>
							<div
								onClick={onTapNextAwardDetail}
								className='winners-wrap-rate'
								style={{
									marginTop: '30px',
									color:
										abstractCampInfo.displayStatus === LOTTERY_STATE.ENDED
											? '#999'
											: '#EE383F',
								}}
							>
								参与下一个抽奖{'>'}
							</div>
						</div>
					)}
				</div>
			)}

			{/* <!-- 两侧功能按钮 --> */}
			<div className='lottery-service-bar-bottom'>
				<div className='lottery-service-participate-box'>
					<div className='lottery-service-participate-num'>参与人数</div>
					<div className='lottery-service-participate-flex'>
						<img
							className='lottery-service-participate-gift'
							src={
								config.startInfo
									? 'https://gw.alipayobjects.com/mdn/TinyAppInnovation/afts/img/A*HN3HSrRatxAAAAAAAAAAAAAAARQnAQ'
									: 'https://gw.alipayobjects.com/mdn/TinyAppInnovation/afts/img/A*K4RjRrk4opwAAAAAAAAAAAAAARQnAQ'
							}
						/>

						<div className='lottery-service-participate-number'>
							{config.participateNum || 0}
						</div>

						{/* <div
              a:if="{{config.startInfo}}"
              className="lottery-service-participate-number"
              style={{color:'#333333'}}
            >
              {config.isSubscribe ? '已开启' : '去开启'}
            </div>
            <div a:else className="lottery-service-participate-number">
              {config.participateNum || 0}
            </div> */}
					</div>
				</div>

				{/* <!-- 中心映射按钮 --> */}
				<div className='lottery-button'></div>

				{/* <!-- 心愿金 --> */}
				<div className='lottery-right-share' onClick={goWish}>
					{showLotteryDetailGuideConfig && lotteryDetailGuideConfig ? (
						<div onClick={lotteryDetailGuideConfigClick}>
							<img
								className='lottery-right-wish-festival w-[124px] h-[152px]'
								src={lotteryDetailGuideConfig?.adIcon}
							/>
						</div>
					) : showTips ? (
						<img
							className='lottery-right-wish-tip'
							src='https://mdn.alipayobjects.com/portal_s6jpcc/afts/img/A*IY6FQZ3MnZkAAAAAAAAAAAAAAQAAAQ/original'
						/>
					) : null}

					<div className='lottery-service-participate-num ml-64'>
						我的心愿金
					</div>
					<div className='lottery-service-participate-flex justify-end ml-0 mr-20'>
						<div
							className='lottery-service-wish-icon'
							ref={lottieDomRef as LegacyRef<HTMLDivElement>}
						/>
						{/* <lottie
              className="lottery-service-wish-icon"
              path="https://mdn.alipayobjects.com/portal_s6jpcc/afts/file/A*tNr0SIngd0QAAAAAAAAAAAAAAQAAAQ"
              optimize="{{true}}"
              autoplay="{{true}}"
              repeat-count="-1"
            /> */}
						<div className='lottery-service-share-number'>
							{+pointAmount >= 10000 ? (
								<div>{formatWish(pointAmount)}</div>
							) : (
								<PointCount count={+pointAmount} />
							)}
						</div>
					</div>
				</div>
			</div>

			<div
				className={classNames(
					'lottery-service-bar-wrap-next-lottery-text',
					'tc-primary',
					{
						'lottery-service-bar-wrap-next-lottery-text--show':
							showSliderBottom,
					},
				)}
			>
				{/* <lottie
        autoplay
        path="https://mdn.alipayobjects.com/huamei_zjbdv1/afts/file/A*GdSGRYpv80EAAAAAAAAAAAAADg6FAQ"
        className="lottery-service-bar-wrap-next-lottery-text-btn"
        repeat-count="-1"
      /> */}
				<div className='l-flex-center fz-24 tc-9'>
					<img
						className='lottery-service-bar-wrap-next-lottery-text-icon'
						src='https://mdn.alipayobjects.com/huamei_zjbdv1/afts/img/A*I-lbT4BtG14AAAAAAAAAAAAADg6FAQ/original'
					/>{' '}
					上滑试试
				</div>
			</div>
		</div>
	);
};

export default ParticipateArea;
