import { useEffect } from 'react';
import { useQuery } from '@/public/hooks';
import { trackEnterPage } from '@/public/track/index';
import './index.less';

function Home() {
	const { source } = useQuery();

	useEffect(() => {
		// 直接跳转到支付宝小程序 从小程序返回之后 页面不会重新加载 使用onAppResume方法监听是否页面返回
		// 页面重新打开触发的事件
		ap.onAppResume(() => {
			
		});

	
		trackEnterPage({ pageId: source });

		// 页面销毁时 取消监听 避免多次触发onAppResume事件
		return () => {
			ap.offAppResume();
		};
	}, []);

	return (
		<div>首页</div>
	);
}

export default Home;
