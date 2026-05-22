export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.svg"]),
	mimeTypes: {".svg":"image/svg+xml"},
	_: {
		client: {start:"_app/immutable/entry/start.DYO2oJFU.js",app:"_app/immutable/entry/app.DMPVTDc_.js",imports:["_app/immutable/entry/start.DYO2oJFU.js","_app/immutable/chunks/C4NID36F.js","_app/immutable/chunks/DtqChs81.js","_app/immutable/chunks/CIVlgTU4.js","_app/immutable/chunks/6--zyWZu.js","_app/immutable/chunks/CnxRxMMX.js","_app/immutable/chunks/CGZcaLJv.js","_app/immutable/entry/app.DMPVTDc_.js","_app/immutable/chunks/DtqChs81.js","_app/immutable/chunks/CIVlgTU4.js","_app/immutable/chunks/6--zyWZu.js","_app/immutable/chunks/CnxRxMMX.js","_app/immutable/chunks/CGZcaLJv.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/lpa/[step=step]",
				pattern: /^\/lpa\/([^/]+?)\/?$/,
				params: [{"name":"step","matcher":"step","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			const { match: step } = await import ('./entries/matchers/step.js')
			return { step };
		},
		server_assets: {}
	}
}
})();
