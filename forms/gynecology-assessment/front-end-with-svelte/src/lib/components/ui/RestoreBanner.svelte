<script lang="ts">
	// RestoreBanner — tells the user a previous draft of this wizard was
	// restored from localStorage, rather than silently repopulating fields
	// with no explanation. Svelte counterpart to the HTML front-end's
	// js/restore-banner.js; hand-authored (not a Lily upstream component),
	// vendored fleet-wide the same way.
	//
	// Generic on purpose: takes `show` + `onDiscard` rather than reaching
	// into a specific form's own state store directly, so the same file is
	// byte-identical across forms regardless of what each form calls its
	// store (requestStore, assessmentStore, ...). "Dismiss" just hides the
	// banner (the draft stays); "Discard and start over" calls the caller's
	// own reset handler rather than reimplementing clearing logic here.
	import Alert from './Alert.svelte';
	import { Button } from "lily-design-system-svelte-headless";

	let {
		show = false,
		onDiscard
	}: {
		show: boolean;
		onDiscard: () => void;
	} = $props();

	let dismissed = $state(false);

	function discard() {
		onDiscard();
		dismissed = true;
	}
</script>

{#if show && !dismissed}
	<Alert type="info" role="status" class="restore-banner mb-4 flex flex-wrap items-center justify-between gap-4">
		<span>Your previous progress on this form was restored.</span>
		<span class="flex flex-wrap gap-2">
			<Button data-variant="secondary" onclick={discard}>Discard and start over</Button>
			<Button data-variant="secondary" onclick={() => (dismissed = true)} label="Dismiss this notice"
				>Dismiss</Button
			>
		</span>
	</Alert>
{/if}
