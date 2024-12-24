export default {
	plugins: {
		tailwindcss: {},
		autoprefixer: {},
		'postcss-px-to-viewport': {
			viewportWidth: 750, // 视口宽度，对应的是我们设计稿的宽度
			viewportUnit: 'vw', // 指定需要转换成的视口单位，建议使用 vw
			unitPrecision: 5, // 指定 `px` 转换为视口单位值的小数位数
			propList: ['*'], // 能转化为 vw 的属性列表
			selectorBlackList: [], // 指定不转换为视口单位的类
			minPixelValue: 1, // 小于或等于 `1px` 不转换为视口单位
			mediaQuery: false, // 允许在媒体查询中转换 `px`
		},
	},
};
