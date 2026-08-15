<script lang="ts">
	import { request } from '#lib/stores/request.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import CheckboxInput from '#lib/components/ui/CheckboxInput.svelte';

	const s = $state(request.data.safety);
</script>

<Fieldset legend="Validity and safety">
	<p class="hint">
		Drives the validity-and-safety axis. Antihistamines invalidate skin tests; a beta-blocker plus
		anaphylaxis history and active skin disease raise caution.
	</p>

	<label class="bool-field">
		<CheckboxInput label="History of anaphylaxis" bind:checked={s.previousAnaphylaxis} />
		<span>History of anaphylaxis</span>
	</label>
	<label class="bool-field">
		<CheckboxInput label="Currently on antihistamines" bind:checked={s.onAntihistamines} />
		<span>Currently on antihistamines</span>
	</label>
	<label class="bool-field">
		<CheckboxInput label="Currently on a beta-blocker" bind:checked={s.onBetaBlocker} />
		<span>Currently on a beta-blocker</span>
	</label>
	<label class="bool-field">
		<CheckboxInput label="Active skin disease at test site" bind:checked={s.currentSkinDisease} />
		<span>Active skin disease at test site (eczema, dermographism)</span>
	</label>
</Fieldset>

<style>
	.bool-field {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-top: 0.5rem;
	}
</style>
