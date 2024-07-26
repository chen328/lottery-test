import { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { useCountDown } from 'ahooks';
import classNames from 'classnames';
import { LOTTERY_STATE } from '@/public/enum';
import CampRichText from '../CampRichText';
import RecommendLottery from '../RecommendLottery';
import ResultDialogV from '../ResultDialogV';

import './index.less';

const statusHeight = 30;
const TEXTMAP = ['一', '二', '三', '四', '五'];

const DetailContent = forwardRef((props: any, ref) => {
	const {
		pointAmount = -1,
		lotteryShareStatus,
		campClause,
		abstractCampInfo,
		campLotteryTransVo,
		prizeInfoVoList = [],
		totalPrice = 0,
		serviceFavoriteVo,
		isChannelLottery = false,
		isImmediateLottery = false,
		nextCampInfoVo,
		// onChangeScrollable = () => {},
		wishGoldRedPacket,
		prizeUserDigestVos = [],
		campDescItemInfos,
	} = props;
	const [serverTime, setServerTime] = useState<number>(0);
	const [showResultPanel, setShowResultPanel] = useState<boolean>(false);
	const [prizeUserDigestForShow, setPrizeUserDigestForShow] = useState([]);
	const [, formattedRes] = useCountDown({
		targetDate: abstractCampInfo.gmtEnd,
	});
	const { hours, minutes, seconds } = formattedRes;

	const onTapNextAwardDetail = () => {
		setShowResultPanel(false);
		props?.onTapNextAwardDetail();
	};
	const onTapCloseResultPanel = () => {
		setShowResultPanel(false);
	};
	const onEndAddressTap = (isGoAddress = false) => {
		props.onEndAddressTap(isGoAddress);
	};
	const onTapShowResultPanel = () => {
		setShowResultPanel(true);
	};

	useImperativeHandle(ref, () => ({
		showResultPanel() {
			console.log('子组件的方法被调用');
			onTapShowResultPanel();
		},
	}));

	useEffect(() => {
		setServerTime(Date.now());
		if (abstractCampInfo.displayStatus === LOTTERY_STATE.ENDED) {
			setShowResultPanel(true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	useEffect(() => {
		setPrizeUserDigestForShow(prizeUserDigestVos.slice(0, 1));
	}, [prizeUserDigestVos]);

	return (
		<div className='awardDetail-newdetail'>
			<div className='awardDetail-newdetail-bg'>
				<div
					className='awardDetail-newdetail-top'
					style={{ marginTop: `${statusHeight}px` }}
				>
					{/* <!-- 活动开奖模式 --> */}
					{/* <!-- 未开始 --> */}
					{abstractCampInfo.displayStatus === 'WAIT_GOING' && (
						<div className='awardDetail-newdetail-top__mode mt-16'>
							<img
								className='awardDetail-newdetail-top__mode-start'
								src='https://mdn.alipayobjects.com/huamei_zjbdv1/afts/img/A*MRUATY23boEAAAAAAAAAAAAADg6FAQ/original'
							/>
							<div className='fz-32 awardDetail-newdetail-top__mode-text'>
								{abstractCampInfo.cGmtStart}
							</div>
						</div>
					)}

					{/* <!-- 已开奖 --> */}
					{abstractCampInfo.displayStatus === 'ENDED' &&
						campClause.openMode !== 'IMMEDIATE' && (
							<div className='awardDetail-newdetail-top__mode mt-16'>
								<img
									className='awardDetail-newdetail-top__mode-end'
									src='https://mdn.alipayobjects.com/huamei_zjbdv1/afts/img/A*y6lcT5uHGcQAAAAAAAAAAAAADg6FAQ/original'
								/>
								<div className='fz-32 awardDetail-newdetail-top__mode-text'>
									{abstractCampInfo.cGmtEnd}
								</div>
							</div>
						)}

					{/* <!-- 时间开奖 --> */}
					{!['ENDED', 'WAIT_GOING'].includes(abstractCampInfo.displayStatus) &&
						campClause.openMode === 'TIME' &&
						serverTime && (
							<div className='awardDetail-newdetail-top__mode mt-16'>
								<img
									className='awardDetail-newdetail-top__mode-time'
									src='https://mdn.alipayobjects.com/huamei_zjbdv1/afts/img/A*gUDkTa7Y0gsAAAAAAAAAAAAADg6FAQ/original'
								/>
								<div className='l-flex-center'>
									<span className='awardDetail-newdetail-top__mode-count text-[28px] l-flex-center ml-0'>
										{hours > 10 ? hours : `0${hours}`}
									</span>
									<span
										className='text-[28px] fw-medium'
										style={{ color: '#FF2626', padding: '0 4px' }}
									>
										:
									</span>
									<span className='awardDetail-newdetail-top__mode-count text-[28px] l-flex-center'>
										{minutes > 10 ? minutes : `0${minutes}`}
									</span>
									<span
										className='text-[28px] fw-medium'
										style={{ color: '#FF2626', padding: '0 4px' }}
									>
										:
									</span>
									<span className='awardDetail-newdetail-top__mode-count text-[28px] l-flex-center'>
										{seconds > 10 ? seconds : `0${seconds}`}
									</span>
								</div>
							</div>
						)}

					{/* <!-- 奖品图片 --> */}
					<div
						className={classNames('awardDetail-newdetail-top__logo', {
							'awardDetail-newdetail-top__logo--small':
								abstractCampInfo.campLogoType === 0,
						})}
						style={{ backgroundImage: `url(${abstractCampInfo.campLogo})` }}
					>
						<div className='awardDetail-newdetail-top__logo-price l-flex-align-center text-[28px] white'>
							价值
							{abstractCampInfo.priceDesc ? (
								abstractCampInfo.priceDesc
							) : (
								<>
									￥
									<div
										className='lh-medium'
										style={{ fontFamily: 'DINPro-Medium' }}
									>
										{totalPrice}
									</div>
								</>
							)}
						</div>

						{/* <!-- 参与标签 --> */}
						{abstractCampInfo.myLotteryNum && (
							<img
								className='awardDetail-newdetail-top__part'
								src='https://mdn.alipayobjects.com/huamei_zjbdv1/afts/img/A*3GO2QaNkylIAAAAAAAAAAAAADg6FAQ/original'
							/>
						)}
					</div>

					{/* <!-- 奖品信息 --> */}

					{/* <!-- 单奖品 --> */}
					{prizeInfoVoList && prizeInfoVoList.length < 2 && (
						<div className='awardDetail-newdetail-top__single l-flex-align-center fw-medium fz-36 tc-3'>
							{prizeInfoVoList[0].subject}
							{/* 开奖数量 */}
							<div className='awardDetail-newdetail-top__single-quantity-box'>
								{/* <block a:if="{{ campClause.openMode === 'IMMEDIATE' && campClause.showWinRate }}">
            <div className="awardDetail-newdetail-top__single-quantity">
              {{campClause.winRate / 100}}%
            </div>
            <div className="awardDetail-newdetail-top__single-quantity-desc">中奖率</div>
          </block> */}
								<div className='awardDetail-newdetail-top__single-quantity fz-24 lh-medium'>
									{prizeInfoVoList[0].totalQuantity}
									<span className='ad-prize-quantity-unit'>份</span>
								</div>
								<div className='awardDetail-newdetail-top__single-quantity-desc'>
									开奖数量
								</div>
							</div>
						</div>
					)}

					{/* 多奖品 */}
					{prizeInfoVoList && prizeInfoVoList.length > 1 && (
						<div className='awardDetail-newdetail-top__list'>
							{prizeInfoVoList.map((item, index) => {
								return (
									<div className='l-flex-align-center justify-between mb-24'>
										<div className='fz-26 fw-medium tc-3'>{item.subject}</div>
										<div className='awardDetail-newdetail-top__list-quantity'>
											{TEXTMAP[index]}等奖x{item.totalQuantity}
										</div>
									</div>
								);
							})}
						</div>
					)}

					{/* <div a:if="{{ campClause.openMode === 'IMMEDIATE' }}" className="awardDetail-newdetail-immediate l-flex-align-center">
        <!-- 活动开启 -->
        <block a:if="{{ abstractCampInfo.displayStatus !== 'WAIT_GOING' }}">
          <div className="fz-24 fw-medium tc-3 lh-normal">中奖名单:</div>
          <block a:if="{{prizeInfo.userInfos && prizeInfo.userInfos.length > 0}}">
            <swiper className="ad-open-swiper" autoplay vertical circular>
              <swiper-item
                a:for="{{prizeInfo.userInfos}}"
                a:for-item="user"
                className="ad-open-swiper-item l-flex-align-center"
                key="swiper-item-{{index}}"
              >
                <img
                  style="width: 32rpx;height: 32rpx;margin-right: 4rpx; border-radius: 50%;"
                  src="{{user.userIcon || 'https://gw.alipayobjects.com/mdn/TinyAppInnovation/afts/img/A*QRYrSY7LfzoAAAAAAAAAAAAAARQnAQ'}}"
                />
                <div className="fz-24 tc-6">
                  {{user.userName}}
                  <span style="padding:0 4rpx;">抽中了</span>
                  <span className="tc-3">{{prizeInfo.commodityName}}</span>
                </div>
              </swiper-item>
            </swiper>
          </block>

          <block a:else>
            <div className="ad-open-swiper fz-24 l-flex-align-center" style="color:#686868;">
              暂无人中奖用户，可能第一位就是你…
            </div>
          </block>
        </block>
      </div> */}
				</div>

				{/* <div className="awardDetail-newdetail-top__rule" onTap="onPushToRules">抽奖规则</div> */}

				{/* <!-- 分割线 --> */}
				<img
					className='awardDetail-newdetail__line'
					src='https://mdn.alipayobjects.com/huamei_zjbdv1/afts/img/A*AuJGSo98OK0AAAAAAAAAAAAADg6FAQ/original'
				/>

				<div className='awardDetail-newdetail__content'>
					{/* <!-- 奖品提供 --> */}
					<div className='l-flex-center fz-24 tc-9 mb-24'>
						奖品由
						<span className='fw-medium tc-3'>【</span>
						<img
							style={{ borderRadius: '50%', margin: '0 4px' }}
							className='w-24 h-24'
							src='{{serviceFavoriteVo.serviceInfoVo && serviceFavoriteVo.serviceInfoVo.serviceIcon}}'
						/>
						<span className='fw-medium tc-3'>
							{serviceFavoriteVo?.serviceInfoVo?.serviceName}】
						</span>
						提供
					</div>

					{/* <!-- 活动图文描述 --> */}
					<CampRichText
						campDescItemInfos={campDescItemInfos}
						abstractCampInfo={abstractCampInfo}
					/>
				</div>
			</div>

			{/* <!-- 推荐抽奖--> */}
			{!isChannelLottery &&
				!isImmediateLottery &&
				nextCampInfoVo &&
				nextCampInfoVo?.prizeInfoVoList?.length > 0 && (
					<RecommendLottery
						onTapNextAwardDetail={onTapNextAwardDetail}
						nextCampInfoVo={nextCampInfoVo}
						serverTime={serverTime}
						serviceFavoriteVo={serviceFavoriteVo}
					/>
				)}

			{/* <!-- 查看我的中奖状态按钮 --> */}
			{/* {abstractCampInfo.displayStatus === LOTTERY_STATE.ENDED &&
				prizeUserDigestForShow &&
				prizeUserDigestForShow.length &&
				!isImmediateLottery && (
					<div className='winners-wrap'>
						<div
							className='view-all-winners awardDetail-newdetail__winner'
							onClick={onTapShowResultPanel}
						>
							已开奖 查看中奖名单
						</div>
					</div>
				)} */}

			{/* <!-- 限时抽奖开关 --> */}
			{/* <div
    a:elif="{{ isImmediateLottery && campLotteryTransVo && campLotteryTransVo.status}}"
    className="winners-wrap"
  >
    <div className="div-all-winners awardDetail-newdetail__winner" onTap="onTapImmediateShowResultPanel">
      已开奖 查看开奖结果
    </div>
    <div onTap="onTapNextAwardDetail" className="winners-wrap-rate">
      参与下一个抽奖>
    </div>
  </div> */}

			{/* <!-- 即时开奖发奖失败 --> */}
			{/* <block a:if="{{ isImmediateLottery && campLotteryTransVo && campLotteryTransVo.status && campLotteryTransVo.status === 'SUCCESS' }}">
    <div className="r-mask {{pageReady &&  showResultPanel ? 'show' : 'hide'}}">
      <div className="immediate-err-dialog" onFirstAppear="appearError">
        <div className="immediate-err-dialog-btn" onTap="onTapCloseResultPanel"></div>
      </div>
    </div>
  </block> */}

			{/* <!-- 正常开奖详情 --> */}
			{/* <block a:else> */}
			<ResultDialogV
				type='points'
				abstractCampInfo={abstractCampInfo}
				campLotteryTransVo={campLotteryTransVo}
				showResultPanel={showResultPanel}
				prizeUserDigestForShow={prizeUserDigestForShow}
				nextCampInfoVo={nextCampInfoVo}
				// advTaskInfoVo={ advTaskInfoVo }
				// immediateRedDialog="{{ immediateRedDialog }}"
				// isImmediateLottery="{{ isImmediateLottery }}"
				serviceFavoriteVo={serviceFavoriteVo}
				// consumeConfigInfoVo={ consumeConfigInfoVo }
				// campClause={ campClause }
				wishGoldRedPacket={wishGoldRedPacket}
				pointAmount={pointAmount}
				prizeInfoVoList={prizeInfoVoList}
				onTapCloseResultPanel={onTapCloseResultPanel}
				onEndAddressTap={onEndAddressTap}
				lotteryShareStatus={lotteryShareStatus}
				serverTime={serverTime}
				onTapNextAwardDetail={onTapNextAwardDetail}
				// serviceFavoriteVo={serviceFavoriteVo}
				// materialId="{{ materialId }}"
			/>
			{/* </block> */}
		</div>
	);
});

export default DetailContent;
