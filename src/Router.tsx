import { Suspense, useEffect, lazy, FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import { DotLoading } from 'antd-mobile';
import { trackSystemInfo, trackSource } from '@/public/track';
import cst from '@/public/constant';
import { useQuery } from '@/public/hooks';

const Home = lazy(() => import('@/pages/home'));
const Detail = lazy(() => import('@/pages/detail/index'));

// 测试环境获取authCode
const Auth = lazy(() => import('@/pages/auth'));

const Routers: FC = () => {
	const { pageId, source } = useQuery();
	cst.PAGE_SOURCE = source || pageId;

	useEffect(() => {
		cst.PAGE_SOURCE && trackSource({ source: cst.PAGE_SOURCE });
		trackSystemInfo();
	}, []);

	return (
		<Suspense
			fallback={
				<div style={{ minHeight: '100vh' }} className='flex flex-center'>
					<DotLoading style={{ fontSize: '18px' }} />
				</div>
			}
		>
			<Routes>
				<Route path={'/'} element={<Home />} />
				<Route path={'/detail'} element={<Detail />} />
				{cst.ENV === 'k8s' || cst.ENV === 'development' ? <Route path={'/auth'} element={<Auth />} /> : null}
			</Routes>
		</Suspense>
	);
};

export default Routers;
