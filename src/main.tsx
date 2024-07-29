import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import Routers from './Router';
import { capture } from '@/public/excepture';
import './index.less';

window.addEventListener('error', capture);
window.addEventListener('unhandledrejection', capture);

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<BrowserRouter>
			<Routers />
		</BrowserRouter>
	</React.StrictMode>,
);
