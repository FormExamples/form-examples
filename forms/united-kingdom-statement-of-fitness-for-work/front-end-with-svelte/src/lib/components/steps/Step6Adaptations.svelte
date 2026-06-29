<script lang="ts">
	import { store } from '$lib/stores/fitnote.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import YesNo from '$lib/components/ui/YesNo.svelte';

	const d = store.data;
	const showAdaptations = $derived(d.fitnessForWork === 'may_be_fit');
</script>

<Fieldset legend="Adaptations">
	{#if showAdaptations}
		<p class="hint">Tick the workplace adaptations that would help the patient return to work.</p>
		<div class="field-grid">
			<Field label="Phased return to work">
				<YesNo
					label="Phased return to work"
					name="adaptationPhasedReturn"
					bind:value={d.adaptationPhasedReturn}
				/>
			</Field>
			<Field label="Altered hours">
				<YesNo
					label="Altered hours"
					name="adaptationAlteredHours"
					bind:value={d.adaptationAlteredHours}
				/>
			</Field>
			<Field label="Amended duties">
				<YesNo
					label="Amended duties"
					name="adaptationAmendedDuties"
					bind:value={d.adaptationAmendedDuties}
				/>
			</Field>
			<Field label="Workplace adaptations">
				<YesNo
					label="Workplace adaptations"
					name="adaptationWorkplaceAdaptations"
					bind:value={d.adaptationWorkplaceAdaptations}
				/>
			</Field>
		</div>
	{:else}
		<p class="hint">Adaptations are only applicable when "may be fit" is selected in Step 5.</p>
	{/if}
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	@media (max-width: 640px) {
		.field-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
