<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const f = assessment.data.functional;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
	const levels = [
		{ value: 'full', label: 'Full / unimpaired' },
		{ value: 'mild', label: 'Mild impairment' },
		{ value: 'moderate', label: 'Moderate impairment' },
		{ value: 'severe', label: 'Severe impairment' }
	];
</script>

<Fieldset legend="Functional assessment">
	<p class="hint">Clinician-observed functional capacity relevant to work.</p>

	<Field label="Mobility" inputId="mobility">
		<Select id="mobility" label="Mobility" bind:value={f.mobility}>
			<option value="">-- Select --</option>
			{#each levels as l (l.value)}<option value={l.value}>{l.label}</option>{/each}
		</Select>
	</Field>

	<Field label="Manual handling capacity" inputId="manualHandling">
		<Select id="manualHandling" label="Manual handling capacity" bind:value={f.manualHandling}>
			<option value="">-- Select --</option>
			{#each levels as l (l.value)}<option value={l.value}>{l.label}</option>{/each}
		</Select>
	</Field>

	<Field label="Cognition" inputId="cognition">
		<Select id="cognition" label="Cognition" bind:value={f.cognition}>
			<option value="">-- Select --</option>
			{#each levels as l (l.value)}<option value={l.value}>{l.label}</option>{/each}
		</Select>
	</Field>

	<Field label="Mood" inputId="mood">
		<Select id="mood" label="Mood" bind:value={f.mood}>
			<option value="">-- Select --</option>
			{#each levels as l (l.value)}<option value={l.value}>{l.label}</option>{/each}
		</Select>
	</Field>

	<Field label="Sleep" inputId="sleep">
		<Select id="sleep" label="Sleep" bind:value={f.sleep}>
			<option value="">-- Select --</option>
			{#each levels as l (l.value)}<option value={l.value}>{l.label}</option>{/each}
		</Select>
	</Field>

	<Field label="Pain (0-10)" inputId="pain">
		<NumberInput id="pain" label="Pain (0-10)" min={0} max={10} bind:value={f.pain} />
	</Field>

	<Field label="Standing tolerance" inputId="standingTolerance">
		<Select id="standingTolerance" label="Standing tolerance" bind:value={f.standingTolerance}>
			<option value="">-- Select --</option>
			{#each levels as l (l.value)}<option value={l.value}>{l.label}</option>{/each}
		</Select>
	</Field>

	<Field label="Sitting tolerance" inputId="sittingTolerance">
		<Select id="sittingTolerance" label="Sitting tolerance" bind:value={f.sittingTolerance}>
			<option value="">-- Select --</option>
			{#each levels as l (l.value)}<option value={l.value}>{l.label}</option>{/each}
		</Select>
	</Field>

	<Field label="Screen-time tolerance" inputId="screenTolerance">
		<Select id="screenTolerance" label="Screen-time tolerance" bind:value={f.screenTolerance}>
			<option value="">-- Select --</option>
			{#each levels as l (l.value)}<option value={l.value}>{l.label}</option>{/each}
		</Select>
	</Field>

	<Field label="Driving capacity">
		<RadioGroup label="Driving capacity">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="drivingCapacity" value={opt.value} bind:group={f.drivingCapacity} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Independent in activities of daily living (ADLs)?">
		<RadioGroup label="Independent in activities of daily living (ADLs)?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="adlIndependence" value={opt.value} bind:group={f.adlIndependence} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>
