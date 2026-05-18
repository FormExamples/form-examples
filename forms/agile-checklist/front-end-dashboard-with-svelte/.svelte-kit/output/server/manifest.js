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
		client: {start:"_app/immutable/entry/start.DCY2_E3P.js",app:"_app/immutable/entry/app.BYBuD-Ah.js",imports:["_app/immutable/entry/start.DCY2_E3P.js","_app/immutable/chunks/IIXF5c7U.js","_app/immutable/chunks/D7O97qf1.js","_app/immutable/chunks/CYaxtGL2.js","_app/immutable/chunks/DGlywEG5.js","_app/immutable/entry/app.BYBuD-Ah.js","_app/immutable/chunks/D7O97qf1.js","_app/immutable/chunks/CYaxtGL2.js","_app/immutable/chunks/DGlywEG5.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
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
