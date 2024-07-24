import axios, { AxiosRequestConfig } from 'axios';
import { capture } from './excepture';
import { genRandomStr, showToast } from './util';
import cst from './constant';
import { getAuth } from './auth';
import { trackUserInfo } from './track';

const axiosInstance = axios.create();

let Token;

export const getToken = () => {
	return Token;
};

type RequestItem = {
	trigger(): void;
	req: Promise<any>;
};

const requestQueue: RequestItem[] = [];
const triggerRequestQueue = () => {
	while (requestQueue.length) {
		requestQueue.shift()!.trigger();
	}
};

axiosInstance.interceptors.response.use(
	function (response) {
		if (response && response.data && !response.data.success) {
			const { config = {} as any } = response || {};
			capture(
				{
					response: JSON.stringify(response.data),
					request: JSON.stringify({ url: config.url, data: config.data }),
					msg: response.data.msg,
				},
				'request',
			);

			if (!response.config['disabledErrorToast']) {
				showToast({
					message: response.data.msg,
				});
			}

			return Promise.reject(response.data);
		}
		return {
			...response.data,
			...response.data.data,
		};
	},
	function (error) {
		showToast({
			message: '网络状态不佳\n请稍后重试',
		});
		return Promise.reject(error);
	},
);

export function requestWithToken(cfg) {
	const { headers, ...config } =
		typeof cfg === 'function' ? cfg(cst.USER) : cfg;
	let data;
	const hs = {
		'content-type': 'application/x-www-form-urlencoded',
		'X-B3-TraceId': genRandomStr(32),
		token: Token,
		sessionId: Token,
		...headers,
	};

	if (cst.ENV !== 'production') {
		hs['x-referer-url'] =
			cst.ENV === 'development' ? 'base.test' : location.host;
	}

	if (config.data) {
		if (config.method.toLocaleLowerCase() === 'get') {
			config.params = config.data;
		}
		if (hs['content-type'] === 'application/x-www-form-urlencoded') {
			data = new FormData();
			Object.entries(config.data).forEach(([key, value]: any) => {
				if (value !== undefined) {
					data.append(key, value instanceof File ? value : value.toString());
				}
			});
		} else {
			data = config.data;
		}

		delete config.data;
	}

	return axiosInstance({
		baseURL: cst.URL,
		method: 'post',
		headers: hs,
		data,
		...config,
	});
}

export function pureRequest(config) {
	const { headers = {} } = config;
	if (cst.ENV !== 'production') {
		headers['x-referer-url'] =
			cst.ENV === 'development' ? 'base.dev' : location.host;
	}

	delete config.headers;

	return axiosInstance({
		baseURL: cst.URL,
		method: 'post',
		headers: {
			'content-type': 'application/x-www-form-urlencoded',
			...headers,
		},
		...config,
	});
}

export default function request<T = any>(
	config: AxiosRequestConfig & { disabledErrorToast?: boolean },
): Promise<{
	code: number;
	msg: string;
	data: T;
	success: boolean;
	[key: string]: any;
}> {
	const requestItem: RequestItem = {
		trigger() {},
		req: Promise.resolve(),
	};

	requestItem.req = new Promise(
		(resolve) =>
			(requestItem.trigger = () => resolve(requestWithToken(config))),
	);
	requestQueue.push(requestItem);

	if (Token) {
		// 直接触发请求
		triggerRequestQueue();
	} else if (requestQueue.length === 1) {
		getAuth().then((res: any) => {
			Token = res.sessionId;
			trackUserInfo();
			triggerRequestQueue();
		});
	}

	return requestItem.req;
}
