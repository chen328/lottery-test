import { genSessionId } from '@/public/util';

export const BUILTIN_CHANNELS = {
	// 天天抽奖官方渠道
	official: {
		key: 'OFFICIAL',

		id: 'R2101123100000001',
		// id: 'R002019112700256341', // 测试环境  非管理员创建活动id
		name: '天天抽奖',
		// id: 'R002019032500035030', //dev

		// 测试专区
		// id: 'R002019032600000001', // pre
		// name: '测试专区',
		partnerId: '2088231489693432',
	},
	// 手动指定
	manual: {
		key: 'OTHERS',
		id: '',
		name: '其他',
	},
	// 隐藏
	hidden: {
		key: 'HIDDEN',
		id: '-1', // 具体值
		name: '不投放到任何渠道',
	},
};

export const NON_EXIST_REGION_ID = 'R0000000000000001';
export const TTCJ_LIFE_STYLE_PUBLIC_ID = '2018101661689525';
export const ERRCODETEXT = {
	1002: '人气大爆发请稍后再试',
	1003: '这个活动已经结束',
	1004: '抽奖已经开始，不能编辑',
	1005: '抽奖状态出错了',
	1006: '抽奖人数或积分超过设定值',
	1007: '你已参与抽奖',
	1008: '找不到抽奖数据',
	1009: '口令不正确',
	1011: '请先完成实名认证再来抽奖',
	1012: '登录失败了',
	2043: '这个活动已经结束',
	2044: '抽奖已经开始，不能编辑',
	2045: '抽奖状态出错了',
	2065: '抽奖人数或积分超过设定值',
	2062: '你已参与抽奖',
	2047: '找不到抽奖数据',
	2048: '口令不正确',
	1014: '登录失败了',
	200004: '奖励已发完',
	200006: '人气大爆发，请稍后再试',
	200007: '报名次数达上限',
	200008: '会员积分不足',
	200009: '会员积分服务未开通',
	200017: '人气大爆发，请稍后再试',
};

const cst = {
	URL: import.meta.env.VITE_API,
	TRACK_URL: import.meta.env.VITE_TRACK_API,
	ALIPAY_CALLBACK_URL: import.meta.env.VITE_CALLBACK_URL,
	APP_ID: import.meta.env.VITE_APP_ID,
	SOURCE: import.meta.env.VITE_SOURCE,
	SHARE_URL: import.meta.env.VITE_SHARE_URL,
	ENV: __ENV__,
	PROJECT_VERSION: __BUILD_VERSION__,
	SESSION_ID: genSessionId(),
	APP_KEY: 'h5_lottery',
	TRACK_APP_KEY: 'lottery_everyday', // 埋点需要跟以前一样
	PAGE_SOURCE: '',
	USER: {
		userId: '',
		uid: '',
		token: '',
		authCode: '',
	},
	clientVersion: '1.2.0',
};

export default cst;
