// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		interface PageData {
			/**
			 * Plain page name (e.g. "Architecture"), set by each route's
			 * +page.ts. The root +layout.svelte composes the <title> and the
			 * SharePicker's share title from this single source — see
			 * $lib/site.ts's pageTitle().
			 */
			title?: string;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
