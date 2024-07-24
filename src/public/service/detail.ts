import request from '../request';

export function itemDetail(param) {
  return request({
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      ...param,
    },
    method: 'POST',
    url: '/ipsponsorprod/lottery/camp/query',
  });
}