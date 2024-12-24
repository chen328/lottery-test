import { useCountDown } from 'ahooks';
import { useEffect } from 'react';
import { openWebInAlipay, processImageUrl } from '@/public/util';
import { lotteryClick, lotteryExposure } from '@/public/track/home';
import './PrizeItem.less';

interface IProps {
	item: { [key: string]: any };
	itemList: { [key: string]: any }[];
}

const PrizeItem: React.FC<IProps> = (props) => {
	const { item = {}, itemList = [] } = props;
	const { serviceFavoriteVo, gmtEnd } = item;

	const [, formattedRes] = useCountDown({
		targetDate: gmtEnd,
	});
	const { days = 0, hours, minutes, seconds } = formattedRes;
	const showHours = days * 24 + hours;

	const onCardClick = () => {
		lotteryClick(item, '抽奖列表');
		const campList: string[] = [];
		const index = itemList.findIndex((i) => i.campId === item.campId);
		const newList = [...itemList];
		newList
			.filter((e, i) => i > index)
			.forEach((item) => {
				if (item.campId) {
					campList.push(item.campId);
				}
			});
		const url = `${location.origin}/detail?itemId=${item.campId}&type=GOING&campList=${campList}`;
		openWebInAlipay(url);
	};

	const getTotalPrize = (item: { [key: string]: any }) =>
		(item.prizeInfoVoList || []).reduce((total, currentValue) => {
			return total + +currentValue.price;
		}, 0);

	const lotteryTitles = (item: { [key: string]: any }) =>
		(item.prizeInfoVoList || [])
			.map((value, index) => {
				// 万人抽奖不需要后缀
				const suffix = ` x${value.totalQuantity}`;
				if (index === item.prizeInfoVoList.length - 1) {
					return `${value.subject}${suffix}`;
				} else {
					return `${value.subject}${suffix}；`;
				}
			})
			.join('');

	useEffect(() => {
		lotteryExposure(item, '抽奖列表');
	}, []);

	return (
		<div className='prize-item' onClick={onCardClick}>
			<div className='prize-item__header'>
				<div className='prize-item__dad'>
					{serviceFavoriteVo?.serviceInfoVo?.serviceName ? (
						<>
							奖品由
							<span className='prize-item__dad-name'>
								【
								<img
									className='prize-item__dad-avatar'
									src={processImageUrl(
										serviceFavoriteVo?.serviceInfoVo?.serviceIcon,
										'56x56xz',
									)}
								/>
								{serviceFavoriteVo?.serviceInfoVo?.serviceName}】
							</span>
							提供
						</>
					) : null}
				</div>
				<div className='prize-item__countdown'>
					<span className='prize-item__countdown-num'>
						{showHours > 9 ? showHours : `0${showHours}`}
					</span>
					:
					<span className='prize-item__countdown-num'>
						{minutes > 9 ? minutes : `0${minutes}`}
					</span>
					:
					<span className='prize-item__countdown-num'>
						{seconds > 9 ? seconds : `0${seconds}`}
					</span>
					后开奖
				</div>
			</div>

			<div className='prize-item__divider' />

			<div className='prize-item__main'>
				<img className='prize-item__main-left' src={item.campLogo} alt='' />
				<div className='prize-item__main-right'>
					<div className='text-ellipsis prize-item__main-title'>
						{lotteryTitles(item)}
					</div>
					{item.cornerMarker ? (
						<div className='prize-item__main-tag'>{item.cornerMarker}</div>
					) : null}
					<div className='text-ellipsis prize-item__main-prise'>
						<div className='prize-item__main-price'>
							奖品价值¥
							{item.priceDesc || getTotalPrize(item)}
						</div>
					</div>
					{item.myLotteryNum && +item.myLotteryNum > 0 ? (
						<img
							className='prize-item__main-btn'
							src={
								'https://sl-online-oss.shulidata.com/resource/lottery_everyday/v2_71_0/lotteryed_btn.png'
							}
							alt=''
						/>
					) : (
						<img
							className='prize-item__main-btn'
							src={
								'https://sl-online-oss.shulidata.com/resource/lottery_everyday/v2_71_0/lottery_btn.png'
							}
							alt=''
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default PrizeItem;
