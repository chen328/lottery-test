import { useEffect, useState } from 'react';
import { Swiper, Image } from 'antd-mobile';
import { enterPage } from '@/public/track/home';
import { useQuery } from '@/public/hooks';
import { homePrizesList, queryRecentLuckDogs as queryRecentLuckDogsApi } from '@/public/service/home';
import Loading from '@/components/Loading';
import { BUILTIN_CHANNELS } from './config';
import PrizeItem from './components/PrizeItem';
import './index.less';

function Home() {
	const { source } = useQuery();
	const [luckDogs, setLuckDogs] = useState<any[]>([{}]);
	const [campInfoVoList, setCampInfoVoList] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);

	const getList = (page = 1) => {
		setLoading(true);
		homePrizesList({
			page,
			pageSize: 50,
			displayChannel: 'LOTTERY_LIST',
			displayColumn: 'NORMAL',
			regionId: BUILTIN_CHANNELS.official.id,
			displaySubChannel: 'H5',
		}).then((res) => {
			setCampInfoVoList(res.campInfoVoList || []);
			enterPage();
		}).finally(() => {
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
		console.log('----useEffect')
		getList();
		queryRecentLuckDogs();
		ap.onResume(() => {
			console.log('----onResume')
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
							<Swiper autoplay direction='vertical' indicator={() => null} loop style={{ '--height': '62px' }}>
								{luckDogs.map((item, index) => (
									<Swiper.Item key={index}>
										<div className='text-ellipsis '>
											恭喜{item.userName || '匿名'}中奖
											{item.lotteryPrizeInfoVoList?.map((prizeItem: any, index) => (
												<div key={index}>{index > 0 ? '，' + prizeItem.subject : prizeItem.subject}</div>
											))}
										</div>
									</Swiper.Item>
								))}
							</Swiper>
						</div>
					) : null}

					<div className='home__prize-list'>
						{campInfoVoList.length > 0 ? (
							<>
								{campInfoVoList.map(item => (
									<PrizeItem key={item.campId} item={item} itemList={campInfoVoList} />
								))}
							</>
						) : (
							<Image className='home__empty-img' src='https://sl-online-oss.shulidata.com/resource/lottery_everyday/v2_71_0/empty.png' />
						)}
					</div>
				</>
			)}
		</div>
	);
}

export default Home;
