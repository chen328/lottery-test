import { useMemo } from 'react';
import qs from 'qs';
import { useLocation } from 'react-router-dom';

// 自定义 Hook 来获取查询参数
export function useQuery() {
	// 使用 react-router-dom 的 useLocation Hook 获取当前 location 对象
	const { search } = useLocation();
	const params =
		qs.parse(search || location.search, { ignoreQueryPrefix: true }) || {};

	// 使用 URLSearchParams API 解析查询参数
	return useMemo(() => params, [search]);
}
