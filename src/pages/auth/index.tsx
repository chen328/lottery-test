import { useEffect } from 'react';
import { Button } from 'antd-mobile';
import clipboard from 'copy-to-clipboard';
import cst from '@/public/constant';
import { showToast } from '@/public/util';

const Auth = () => {
	useEffect(() => {
		console.log('---ap', ap);
	}, []);

	const handleGetAuth = () => {
		ap.getAuthCode(
			{
				appId: cst.APP_ID,
				scopes: ['auth_base'],
			},
			function (res) {
				const { authCode } = res;
				console.log(res, 'getAuthCode');
				if (authCode) {
					clipboard(authCode);
					showToast({ message: '复制成功' });
				}
			},
		);
	};

	const handleGetUserAuth = () => {
		ap.getAuthCode(
			{
				appId: cst.APP_ID,
				scopes: ['auth_user'],
			},
			function (res) {
				const { authCode } = res;
				console.log(res, 'getAuthCode');

				if (authCode) {
					clipboard(authCode);
					showToast({ message: '复制成功' });
				}
			},
		);
	};

	const handleClick = (time1) => {
		clipboard('🆙💪🍪🍹风笛JyRoFyZ意念 59SAR');
		setTimeout(() => {
			ap.pushWindow(
				'alipays://platformapi/startapp?appId=20002133&jumpAction=direct-h5&schema=pinduoduo%3A%2F%2F',
			);
		}, 200);
		// redirectTo('alipays://platformapi/startapp?appId=68687451&url=%2Fwww%2Fbc-join.html%3Foid%3D2024030510325400074719%26businessId%3D2024030510325400074719%26businessType%3D18%26source%3DTINYAPP', time1)
	};

	return (
		<div style={{ textAlign: 'center', paddingTop: 40 }}>
			{cst.ENV === 'k8s' ? (
				<>
					<Button
						color='primary'
						size='middle'
						block={false}
						onClick={handleGetAuth}
					>
						获取静默授权authCode
					</Button>
					<div style={{ marginTop: '32px' }}></div>
					<Button
						color='primary'
						size='middle'
						block={false}
						onClick={handleGetUserAuth}
					>
						获取用户授权authCode
					</Button>
				</>
			) : null}
			<Button
				color='primary'
				size='middle'
				block={false}
				onClick={() => handleClick(100)}
			>
				测试跳转关闭
			</Button>
			<div style={{ marginTop: '32px' }}></div>
			<Button
				color='primary'
				size='middle'
				block={false}
				onClick={() => handleClick(300)}
			>
				测试跳转关闭1
			</Button>
			<div style={{ marginTop: '32px' }}></div>
			<Button
				color='primary'
				size='middle'
				block={false}
				onClick={() => handleClick(500)}
			>
				测试跳转关闭2
			</Button>
		</div>
	);
};

export default Auth;
