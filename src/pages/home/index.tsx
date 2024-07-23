import { useEffect } from 'react';
import { useQuery } from '@/public/hooks';
import { trackEnterPage } from '@/public/track/index';
import { homePrizesList } from '@/public/service/home';
import { BUILTIN_CHANNELS } from './config';
import './index.less';

function Home() {
	const { source } = useQuery();

	useEffect(() => {
		trackEnterPage({ pageId: source });
		
		getList();
	}, []);

	const getList = () => {
		homePrizesList({
			page: 1,
			pageSize: 50,
			displayChannel: 'LOTTERY_LIST',
			displayColumn: 'NORMAL',
			regionId: BUILTIN_CHANNELS.official.id,
		}).then((data) => {
			console.log(data);
		});
	};

	return <div>首页</div>;
}

export default Home;
