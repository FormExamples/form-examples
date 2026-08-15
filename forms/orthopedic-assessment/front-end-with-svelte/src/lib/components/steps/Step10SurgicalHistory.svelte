<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import type { PreviousSurgery } from '#lib/engine/types.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const sh = assessment.data.surgicalHistory;

	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	const willingOptions = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' },
		{ value: 'undecided', label: 'Undecided' }
	];

	function addSurgery() {
		sh.surgeries = [...sh.surgeries, { procedure: '', date: '', outcome: '' }];
	}

	function removeSurgery(index: number) {
		sh.surgeries = sh.surgeries.filter((_: PreviousSurgery, i: number) => i !== index);
	}
</script>

<Fieldset legend="Surgical History">
	<p class="hint">Previous orthopedic surgeries and anesthesia history.</p>

	<Field label="Have you had any previous orthopedic surgery?" required>
		<RadioGroup label="Previous orthopedic surgery">
			{#each yesNo as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="previousOrthopedicSurgery" value={opt.value} bind:group={sh.previousOrthopedicSurgery} required />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if sh.previousOrthopedicSurgery === 'yes'}
		<Field label="Previous Surgeries">
			<div class="entry-list">
				{#each sh.surgeries as surgery, i}
					<div class="entry-row">
						<div class="entry-grid">
							<input class="text-input" type="text" placeholder="Procedure" bind:value={surgery.procedure} />
							<input class="date-input" type="date" bind:value={surgery.date} />
							<input class="text-input" type="text" placeholder="Outcome" bind:value={surgery.outcome} />
						</div>
						<button class="button" type="button" data-variant="danger" onclick={() => removeSurgery(i)} aria-label="Remove surgery">&times;</button>
					</div>
				{/each}
				<button class="button" type="button" onclick={addSurgery}>+ Add Surgery</button>
			</div>
		</Field>
	{/if}

	<Field label="Have you had any complications with anesthesia?">
		<RadioGroup label="Anesthesia complications">
			{#each yesNo as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="anesthesiaComplications" value={opt.value} bind:group={sh.anesthesiaComplications} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if sh.anesthesiaComplications === 'yes'}
		<Field label="Anesthesia Complication Details" inputId="anesthesiaDetails">
			<TextAreaInput id="anesthesiaDetails" label="Anesthesia Details" rows={3} bind:value={sh.anesthesiaDetails} />
		</Field>
	{/if}

	<Field label="Would you be willing to consider surgery if recommended?">
		<RadioGroup label="Willing to consider surgery">
			{#each willingOptions as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="willingToConsiderSurgery" value={opt.value} bind:group={sh.willingToConsiderSurgery} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>

<style>
	.entry-list { display: flex; flex-direction: column; gap: 0.75rem; }
	.entry-row {
		display: flex; align-items: flex-start; gap: 0.5rem;
		border: 1px solid var(--color-border);
		background: var(--color-bg);
		border-radius: 0.5rem;
		padding: 0.75rem;
	}
	.entry-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.5rem;
		flex: 1;
	}
	@media (max-width: 640px) {
		.entry-grid { grid-template-columns: 1fr; }
	}
</style>
