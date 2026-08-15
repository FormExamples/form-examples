<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateNipeGrade } from '#lib/engine/nipe-grader.js';
	import { componentResultColor, componentResultLabel } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const e = assessment.data.eyes;
	const grade = $derived(calculateNipeGrade(assessment.data));
</script>

<Fieldset legend="Step 4 of 9 — Eyes (key component)">
	<p class="hint">
		Red reflex in both eyes and external appearance. An absent or abnormal red reflex, or an
		abnormal appearance, is a Refer.
	</p>

	<Field label="Red reflex — right eye" inputId="eyes-eyesRedReflexRight">
		<Select
			id="eyes-eyesRedReflexRight"
			label="Red reflex — right eye"
			bind:value={e.eyesRedReflexRight}
		>
			<option value="">— Select —</option>
			<option value="present">Present</option>
			<option value="absent">Absent</option>
			<option value="not-examined">Not examined</option>
		</Select>
	</Field>

	<Field label="Red reflex — left eye" inputId="eyes-eyesRedReflexLeft">
		<Select id="eyes-eyesRedReflexLeft" label="Red reflex — left eye" bind:value={e.eyesRedReflexLeft}>
			<option value="">— Select —</option>
			<option value="present">Present</option>
			<option value="absent">Absent</option>
			<option value="not-examined">Not examined</option>
		</Select>
	</Field>

	<Field label="External eye appearance" inputId="eyes-eyesAppearance">
		<Select id="eyes-eyesAppearance" label="External eye appearance" bind:value={e.eyesAppearance}>
			<option value="">— Select —</option>
			<option value="normal">Normal</option>
			<option value="abnormal">Abnormal</option>
			<option value="not-examined">Not examined</option>
		</Select>
	</Field>

	<Field label="Eyes result">
		<span
			class="inline-block rounded-full border px-3 py-1 text-sm font-bold {componentResultColor(
				grade.eyesResult
			)}"
		>
			{componentResultLabel(grade.eyesResult)}
		</span>
	</Field>
</Fieldset>
