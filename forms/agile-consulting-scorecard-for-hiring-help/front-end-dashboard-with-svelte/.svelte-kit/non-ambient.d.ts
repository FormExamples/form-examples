
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	type MatcherParam<M> = M extends (param : string) => param is (infer U extends string) ? U : string;

	export interface AppTypes {
		RouteId(): "/" | "/api" | "/api/dashboard" | "/api/dashboard/scorecards" | "/api/scorecards" | "/api/scorecards/[id]" | "/api/stats" | "/import" | "/report" | "/report/[id]";
		RouteParams(): {
			"/api/scorecards/[id]": { id: string };
			"/report/[id]": { id: string }
		};
		LayoutParams(): {
			"/": { id?: string };
			"/api": { id?: string };
			"/api/dashboard": Record<string, never>;
			"/api/dashboard/scorecards": Record<string, never>;
			"/api/scorecards": { id?: string };
			"/api/scorecards/[id]": { id: string };
			"/api/stats": Record<string, never>;
			"/import": Record<string, never>;
			"/report": { id?: string };
			"/report/[id]": { id: string }
		};
		Pathname(): "/" | "/api/dashboard/scorecards" | `/api/scorecards/${string}` & {} | "/api/stats" | "/import" | `/report/${string}` & {};
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): string & {};
	}
}