<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const t = assessment.data.tympanometryAcousticReflexes;

	const tympOptions = [
		{ value: 'A', label: 'Type A (normal)' },
		{ value: 'As', label: 'Type As (shallow / stiff)' },
		{ value: 'Ad', label: 'Type Ad (hypermobile)' },
		{ value: 'B', label: 'Type B (flat)' },
		{ value: 'C', label: 'Type C (negative pressure)' }
	];
	const reflexOptions = [
		{ value: 'present', label: 'Present' },
		{ value: 'absent', label: 'Absent' },
		{ value: 'partial', label: 'Partial' }
	];
</script>

<Fieldset legend="Tympanometry & Acoustic Reflexes">
	<p class="hint">Middle-ear admittance and stapedial reflex screening.</p>

	<h3 class="mt-2 text-sm font-semibold text-base-content/80">Right ear</h3>
	<div class="grid gap-4 sm:grid-cols-2">
		<Field label="Tympanogram" inputId="rightTympanogram">
			<Select id="rightTympanogram" label="Right tympanogram" bind:value={t.rightTympanogram}>
				<option value="">-- Select --</option>
				{#each tympOptions as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}
			</Select>
		</Field>
		<Field label="Acoustic reflexes" inputId="rightAcousticReflexes">
			<Select id="rightAcousticReflexes" label="Right acoustic reflexes" bind:value={t.rightAcousticReflexes}>
				<option value="">-- Select --</option>
				{#each reflexOptions as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}
			</Select>
		</Field>
	</div>

	<h3 class="mt-2 text-sm font-semibold text-base-content/80">Left ear</h3>
	<div class="grid gap-4 sm:grid-cols-2">
		<Field label="Tympanogram" inputId="leftTympanogram">
			<Select id="leftTympanogram" label="Left tympanogram" bind:value={t.leftTympanogram}>
				<option value="">-- Select --</option>
				{#each tympOptions as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}
			</Select>
		</Field>
		<Field label="Acoustic reflexes" inputId="leftAcousticReflexes">
			<Select id="leftAcousticReflexes" label="Left acoustic reflexes" bind:value={t.leftAcousticReflexes}>
				<option value="">-- Select --</option>
				{#each reflexOptions as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}
			</Select>
		</Field>
	</div>

	<Field label="Tympanometry / reflex notes" inputId="tympanometryNotes">
		<TextAreaInput id="tympanometryNotes" label="Tympanometry / reflex notes" rows={3} placeholder="Probe-tone, ECV, peak admittance…" bind:value={t.notes} />
	</Field>
</Fieldset>
