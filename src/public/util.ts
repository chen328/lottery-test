import dayjs from 'dayjs';

export function genRandomStr(length = 16) {
	const chars = '0123456789abcdefghijklmnopqrstuvwxyz';
	let result = '';

	while (length--) result += chars[Math.floor(Math.random() * chars.length)];

	return result;
}

export function genSessionId() {
	return +new Date() + genRandomStr(16);
}

export function getPlatform() {
	if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
		return 'iOS';
	} else if (/(Android)/i.test(navigator.userAgent)) {
		return 'Android';
	} else {
		return 'other';
	}
}

export function isInAlipay() {
	const userAgent = navigator.userAgent.toLowerCase();

	// 检查是否包含支付宝的标识符
	return userAgent.includes('alipay') || userAgent.includes('aliapp'); // 返回true或false，表示是否在支付宝内部
}

export function showToast(config: any = { message: '', duration: 3000 }) {
	const { message = '', type, duration = 3000 } = config;
	const typeList = {
		fail: 'https://sl-online-oss.shulidata.com/resource/shequn/v1_0_26_encourage/icon-fail.svg?111',
		success:
			'https://sl-online-oss.shulidata.com/resource/shequn/v1_0_26_encourage/icon-success.svg',
	};

	if (!message) {
		return;
	}

	const toast = document.createElement('div');
	toast.setAttribute('id', 'toast-content');

	if (typeList[type]) {
		const toastImg = document.createElement('img');
		toastImg.setAttribute('src', typeList[type]);
		toast.append(toastImg);
	}

	toast.append(message);
	document.body.appendChild(toast);

	setTimeout(() => {
		toast?.remove();
	}, duration);
}

// 分转为元
export function formatMoney(money, unit = 2) {
	try {
		if (money) {
			let number: any = money * 0.01 + ''; //分到元
			// let reg = num.indexOf('.') >-1 ? /(\d{1,3})(?=(?:\d{3})+\.)/g : /(\d{1,3})(?=(?:\d{3})+$)/g;//千分符的正则
			// let number = num.replace(reg, '$1') || '0';
			if (number && number.indexOf('.') > -1) {
				let i = number.split('.')[0];
				let f = number.split('.')[1];
				number = Number(`${i}.${f.substring(0, unit)}`);
			}
			return number; //千分位格式化
		} else if (money === 0) {
			return 0;
		} else {
			return null;
		}
	} catch (e) {
		return (money / 100).toFixed(unit);
	}
}

export function redirectTo(url, androidTime = 300) {
	if (ap && ap.isAlipay) {
		const platform = getPlatform();
		ap.redirectTo(url);
		if (platform === 'Android') {
			setTimeout(() => {
				ap.popWindow();
			}, androidTime);
		} else {
			ap.popWindow();
		}
	} else if (url) {
		location.replace(url);
	}
}

export function getCoutdownFormat(totalSeconds) {
	// 计算小时数
	const hours = Math.floor(totalSeconds / 3600);
	totalSeconds %= 3600; // 更新剩余的秒数

	// 计算分钟数
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = Math.floor(totalSeconds % 60); // 最后剩余的秒数

	return {
		hours: hours < 10 ? `0${hours}` : hours,
		minutes: minutes < 10 ? `0${minutes}` : minutes,
		seconds: seconds < 10 ? `0${seconds}` : seconds,
	};
}

export function isFunction(fn) {
	return typeof fn === 'function';
}

export function isArray(o) {
	return Object.prototype.toString.call(o) === '[object Array]';
}

export async function execAsync(fn, time = 0) {
	if (!isFunction(fn)) {
		return;
	}

	setTimeout(() => {
		fn();
	}, time);
}

export function isString(o) {
	return typeof o === 'string';
}
export function trim(str, eliminateAllBlank) {
	if (!isString(str)) {
		return JSON.stringify(str);
	}

	str = (str || '').trim();
	if (eliminateAllBlank) {
		str = str.replace(/\s/g, '');
	}
	return str;
}

export function openWebInAlipay(url) {
	ap.pushWindow(url);
}

export function storageToday(_key, val?) {
	// 今天是否已经存储过
	const today = dayjs().format('yyyy-MM-dd');
	const key = `${_key}.${today}`;
	if (val === undefined) {
		return localStorage.getItem('key')
			? JSON.parse(localStorage.getItem('key')!)
			: undefined;
	}
	localStorage.setItem(key, JSON.stringify(val));
}

export function storage(key, val?) {
	if (val === undefined) {
		return localStorage.getItem('key')
			? JSON.parse(localStorage.getItem('key')!)
			: undefined;
	}

	localStorage.setItem(key, JSON.stringify(val));
}

export function delay(time = 0) {
	return new Promise((resolve) => {
		setTimeout(resolve, time);
	});
}