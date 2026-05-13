export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([]),
	mimeTypes: {},
	_: {
		client: {start:"_app/immutable/entry/start.BjTbEP90.js",app:"_app/immutable/entry/app.Bq-U2FQW.js",imports:["_app/immutable/entry/start.BjTbEP90.js","_app/immutable/chunks/X0YDIaye.js","_app/immutable/chunks/PcKaDNv1.js","_app/immutable/chunks/CpYbBoL-.js","_app/immutable/entry/app.Bq-U2FQW.js","_app/immutable/chunks/PcKaDNv1.js","_app/immutable/chunks/Bx9so9_J.js","_app/immutable/chunks/CWchDWmJ.js","_app/immutable/chunks/CpYbBoL-.js","_app/immutable/chunks/76sQyjqf.js","_app/immutable/chunks/mSMOk6yu.js","_app/immutable/chunks/CSL2MpmL.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js'))
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
				id: "/api/dashboard/scorecards",
				pattern: /^\/api\/dashboard\/scorecards\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/dashboard/scorecards/_server.ts.js'))
			},
			{
				id: "/api/scorecards/[id]",
				pattern: /^\/api\/scorecards\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/scorecards/_id_/_server.ts.js'))
			},
			{
				id: "/api/stats",
				pattern: /^\/api\/stats\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/stats/_server.ts.js'))
			},
			{
				id: "/import",
				pattern: /^\/import\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/report/[id]",
				pattern: /^\/report\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
