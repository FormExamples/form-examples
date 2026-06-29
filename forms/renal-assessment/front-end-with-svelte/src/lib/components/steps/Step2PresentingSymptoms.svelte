<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import type { YesNo, PresentingSymptoms } from '$lib/engine/types';

	const s = assessment.data.presentingSymptoms;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	type SymptomKey = {
		[K in keyof PresentingSymptoms]: PresentingSymptoms[K] extends YesNo ? K : never;
	}[keyof PresentingSymptoms];

	const symptoms: { key: SymptomKey; label: string }[] = [
		{ key: 'fatigue', label: 'Fatigue or weakness?' },
		{ key: 'edema', label: 'Edema (ankle, leg, periorbital)?' },
		{ key: 'foamyUrine', label: 'Foamy / frothy urine?' },
		{ key: 'nocturia', label: 'Nocturia (waking at night to urinate)?' },
		{ key: 'hematuria', label: 'Hematuria (blood in urine)?' },
		{ key: 'flankPain', label: 'Flank or loin pain?' },
		{ key: 'reducedUrineOutput', label: 'Reduced urine output (oliguria)?' },
		{ key: 'pruritus', label: 'Pruritus (itching)?' },
		{ key: 'nauseaVomiting', label: 'Nausea or vomiting?' },
		{ key: 'appetiteLoss', label: 'Loss of appetite?' },
		{ key: 'dyspnea', label: 'Shortness of breath (dyspnea)?' },
		{ key: 'confusion', label: 'Confusion or altered mental status?' }
	];
</script>

<Fieldset legend="Presenting Symptoms">
	<p class="hint">Symptoms suggestive of kidney disease or uremia.</p>

	{#each symptoms as item (item.key)}
		<Field label={item.label}>
			<RadioGroup label={item.label}>
				{#each yesNo as opt (opt.value)}
					<label>
						<input type="radio" class="radio-input" name={item.key} value={opt.value} bind:group={s[item.key]} />
						{opt.label}
					</label>
				{/each}
			</RadioGroup>
		</Field>
	{/each}

	<Field label="Symptom duration" inputId="symptomDuration">
		<Select id="symptomDuration" label="Symptom duration" bind:value={s.symptomDuration}>
			<option value="">— Select —</option>
			<option value="days">Days</option>
			<option value="weeks">Weeks</option>
			<option value="months">Months</option>
			<option value="years">Years</option>
			<option value="unknown">Unknown</option>
		</Select>
	</Field>

	<Field label="Other symptoms" inputId="otherSymptoms">
		<TextAreaInput id="otherSymptoms" label="Other symptoms" rows={3} placeholder="Any other symptoms not listed above…" bind:value={s.otherSymptoms} />
	</Field>
</Fieldset>
