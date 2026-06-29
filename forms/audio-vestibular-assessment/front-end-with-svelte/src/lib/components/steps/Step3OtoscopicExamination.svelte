<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const o = assessment.data.otoscopicExamination;

	const canalOptions = [
		{ value: 'clear', label: 'Clear' },
		{ value: 'wax', label: 'Wax / cerumen' },
		{ value: 'debris', label: 'Debris' },
		{ value: 'edema', label: 'Oedema' },
		{ value: 'otorrhea', label: 'Otorrhea / discharge' }
	];
	const tmOptions = [
		{ value: 'intact', label: 'Intact, normal' },
		{ value: 'retracted', label: 'Retracted' },
		{ value: 'bulging', label: 'Bulging' },
		{ value: 'perforation', label: 'Perforation' },
		{ value: 'effusion', label: 'Middle-ear effusion' },
		{ value: 'tube', label: 'Grommet / tube' },
		{ value: 'scarred', label: 'Tympanosclerosis / scarred' }
	];
</script>

<Fieldset legend="Otoscopic Examination">
	<p class="hint">External canal and tympanic membrane appearance, each ear.</p>

	<h3 class="mt-2 text-sm font-semibold text-base-content/80">Right ear</h3>
	<Field label="Canal status" inputId="rightCanalStatus">
		<Select id="rightCanalStatus" label="Right canal status" bind:value={o.rightEar.canalStatus}>
			<option value="">-- Select --</option>
			{#each canalOptions as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}
		</Select>
	</Field>
	<Field label="Tympanic membrane" inputId="rightTympanicMembrane">
		<Select id="rightTympanicMembrane" label="Right tympanic membrane" bind:value={o.rightEar.tympanicMembrane}>
			<option value="">-- Select --</option>
			{#each tmOptions as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}
		</Select>
	</Field>

	<h3 class="mt-2 text-sm font-semibold text-base-content/80">Left ear</h3>
	<Field label="Canal status" inputId="leftCanalStatus">
		<Select id="leftCanalStatus" label="Left canal status" bind:value={o.leftEar.canalStatus}>
			<option value="">-- Select --</option>
			{#each canalOptions as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}
		</Select>
	</Field>
	<Field label="Tympanic membrane" inputId="leftTympanicMembrane">
		<Select id="leftTympanicMembrane" label="Left tympanic membrane" bind:value={o.leftEar.tympanicMembrane}>
			<option value="">-- Select --</option>
			{#each tmOptions as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}
		</Select>
	</Field>

	<Field label="Otoscopy notes" inputId="otoscopyNotes">
		<TextAreaInput id="otoscopyNotes" label="Otoscopy notes" rows={3} placeholder="Any additional otoscopy findings…" bind:value={o.notes} />
	</Field>
</Fieldset>
