<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const f = assessment.data.highRiskFeatures;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Step 6 of 7 — High-risk features">
	<p class="hint">
		Three yes/no contributors: cardiac arrest at admission (+39), ST-segment deviation (+28), and
		elevated cardiac enzymes / troponin (+14).
	</p>

	<Field label="Cardiac arrest at admission?">
		<RadioGroup label="Cardiac arrest at admission?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="highRiskFeatures-cardiacArrestAtAdmission"
						value={opt.value}
						bind:group={f.cardiacArrestAtAdmission}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="ST-segment deviation on admission ECG?">
		<RadioGroup label="ST-segment deviation on admission ECG?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="highRiskFeatures-stSegmentDeviation"
						value={opt.value}
						bind:group={f.stSegmentDeviation}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Elevated cardiac enzymes / troponin?">
		<RadioGroup label="Elevated cardiac enzymes / troponin?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="highRiskFeatures-elevatedCardiacEnzymes"
						value={opt.value}
						bind:group={f.elevatedCardiacEnzymes}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>
