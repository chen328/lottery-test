import React, {  } from 'react';
// import { trackEnterPage } from '@/public/track/index';
import './index.less';

const DescItemTypeEnum = {
	text: 'TEXT',
	link: 'REDIRECT_LINK',
	img: 'PICTURE',
};

function CampRichText(props) {
	const { abstractCampInfo, campDescItemInfos } = props;
	const onLinkTap = (index) => {
		ap.pushWindow(campDescItemInfos[index].descItem.link);
	};
	const onTapImage = (index) => {
		ap.pushWindow(campDescItemInfos[index]?.descItemUrl);
	};

	return (
		<div>
			{abstractCampInfo.displayColumn === 'SUSPENSION' &&
				campDescItemInfos.length === 0 && (
					<img
						className='desc-box-image'
						src='https://gw.alipayobjects.com/mdn/TinyAppInnovation/afts/img/A*FvT8Q7qpNe8AAAAAAAAAAAAAARQnAQ'
					/>
				)}
			{campDescItemInfos && campDescItemInfos.length && (
				<div
					className='desc-box'
					// style={
					// 	abstractCampInfo.displayColumn === 'STUDENT_CHEAP'
					// 		? 'background-color: transparent; padding: 0;'
					// 		: ''
					// }
				>
					{campDescItemInfos.map((item, index) => {
						<>
							{item.descItemType === DescItemTypeEnum.link && (
								<div
									className='desc-item-link'
									onClick={() => onLinkTap(index)}
								>
									<div className='desc-link-title'>{item.descItem.title}</div>
									<div className='desc-item-link-action'>
										{item.descItem.action}
									</div>
									<div className='blue-line-arrow'></div>
								</div>
							)}
							{item.descItemType === DescItemTypeEnum.text && (
								<span className='desc-text'>{item.descItem}</span>
							)}
							{item.descItemType === DescItemTypeEnum.img && (
								<div className='desc-image-div' data-index='{{index}}'>
									<img
										onClick={() => onTapImage(index)}
										className='desc-image'
										src={item.descItem}
									/>
								</div>
							)}
						</>;
					})}

					<div className='desc-gap'></div>
				</div>
			)}
		</div>
	);
}

export default CampRichText;
