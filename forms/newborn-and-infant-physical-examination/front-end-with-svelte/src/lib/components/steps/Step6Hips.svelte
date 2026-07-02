<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateNipeGrade } from '$lib/engine/nipe-grader';
	import { componentResultColor, componentResultLabel } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const hp = assessment.data.hips;
	const grade = $derived(calculateNipeGrade(assessment.data));
</script>

<Fieldset legend="Step 6 of 9 — Hips (key component)">
	<p class="hint">
		Barlow and Ortolani manoeuvres and hip abduction. An unstable hip, limited abduction, or a hip
		risk factor (recorded in step 3) is a Refer.
	</p>

	<Field label="Barlow manoeuvre" inputId="hips-barlowTest">
		<Select id="hips-barlowTest" label="Barlow manoeuvre" bind:value={hp.barlowTest}>
			<option value="">— Select —</option>
			<option value="negative">Negative</option>
			<option value="positive">Positive</option>
			<option value="not-examined">Not examined</option>
		</Select>
	</Field>

	<Field label="Ortolani manoeuvre" inputId="hips-ortolaniTest">
		<Select id="hips-ortolaniTest" label="Ortolani manoeuvre" bind:value={hp.ortolaniTest}>
			<option value="">— Select —</option>
			<option value="negative">Negative</option>
			<option value="positive">Positive</option>
			<option value="not-examined">Not examined</option>
		</Select>
	</Field>

	<Field label="Hip abduction" inputId="hips-hipAbduction">
		<Select id="hips-hipAbduction" label="Hip abduction" bind:value={hp.hipAbduction}>
			<option value="">— Select —</option>
			<option value="normal">Normal</option>
			<option value="limited">Limited</option>
			<option value="not-examined">Not examined</option>
		</Select>
	</Field>

	<Field label="Hips result">
		<span
			class="inline-block rounded-full border px-3 py-1 text-sm font-bold {componentResultColor(
				grade.hipsResult
			)}"
		>
			{componentResultLabel(grade.hipsResult)}
		</span>
	</Field>
</Fieldset>
