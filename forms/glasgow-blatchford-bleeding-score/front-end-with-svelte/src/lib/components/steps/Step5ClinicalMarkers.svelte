<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const m = assessment.data.clinicalMarkers;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Step 5 of 6 — Clinical markers">
	<p class="hint">
		Parameters 6-9 — melaena, syncope, hepatic disease, and cardiac failure. Each adds points only
		when present.
	</p>

	<Field label="Melaena (black tarry stool) — adds 1 point when present">
		<RadioGroup label="Melaena">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="melaena"
						value={opt.value}
						bind:group={m.melaenaPresent}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Syncope — adds 2 points when present (marker of significant blood loss)">
		<RadioGroup label="Syncope">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="syncope"
						value={opt.value}
						bind:group={m.syncope}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Hepatic disease — history of liver disease; adds 2 points when present">
		<RadioGroup label="Hepatic disease">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="hepatic-disease"
						value={opt.value}
						bind:group={m.hepaticDisease}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Cardiac failure — history of cardiac failure; adds 2 points when present">
		<RadioGroup label="Cardiac failure">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="cardiac-failure"
						value={opt.value}
						bind:group={m.cardiacFailure}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>
