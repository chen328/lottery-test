import request from '../request';
import { IhomeData } from '../typings/home';

/**
 * @name C端/聚合页页面任务列表 
 * @api http://sapi.shuli.com/project/187/interface/api/33276
 */
export function getList(pageId) {
	return request<IhomeData>({
		url: '/benefit/group/page/task/list',
		method: 'post',
		data: { pageId },
		headers: {
			'content-type': 'application/json',
		},
	}).then((resp) => {
		return resp && resp.data;
	});
}
