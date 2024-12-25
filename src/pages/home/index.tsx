import { useEffect, useState } from 'react';
import { Swiper, Image } from 'antd-mobile';
import { enterPage } from '@/public/track/home';
import { useQuery } from '@/public/hooks';
import {
	homePrizesList,
	queryRecentLuckDogs as queryRecentLuckDogsApi,
} from '@/public/service/home';
import Loading from '@/components/Loading';
import { openWebInAlipay } from '@/public/util';
import { BUILTIN_CHANNELS } from './config';
import PrizeItem from './components/PrizeItem';
import './index.less';

function Home() {
	const { source, jumpType } = useQuery();
	const [luckDogs, setLuckDogs] = useState<any[]>([{}]);
	const [campInfoVoList, setCampInfoVoList] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);
	const getList = (page = 1, isFirst = false) => {
		setLoading(true);
		homePrizesList({
			page,
			pageSize: 50,
			displayChannel: 'LOTTERY_LIST',
			displayColumn: 'NORMAL',
			regionId: BUILTIN_CHANNELS.official.id,
			displaySubChannel: 'H5',
			source,
		})
			.then((res) => {
				setCampInfoVoList(res.campInfoVoList || []);

				if (
					jumpType === 'twoJump' &&
					res?.campInfoVoList.length > 0 &&
					isFirst
				) {
					const itemList = res?.campInfoVoList || [];
					const item = res?.campInfoVoList[0] || {};
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
				}
				enterPage();
			})
			.finally(() => {
				setLoading(false);
			});
	};

	const queryRecentLuckDogs = async () => {
		const res = await queryRecentLuckDogsApi({
			page: 1,
			pageSize: 20,
		});
		setLuckDogs(res.luckDogs || []);
	};

	useEffect(() => {
		console.log('新部署');
		getList(1, true);
		queryRecentLuckDogs();
		ap.onResume(() => {
			getList();
			queryRecentLuckDogs();
		});

		return () => {
			ap.offResume();
		};
	}, []);

	return (
		<div className='home'>
			{loading ? (
				<Loading text='加载中' style={{ fontSize: '12px' }} />
			) : (
				<>
					{/* 中奖轮播放 */}
					{luckDogs?.length > 0 ? (
						<div className='home__carousel text-ellipsis'>
							<Swiper
								autoplay
								direction='vertical'
								indicator={() => null}
								loop
								style={{ '--height': '62px' }}
							>
								{luckDogs.map((item, index) => (
									<Swiper.Item key={index}>
										<div className='text-ellipsis '>
											恭喜{item.userName || '匿名'}中奖
											{item.lotteryPrizeInfoVoList?.map(
												(prizeItem: any, index) => (
													<span key={index}>
														{index > 0
															? '，' + prizeItem.subject
															: prizeItem.subject}
													</span>
												),
											)}
										</div>
									</Swiper.Item>
								))}
							</Swiper>
						</div>
					) : null}

					<div className='home__prize-list'>
						{campInfoVoList.length > 0 ? (
							<>
								{campInfoVoList.map((item) => (
									<PrizeItem
										key={item.campId}
										item={item}
										itemList={campInfoVoList}
									/>
								))}
								<Image
									className='home-none-more'
									src='https://laiy-online-oss-client.laiytech.com/resource/lottery_everyday/v2_71_0/home-none-more.png'
								/>
							</>
						) : (
							<Image
								className='home__empty-img'
								src='https://sl-online-oss.shulidata.com/resource/lottery_everyday/v2_71_0/empty.png'
							/>
						)}
					</div>
				</>
			)}
		</div>
	);
}

export default Home;
