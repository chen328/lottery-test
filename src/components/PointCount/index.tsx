import { useState } from 'react';
import './index.less';

function getCount(num) {
	return `${num}`.split('');
}

const PointCount = (props) => {
	const [num] = useState([9, 8, 7, 6, 5, 4, 3, 2, 1, 0]);
	const { count } = props;
	return (
		<div className='point-count'>
			{getCount(count).map((itemName, index) => {
				return (
					<div key={index}>
						<div className='point-count-item'>
							<div
								style={{ bottom: `-${+itemName * 100}%` }}
								className='point-count-roller'
							>
								{num.map((j) => (
									<span key={j}>{j}</span>
								))}
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default PointCount;
