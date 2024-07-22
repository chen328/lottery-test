import { genSessionId } from '@/public/util';

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
	PAGE_SOURCE: '',
	USER: {
		userId: '',
		uid: '',
		token: '',
		authCode: '',
	},
};

export default cst;
