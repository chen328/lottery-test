interface ImportMetaEnv extends Readonly<Record<string, string>> {
  readonly VITE_API: string;
  readonly VITE_TRACK_API: string;
  readonly VITE_CALLBACK_URL: string;
  readonly VITE_APP_ID: string;
  readonly VITE_SOURCE: string;
  readonly VITE_SHARE_URL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
