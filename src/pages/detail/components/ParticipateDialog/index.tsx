function getEndDesc(campClause, abstractCampInfo) {
	if (!campClause || !campClause.openMode) {
		return null;
	}
	const openMode = campClause.openMode || '';
	if (openMode === 'TIME') {
		return `${abstractCampInfo.cGmtEnd} 自动开奖`;
	}
	if (openMode === 'PERSON') {
		return `满${campClause.budgetValue}人时自动开奖`;
	}
	if (openMode === 'MANUAL') {
		return `发起人手动开奖`;
	}
}

const ParticipateDialog = (props) => {
	const { campClause, abstractCampInfo, onTapClose = () => {} } = props;
  const onMyTapClose = () => {
    onTapClose();
  }
	return (
		<div>
			<div className='paricipate-mask'>
				<div className='paricipate-bg'>
					<img
						className='paricipate-close show-animation'
						src='https://gw.alipayobjects.com/mdn/TinyAppInnovation/afts/img/A*uMfFSKTb7a8AAAAAAAAAAAAAARQnAQ'
						onClick={onMyTapClose}
					/>
					<div className='paricipate-success'>参与成功</div>
					<div className='paricipate-lottery'>
						{getEndDesc(campClause, abstractCampInfo)}
					</div>
					{/* <img a:if="{{showParticipateSuccess === 1}}" mode="scaleToFill" src="{{adPrivateCampInfoVo && adPrivateCampInfoVo.campLogo}}" className="paricipate-configimg" onTap="goSelf" /> */}
					{/* <img a:if="{{showParticipateSuccess === 2}}" mode="scaleToFill" src="{{recommendPopCampInfo && recommendPopCampInfo.campLogo}}" className="paricipate-configimg" onTap="goSelf" /> */}
				</div>
			</div>
		</div>
	);
};

export default ParticipateDialog;
