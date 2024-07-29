declare module '*.png';
declare module '*.gif';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.styl';
// @ts-ignore
// eslint-disable-next-line no-unused-vars
declare const process: {
	env: {
		NODE_ENV: string;
		[key: string]: any;
	};
};

declare const __API__: string;

declare const __TRACK_URL__: string;

declare const __APP_URL__: string;

declare const __RULE_API__: string;

declare const __BUILD_VERSION__: string;

declare const __ENV__: 'development' | 'test' | 'k8s' | 'production';

interface IAp {
	alipayVersion: string;
	alert: () => void;
	alipayVersion: string;
	allowBack: () => void;
	allowPullDownRefresh: (allow: boolean) => void;
	call: () => void;
	cancelRecord: () => void;
	chooseAlipayContact: () => void;
	chooseCity: () => void;
	chooseImage: () => void;
	choosePhoneContact: () => void;
	chooseVideo: () => void;
	closeBluetoothAdapter: () => void;
	closeSocket: () => void;
	compareVersion: (e: string) => void;
	compressImage: () => void;
	confirm: () => void;
	connectBLEDevice: () => void;
	connectSocket: () => void;
	datePicker: () => void;
	disconnectBLEDevice: () => void;
	downloadFile: () => void;
	enableDebug: () => void;
	extendJSAPI: (o: any, r: any) => void;
	getAuthCode: (any, any) => void;
	getAuthUserInfo: () => void;
	getBLEDeviceCharacteristics: () => void;
	getBLEDeviceServices: () => void;
	getBackgroundAudioPlayerState: () => void;
	getBluetoothAdapterState: () => void;
	getBluetoothDevices: () => void;
	getConnectedBluetoothDevices: () => void;
	getLaunchParams: () => void;
	getLocation: () => void;
	getNetworkType: () => void;
	getServerTime: () => void;
	getSessionData: () => void;
	getSystemInfo: () => void;
	hideBackButton: () => void;
	hideLoading: () => void;
	hideNavigationBarLoading: () => void;
	hideOptionButton: () => void;
	hideToast: () => void;
	isAlipay: boolean;
	makePhoneCall: () => void;
	notifyBLECharacteristicValueChange: () => void;
	off: (e: string, t: Function) => void;
	offAccelerometerChange: () => void;
	offAppPause: () => void;
	offAppResume: () => void;
	offBLECharacteristicValueChange: () => void;
	offBLEConnectionStateChanged: () => void;
	offBack: () => void;
	offBackgroundAudioPause: () => void;
	offBackgroundAudioPlay: () => void;
	offBackgroundAudioStop: () => void;
	offBluetoothAdapterStateChange: () => void;
	offBluetoothDeviceFound: () => void;
	offCompassChange: () => void;
	offNetworkChange: () => void;
	offPagePause: () => void;
	offPageResume: () => void;
	offPause: () => void;
	offPullDownRefresh: (callback: () => void) => void;
	offResume: () => void;
	offShare: () => void;
	offSocketClose: () => void;
	offSocketError: () => void;
	offSocketMessage: () => void;
	offSocketOpen: () => void;
	offTabClick: () => void;
	offTitleClick: () => void;
	on: (e: string, t: Function) => void;
	onAccelerometerChange: () => void;
	onAppPause: (any) => void;
	onAppResume: (any) => void;
	onBLECharacteristicValueChange: () => void;
	onBLEConnectionStateChanged: () => void;
	onBack: () => void;
	onBackgroundAudioPause: () => void;
	onBackgroundAudioPlay: () => void;
	onBackgroundAudioStop: () => void;
	onBluetoothAdapterStateChange: () => void;
	onBluetoothDeviceFound: () => void;
	onCompassChange: () => void;
	onNetworkChange: () => void;
	onPagePause: () => void;
	onPageResume: (callback: () => void) => void;
	onPause: () => void;
	onPullDownRefresh: (callback: () => void) => void;
	onResume: (callback: () => void) => void;
	onShare: () => void;
	onSocketClose: () => void;
	onSocketError: () => void;
	onSocketMessage: () => void;
	onSocketOpen: () => void;
	onTabClick: () => void;
	onTitleClick: () => void;
	openBluetoothAdapter: () => void;
	openInBrowser: () => void;
	openLocation: () => void;
	parseQueryString: (e: string) => any;
	pauseBackgroundAudio: () => void;
	pauseVoice: () => void;
	playBackgroundAudio: () => void;
	playVoice: () => void;
	popTo: () => void;
	popWindow: () => void;
	previewImage: () => void;
	pushBizWindow: () => void;
	pushWindow: (url: string, data?: any) => void;
	readBLECharacteristicValue: () => void;
	ready: (t: any) => void;
	redirectTo: (string) => void;
	resumeVoice: () => void;
	saveImage: () => void;
	scan: () => void;
	seekBackgroundAudio: () => void;
	sendSocketMessage: () => void;
	setNavigationBar: () => void;
	setOptionButton: () => void;
	setSessionData: () => void;
	setTabBarBadge: () => void;
	share: (any) => void;
	showActionSheet: () => void;
	showBackButton: () => void;
	showLoading: () => void;
	showNavigationBarLoading: () => void;
	showOptionButton: () => void;
	showPopMenu: () => void;
	showTabBar: () => void;
	showToast: (any) => void;
	startBizService: () => void;
	startBluetoothDevicesDiscovery: () => void;
	startRecord: () => void;
	stopBackgroundAudio: () => void;
	stopBluetoothDevicesDiscovery: () => void;
	stopRecord: () => void;
	stopVoice: () => void;
	tradePay: () => void;
	trigger: (e: string, t: any) => void;
	ua: string;
	uploadFile: () => void;
	version: string;
	vibrate: () => void;
	watchShake: () => void;
	writeBLECharacteristicValue: () => void;
	[key: string]: any;
}

declare const ap: IAp;

declare const Ali: any;

declare const AlipayJSBridge: any;

interface Window {
	AlipayJSBridge?: any;
}
