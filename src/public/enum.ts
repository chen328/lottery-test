export const LOTTERY_STATE = {
	INIT: 'INIT', // 编辑中: 待提审/审核拒绝
	AUDITING: 'AUDITING', // 已提审: 待审核
	WAIT_GOING: 'WAIT_GOING', // 审核通过: 待开始
	GOING: 'GOING', // 进行中: 待开奖
	WAIT_OPEN: 'WAIT_OPEN', // 开奖中，备注: 后端开奖需要一定时间
	ENDED: 'ENDED', // 已经开奖
	EXPIRED: 'EXPIRED', // 已过期: 未上架
	INVALID: 'INVALID', // 下架
	REJECT: 'REJECT', // 审核未通过
};