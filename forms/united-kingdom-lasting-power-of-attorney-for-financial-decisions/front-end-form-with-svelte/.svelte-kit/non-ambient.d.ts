
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
		RouteId(): "/" | "/lpa" | "/lpa/[step=step]";
		RouteParams(): {
			"/lpa/[step=step]": { step: MatcherParam<typeof import('../src/params/step.js').match> }
		};
		LayoutParams(): {
			"/": { step?: MatcherParam<typeof import('../src/params/step.js').match> };
			"/lpa": { step?: MatcherParam<typeof import('../src/params/step.js').match> };
			"/lpa/[step=step]": { step: MatcherParam<typeof import('../src/params/step.js').match> }
		};
		Pathname(): "/" | `/lpa/${string}` & {};
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/favicon.svg" | string & {};
	}
}