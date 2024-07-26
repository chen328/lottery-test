import axios from 'axios';
import md5 from 'md5';
import dayjs from 'dayjs';
import dayjsUTCPlugin from 'dayjs/plugin/utc';
import cst from '../constant';

dayjs.extend(dayjsUTCPlugin);

let q: any[] = [];
let interval: any = null;

export default function track({ extParams, ...data }: any) {
	const datetime = +new Date();
	const bid = data.bid || data.eventId;
	const appId = cst.APP_ID
	const trackData = {
		appId,
		appKey: cst.TRACK_APP_KEY,
		version: '1.0.1',
		type: 'app',
		level: 3,
		datetime,
		sessionId: cst.SESSION_ID,
		projectVersion: cst.PROJECT_VERSION,
		// eslint-disable-next-line no-restricted-globals
		url: location.pathname,
		cid: md5(
			cst.TRACK_APP_KEY +
				bid +
				cst.SESSION_ID +
				datetime +
				dayjs(datetime).utcOffset(480).format('YYYY-MM-DD HH:mm:ss'),
		),
		extParams: {
			source: cst.PAGE_SOURCE,
			...extParams,
		},
		...data,
	};

	clearTimeout(interval);
	interval = setTimeout(() => {
		const headers = {
			'Content-Type': 'application/json;charset=utf-8',
		};

		if (cst.ENV !== 'production') headers['x-referer-url'] = location.host;

		if (cst.TRACK_URL && cst.ENV !== 'development') {
			axios({
				url: cst.TRACK_URL,
				method: 'post',
				headers,
				data: {
					trackEventList: q,
				},
			});
		} else {
			console.log(
				'%c上报数据',
				'color:#fff;font-weight:bold;background:#bbb;padding:2px;',
				q,
			);
		}
		q = [];
	}, 200);
	q.push(trackData);
}
