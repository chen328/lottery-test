import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';
import { createHtmlPlugin } from 'vite-plugin-html';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const ENV = process.env.ENV;

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		createHtmlPlugin({
			minify: true,
			entry: '/src/main.tsx',
			template: './index.html',
			inject: {
				data: {
					env: ENV,
				},
			},
		}),
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	define: {
		__ENV__: `"${ENV}"`,
		__BUILD_VERSION__: JSON.stringify(
			dayjs().tz('Asia/Shanghai').format('YYYY.MM.DD.HH'),
		),
	},
	build: {
		target: 'es2015',
		rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom', 'dayjs', 'md5', 'qs', 'axios', '@aliyun-sls/web-track-browser'],
        },
      },
    },
	},
	server: {},
});
