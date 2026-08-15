<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';

	const p = assessment.data.pupils;
</script>

<Fieldset legend="Step 6 of 8 — Pupils">
	<p class="hint">
		Pupil reactivity to light for the GCS-Pupils (GCS-P) score. The pupil reactivity score counts
		the pupils unreactive to light (0-2); GCS-P subtracts it from the total.
	</p>

	<Field label="Left pupil reactivity" inputId="pupils-leftPupilReactivity">
		<Select
			id="pupils-leftPupilReactivity"
			label="Left pupil reactivity"
			bind:value={p.leftPupilReactivity}
		>
			<option value="">— Select —</option>
			<option value="reactive">Reactive</option>
			<option value="sluggish">Sluggish</option>
			<option value="unreactive">Unreactive</option>
		</Select>
	</Field>

	<Field label="Right pupil reactivity" inputId="pupils-rightPupilReactivity">
		<Select
			id="pupils-rightPupilReactivity"
			label="Right pupil reactivity"
			bind:value={p.rightPupilReactivity}
		>
			<option value="">— Select —</option>
			<option value="reactive">Reactive</option>
			<option value="sluggish">Sluggish</option>
			<option value="unreactive">Unreactive</option>
		</Select>
	</Field>

	<Field label="Left pupil size (mm)" inputId="pupils-leftPupilSizeMm">
		<NumberInput
			id="pupils-leftPupilSizeMm"
			label="Left pupil size (mm)"
			min={1}
			max={9}
			step={1}
			bind:value={p.leftPupilSizeMm}
		/>
	</Field>

	<Field label="Right pupil size (mm)" inputId="pupils-rightPupilSizeMm">
		<NumberInput
			id="pupils-rightPupilSizeMm"
			label="Right pupil size (mm)"
			min={1}
			max={9}
			step={1}
			bind:value={p.rightPupilSizeMm}
		/>
	</Field>
</Fieldset>
