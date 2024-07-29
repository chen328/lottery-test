import { SpinLoading, DotLoading } from 'antd-mobile';
import React, { FC } from 'react';

interface ILoading {
  style?: React.CSSProperties;
  size?: number;
  text?: string;
  color?: string;
  type?: 'spin' | 'dot'
}

const Loading: FC<ILoading> = ({ type = 'spin', size = 24, text = '加载中', style = {}, color = '#999' }) => {
  return <div className='flex flex-center fz-14 flex-col' style={{
    minHeight: '100vh',
    color,
    ...style
  }}>
    {type === 'spin' && <SpinLoading style={{ '--size': `${size}px`, '--color': color }} />}
    {type === 'dot' && <DotLoading style={{ fontSize: `${size}px`, color }} />}
    <span className='d-block mt-16'>{text}</span>
  </div>
}

export default Loading;