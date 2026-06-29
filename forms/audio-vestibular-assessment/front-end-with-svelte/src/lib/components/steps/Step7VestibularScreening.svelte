<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const v = assessment.data.vestibularScreening;

	const hitOptions = [
		{ value: 'normal', label: 'Normal' },
		{ value: 'abnormal-right', label: 'Abnormal — right' },
		{ value: 'abnormal-left', label: 'Abnormal — left' },
		{ value: 'not-done', label: 'Not done' }
	];
	const dixOptions = [
		{ value: 'negative', label: 'Negative' },
		{ value: 'positive-right', label: 'Positive — right' },
		{ value: 'positive-left', label: 'Positive — left' },
		{ value: 'bilateral', label: 'Bilateral' },
		{ value: 'not-done', label: 'Not done' }
	];
	const normAbnUnable = [
		{ value: 'normal', label: 'Normal' },
		{ value: 'abnormal', label: 'Abnormal' },
		{ value: 'unable', label: 'Unable to perform' }
	];
	const nystagmusOptions = [
		{ value: 'none', label: 'None' },
		{ value: 'spontaneous', label: 'Spontaneous' },
		{ value: 'gaze-evoked', label: 'Gaze-evoked' },
		{ value: 'positional', label: 'Positional' }
	];
	const fukudaOptions = [
		{ value: 'normal', label: 'Normal' },
		{ value: 'rotation-right', label: 'Rotation — right' },
		{ value: 'rotation-left', label: 'Rotation — left' },
		{ value: 'not-done', label: 'Not done' }
	];
</script>

<Fieldset legend="Vestibular Screening">
	<p class="hint">Bedside vestibular tests: HIT, Dix-Hallpike, Romberg, tandem gait, nystagmus, Fukuda.</p>

	<Field label="Head Impulse Test (HIT)" inputId="headImpulseTest">
		<Select id="headImpulseTest" label="Head Impulse Test" bind:value={v.headImpulseTest}>
			<option value="">-- Select --</option>
			{#each hitOptions as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}
		</Select>
	</Field>

	<Field label="Dix-Hallpike" inputId="dixHallpike">
		<Select id="dixHallpike" label="Dix-Hallpike" bind:value={v.dixHallpike}>
			<option value="">-- Select --</option>
			{#each dixOptions as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}
		</Select>
	</Field>

	<Field label="Romberg test" inputId="rombergTest">
		<Select id="rombergTest" label="Romberg test" bind:value={v.rombergTest}>
			<option value="">-- Select --</option>
			{#each normAbnUnable as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}
		</Select>
	</Field>

	<Field label="Tandem gait" inputId="tandemGait">
		<Select id="tandemGait" label="Tandem gait" bind:value={v.tandemGait}>
			<option value="">-- Select --</option>
			{#each normAbnUnable as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}
		</Select>
	</Field>

	<Field label="Nystagmus" inputId="nystagmus">
		<Select id="nystagmus" label="Nystagmus" bind:value={v.nystagmus}>
			<option value="">-- Select --</option>
			{#each nystagmusOptions as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}
		</Select>
	</Field>

	<Field label="Fukuda stepping test" inputId="fukudaSteppingTest">
		<Select id="fukudaSteppingTest" label="Fukuda stepping test" bind:value={v.fukudaSteppingTest}>
			<option value="">-- Select --</option>
			{#each fukudaOptions as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}
		</Select>
	</Field>

	<Field label="Vestibular screening notes" inputId="vestibularNotes">
		<TextAreaInput id="vestibularNotes" label="Vestibular screening notes" rows={3} placeholder="Any additional bedside vestibular findings…" bind:value={v.notes} />
	</Field>
</Fieldset>
