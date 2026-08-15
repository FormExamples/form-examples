<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const e = assessment.data.endoscopy;
	const performed = $derived(e.endoscopyPerformed === 'yes');
</script>

<Fieldset legend="Step 5 of 6 — Endoscopy">
	<p class="hint">
		The two endoscopic parameters extend the clinical score to the full (post-endoscopy) Rockall
		score of 0-11. They only contribute when endoscopy has been performed.
	</p>

	<Field label="Has endoscopy been performed?">
		<RadioGroup label="Endoscopy performed">
			<label>
				<input
					type="radio"
					class="radio-input"
					name="endoscopy-performed"
					value="yes"
					bind:group={e.endoscopyPerformed}
				/>
				Endoscopy performed
			</label>
			<label>
				<input
					type="radio"
					class="radio-input"
					name="endoscopy-performed"
					value="no"
					bind:group={e.endoscopyPerformed}
				/>
				Endoscopy not yet performed
			</label>
		</RadioGroup>
	</Field>

	{#if performed}
		<Field
			label="Endoscopic diagnosis"
			description="Mallory-Weiss / no lesion &rarr; 0, all other &rarr; 1, upper GI malignancy &rarr; 2."
			inputId="endoscopy-diagnosis"
		>
			<Select id="endoscopy-diagnosis" label="Endoscopic diagnosis" bind:value={e.diagnosis}>
				<option value="">— Select —</option>
				<option value="mallory-weiss-or-none">Mallory-Weiss tear or no lesion / no stigmata</option>
				<option value="all-other">All other diagnoses</option>
				<option value="upper-gi-malignancy">Malignancy of the upper GI tract</option>
			</Select>
		</Field>

		<Field
			label="Stigmata of recent haemorrhage"
			description="None or dark spot &rarr; 0; blood, adherent clot, or visible / spurting vessel &rarr; 2."
			inputId="endoscopy-stigmata"
		>
			<Select id="endoscopy-stigmata" label="Stigmata of recent haemorrhage" bind:value={e.stigmata}>
				<option value="">— Select —</option>
				<option value="none-or-dark-spot">None, or dark spot only</option>
				<option value="high-risk">Blood, adherent clot, or visible / spurting vessel</option>
			</Select>
		</Field>
	{:else}
		<p class="hint">
			While endoscopy is not yet performed, only the pre-endoscopy (clinical) Rockall score of 7 is
			reported.
		</p>
	{/if}
</Fieldset>
