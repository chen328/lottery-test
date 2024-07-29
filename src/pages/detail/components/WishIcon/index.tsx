import {
	// trackGoWishGoldExposure,
	trackGoWishGoldClick,
} from '@/public/track/awardDetail';
import classNames from 'classnames';

import './index.less';

const WishIcon = (props) => {
	const { lotteryNum, pointTaskStatus } = props;
	const goWish = () => {
		trackGoWishGoldClick({ component: '心愿金悬浮标' });
		ap.pushWindow(
			'alipays://platformapi/startapp?appId=2018103161898599&page=pages%2FpointsIndex%2FpointsIndex',
		);
	};
	return (
		<div className='detail-wishicon' onClick={goWish}>
			<img
				className='detail-wishicon-icon'
				src='https://mdn.alipayobjects.com/portal_s6jpcc/afts/img/A*9R7eS5bix7sAAAAAAAAAAAAAAQAAAQ/original'
			/>
			<div className='detail-wishicon-bg'>
        {
          lotteryNum !== 3 && lotteryNum < 5 && <div
					className={classNames('detail-wishicon-bg-progress',{'detail-wishicon-bg-progress--more': lotteryNum > 3})}
				>
					{/* <!-- 1/2次样式 --> */}

					{lotteryNum <= 3 &&
						[1, 2, 3].map((item) => {
							return (
								<div
									className={classNames('detail-wishicon-bg-progress-small', {
										'detail-wishicon-bg-progress--active': lotteryNum >= item,
									})}
									key={item}
								></div>
							);
						})}
					{lotteryNum > 3 &&
						[4, 5].map((item) => {
							return (
								<div
									className={classNames('detail-wishicon-bg-progress-big', {
										'detail-wishicon-bg-progress--active': lotteryNum >= item,
									})}
									key={item}
								></div>
							);
						})}
				</div>
        }
				
				<div
					className={classNames('detail-wishicon-bg-count', {
						'detail-wishicon-bg-count--mg': lotteryNum === 3 || lotteryNum >= 5,
					})}
				>
					{lotteryNum === 3 || lotteryNum >= 5
						? '任务已完成'
						: lotteryNum < 3
							? '完成3次抽奖'
							: '再完成1次抽奖'}
				</div>
				<div className='detail-wishicon-bg-wish'>
					{lotteryNum === 3 || lotteryNum >= 5
						? '点击领取'
						: lotteryNum <= 3
							? '心愿金+30'
							: '心愿金+50'}
				</div>
			</div>
			{lotteryNum === 3 && !pointTaskStatus && (
				<img
					className='detail-wishicon-reward'
					src='https://mdn.alipayobjects.com/huamei_zjbdv1/afts/img/A*pDXFSI1U6Q0AAAAAAAAAAAAADg6FAQ/original'
				/>
			)}
			{lotteryNum >= 5 && !pointTaskStatus && (
				<img
					className='detail-wishicon-reward'
					src='https://mdn.alipayobjects.com/huamei_zjbdv1/afts/img/A*MWDFSL9vXZgAAAAAAAAAAAAADg6FAQ/original'
				/>
			)}
		</div>
	);
};

export default WishIcon;
