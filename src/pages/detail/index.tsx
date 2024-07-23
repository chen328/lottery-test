import { useState } from 'react';
import defaultcompany from '@/public/images/default-company.png';
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

// 抽奖详情
function LotteryDetail() {
	const [abstractCampInfo, setabstractCampInfo] = useState<any>(null);
	const goHome = () => {
		location.href = '/';
	};
	return (
		<div className='container'>
			{/* 骨架图 */}
			{!abstractCampInfo ? (
				<div className='detail-loading-image'></div>
			) : (
				<div>
					{/* <!-- 错误显示 --> */}
					{helper.isCampValid(abstractCampInfo.displayStatus) && (
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
								{/* <new-detail-component
                totalPrice="{{totalPrice}}"
                onTapReceiveCoupon="onTapReceiveCoupon"
                onClickMore="onTapMorePrize"
                onChangeScrollable="onChangeScrollable"
                onTapNextAwardDetail="onTapNextAwardDetail"
                onEndAddressTap="onEndAddressTap"
                onRateClick="onRateClick"
                couponInfo="{{coupon}}"
                condition="{{condition}}"
                pageReady="{{pageReady}}"
                campInviteVo="{{campInviteVo}}"
                nextCampInfoVo="{{nextCampInfoVo}}"
                hideMore="{{hideMore}}"
                campLotteryTransVo="{{campLotteryTransVo}}"
                benefits="{{benefits}}"
                prizeUserDigestVos="{{prizeUserDigestVos}}"
                serviceFavoriteVo="{{serviceFavoriteVo}}"
                additionalPrizeUserDigestVos="{{additionalPrizeUserDigestVos}}"
                channel="{{channel}}"
                campDescItemInfos="{{campDescItemInfos}}"
                objectId="{{objectId}}"
                partnerRegionInfo="{{partnerRegionInfo}}"
                abstractCampInfo="{{abstractCampInfo}}"
                campClause="{{campClause}}"
                prizeInfoVoList="{{prizeInfoVoList}}"
                adData="{{adData}}"
                consumeConfigInfoVo="{{consumeConfigInfoVo}}"
                isChannelLottery="{{ isChannelLottery }}"
                certificateCodeList="{{ certificateCodeList }}"
                isImmediateLottery="{{ isImmediateLottery }}"
                advTaskInfoVo="{{serviceFavoriteVo.serviceInfoVo.serviceAdvInfoVo.multiLinks && serviceFavoriteVo.serviceInfoVo.serviceAdvInfoVo.multiLinks[serviceFavoriteVo.serviceInfoVo.serviceAdvInfoVo.multiLinks.length - 1]}}"
                immediateRedDialog="{{ immediateRedDialog }}"
                wishGoldRedPacket="{{ wishGoldRedPacket }}"
                pointAmount="{{ pointAmount }}"
                lotteryShareStatus="{{ lotteryShareStatus }}"
                materialId="{{ materialId }}"
                topAdSpaceCode="{{ topAdSpaceCode }}"
              >
              </new-detail-component>
               */}

								{/* <!-- 参与抽奖区域 & 参与人数、分享按钮 -->
            <participate-area
              onSubscribe="onSubscribe"
              onTapLeftBtn="onTapLeftBtn"
              onTapRightBtn="onTapRightBtn"
              userSetting="{{userSetting}}"
              campId="{{abstractCampInfo.campId}}"
              config="{{helper.getBtnsConfig({fromHome,isAdmin, campLotteryTransVo, followLifeName, rightBtnAction, condition, customParams, campInviteVo,
                userSetting, customerActionBtn, haveGoToServiceLink, needLotteryPreGuide, lotteryPreGuideVo, lotteryPostGuideVo, consumeConfigInfoVo, mainSubText,
                lotteryDoingGuideVo, abstractCampInfo, wishCardProductVos, campClause, serviceFavoriteVo, isSubscribe, campRefuelTaskTransVoList, campRefuelTaskVoList,
                isChannelLottery, isImmediateLottery, unimktTaskInfoVo})}}"
              campScene="{{abstractCampInfo.campScene}}"
              systemColor="{{systemColor}}"
              needLotteryPreGuide="{{needLotteryPreGuide}}"
              circleButton="{{circleButton}}"
              longButton="{{longButton}}"
              campLotteryTransVo="{{campLotteryTransVo}}"
              fromHome="{{fromHome}}"
              campName="{{abstractCampInfo.campName}}"
              pointAmount="{{pointAmount}}"
              abstractCampInfo="{{abstractCampInfo}}"
              consumeConfigInfoVo="{{consumeConfigInfoVo}}"
              showSliderBottom="{{showSliderBottom}}"
              subtitle="{{subtitle}}"
              showLotteryDetailGuideConfig="{{showLotteryDetailGuideConfig}}"
              lotteryDetailGuideConfig="{{lotteryDetailGuideConfig}}"
              isStudent="{{isStudent}}"
              serviceAdvInfoVo="{{serviceFavoriteVo.serviceInfoVo.serviceAdvInfoVo}}"
              lightTask="{{lightTask}}"
              topAdRenderError="{{ topAdRenderError }}"
            >
            </participate-area> */}

								{/* <!-- 参与成功弹窗 -->
          <participate-dialog
            a:if="{{showParticipateSuccess}}"
            onTapClose="onTapCloseParicipate"
            onTapNextAwardDetail="onTapNextAwardDetail"
            onTapParicipateClick="onTapParicipateClick"
            abstractCampInfo="{{abstractCampInfo}}"
            nextCampInfoVo="{{nextCampInfoVo}}"
            adPrivateCampInfoVo="{{adPrivateCampInfoVo}}"
            prizeListIndex="{{prizeListIndex}}"
            campList="{{campList}}"
            campClause="{{campClause}}"
            showParticipateSuccess="{{showParticipateSuccess}}"
            recommendPopCampInfo="{{recommendPopCampInfo}}"
            campLotteryTransVo="{{campLotteryTransVo}}"
          /> */}

								{/* <!-- 中奖翻倍弹窗 -->
          <winning-rate-dialog
            a:if="{{showRate}}"
            onRateClose="onRateClose"
            campRefuelTaskTransVoList="{{campRefuelTaskTransVoList}}"
            TaskTransVoAllNum="{{TaskTransVoAllNum}}"
          /> */}

								{/* <!-- 心愿金浮标 -->
          <wish-icon
            a:if="{{!isStudent && !isPointsLottery && lotteryNum && !(lotteryNum === 3 && pointTaskStatus) && !(lotteryNum >= 5 && pointTaskStatus)}}"
            pointTaskStatus="{{pointTaskStatus}}"
            lotteryNum="{{lotteryNum}}"
          /> */}

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
				</div>
			)}
		</div>
	);
}

export default LotteryDetail;
