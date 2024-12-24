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
