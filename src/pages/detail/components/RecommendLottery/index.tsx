import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { useCountDown } from 'ahooks';
import {
	trackRecommendExposure,
	trackRecommendClick,
} from '@/public/track/awardDetail';

import './index.less';

const getHour = (sTime, rTime) => {
	// rpc返回时间
	const end = rTime;
	// 服务器当前时间
	const now = sTime;
	// 相差的毫秒数
	const msec = end - now;
	// 计算相差 时
	const day = parseInt(msec / 1000 / 60 / 60 / 24 + '');
	const hr = parseInt(((msec / 1000 / 60 / 60) % 24) + '') + day * 24;
	return hr;
};

function RecommendLottery(props) {
	const { onTapNextAwardDetail, component, nextCampInfoVo } = props;
	const [serverTime, setServerTime] = useState<number>();
	const [, formattedRes] = useCountDown({
		targetDate: nextCampInfoVo.gmtEnd,
	});
	const { hours, minutes, seconds } = formattedRes;

	const TapNextAwardDetail = () => {
		trackRecommendClick({
			component,
			...nextCampInfoVo,
		});
		onTapNextAwardDetail && onTapNextAwardDetail();
	};
	const onRecommendExpose = () => {
		// 曝光推荐抽奖埋点
		trackRecommendExposure({
			component,
			...nextCampInfoVo,
		});
	};
	useEffect(() => {
		setServerTime(new Date().getTime());
		onRecommendExpose();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<div className='recommend-lottery-wrap' id='recommend-lottery'>
			<div className='recommend-lottery-title'>
				<img
					className='recommend-lottery-title-star'
					src='https://gw.alipayobjects.com/mdn/TinyAppInnovation/afts/img/A*OgTjTa6G_OcAAAAAAAAAAAAAARQnAQ'
				/>
				<div className='recommend-lottery-title-desc'>推荐抽奖</div>
				<img
					className='recommend-lottery-title-star'
					src='https://gw.alipayobjects.com/mdn/TinyAppInnovation/afts/img/A*OgTjTa6G_OcAAAAAAAAAAAAAARQnAQ'
				/>
			</div>
			<div className='recommend-lottery-region'>
				<div className='recommend-lottery-region-desc'>
					奖品由
					<span className='recommend-lottery-region-desc-left'>【</span>
					<img
						className='recommend-lottery-region-desc-regionIcon'
						src={nextCampInfoVo.serviceFavoriteVo && nextCampInfoVo.serviceFavoriteVo.serviceInfoVo && nextCampInfoVo.serviceFavoriteVo.serviceInfoVo.serviceIcon}
					/>
					<div className='recommend-lottery-region-desc-name'>
						{nextCampInfoVo.serviceFavoriteVo &&
							nextCampInfoVo.serviceFavoriteVo.serviceInfoVo &&
							nextCampInfoVo.serviceFavoriteVo.serviceInfoVo.serviceName}
					</div>
					<span className='recommend-lottery-region-desc-right'>】</span>
					提供
				</div>
				<div
					className='recommend-lottery-time'
					data-v='{{utils.getHour(serverTime,nextCampInfoVo.gmtEnd)}}'
				>
					{/* <!-- 图片右侧 倒计时 --> */}
					{/* <!-- 已参与活动:只显示x月x日 xx:xx，未参与活动：时<48显示倒计时， 时>=48显示x月x日 xx:xx --> */}
					{nextCampInfoVo.openMode === 'TIME' &&
						getHour(serverTime, nextCampInfoVo.gmtEnd) < 48 &&
						!nextCampInfoVo.myLotteryNum && (
							<div className='re-time'>
								<div slot-scope='props' className='lottery-my-time'>
									<span
										className='recommend-lottery-time-count'
										style={{ marginLeft: 0 }}
									>
										{hours > 9 ? hours : `0${hours}`}
									</span>
									:
									<span className='recommend-lottery-time-count'>
										{minutes > 9 ? minutes : `0${minutes}`}
									</span>
									:
									<span className='recommend-lottery-time-count'>
										{seconds > 9 ? seconds : `0${seconds}`}
									</span>
									<span className='re-time-text'>后开奖</span>
								</div>
							</div>
						)}
					{nextCampInfoVo.openMode === 'TIME' && (
						<>
							{nextCampInfoVo.myLotteryNum ||
								(nextCampInfoVo.timeFmt &&
									getHour(serverTime, nextCampInfoVo.gmtEnd) >= 48 && (
										<div className='time'>{nextCampInfoVo.timeFmt}自动开奖</div>
									))}
						</>
					)}
					{nextCampInfoVo.openMode === 'PERSON' && (
						<div className='time'>
							满{nextCampInfoVo.personOpenbudgetValue}人时自动开奖
						</div>
					)}
					{nextCampInfoVo.openMode === 'MANUAL' && (
						<div className='time'>发起人手动开奖</div>
					)}
				</div>
			</div>
			<div
				className='recommend-lottery-list l-flex'
				onClick={TapNextAwardDetail}
			>
				<div className='lottery-main-list-img'>
					<img src={nextCampInfoVo.processLogo} />
				</div>
				<div className='lottery-main-list-text'>
					<div>
						<div className='title'>{nextCampInfoVo.lottoryTitles}</div>
						{nextCampInfoVo.cornerMarker && (
							<div className='sub-tips'>{nextCampInfoVo.cornerMarker}</div>
						)}
					</div>

					<div className='item-bottom'>
						<div className='list-btn-pricedesc'>奖品价值</div>
						{nextCampInfoVo.prizeInfoVoList && (
							<div className='list-btn-price'>
								￥{nextCampInfoVo.totalPrice}
							</div>
						)}
						<div
							className={classNames(
								'list-btn-button',
								{ 'list-btn-button--get': nextCampInfoVo.myLotteryNum },
								{
									'list-btn-button--overlimit':
										nextCampInfoVo.longButtonText &&
										nextCampInfoVo.longButtonText.length > 4,
								},
							)}
						>
							{/* <img
								a:if='{{ nextCampInfoVo.myLotteryNum }}'
								className='list-btn-button-heart'
								mode='scaleToFill'
								src='/images/home/heart-btn.png'
							/> */}

							{nextCampInfoVo.myLotteryNum
								? '已参与'
								: nextCampInfoVo.longButtonText || '0元抽奖'}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default RecommendLottery;
