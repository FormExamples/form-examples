<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const x = assessment.data.examination;
</script>

<Fieldset legend="Step 7 of 8 — Examination and investigations">
	<p class="hint">
		Required component — the four core systems must each be examined or explicitly deferred with a
		reason. Investigations are optional.
	</p>

	<Field label="Cardiovascular" inputId="examination-examCardiovascular">
		<TextAreaInput
			id="examination-examCardiovascular"
			label="Cardiovascular"
			rows={2}
			placeholder={'Findings, or "deferred — reason".'}
			bind:value={x.examCardiovascular}
		/>
	</Field>

	<Field label="Respiratory" inputId="examination-examRespiratory">
		<TextAreaInput
			id="examination-examRespiratory"
			label="Respiratory"
			rows={2}
			placeholder={'Findings, or "deferred — reason".'}
			bind:value={x.examRespiratory}
		/>
	</Field>

	<Field label="Abdominal" inputId="examination-examAbdominal">
		<TextAreaInput
			id="examination-examAbdominal"
			label="Abdominal"
			rows={2}
			placeholder={'Findings, or "deferred — reason".'}
			bind:value={x.examAbdominal}
		/>
	</Field>

	<Field label="Neurological" inputId="examination-examNeurological">
		<TextAreaInput
			id="examination-examNeurological"
			label="Neurological"
			rows={2}
			placeholder={'Findings, or "deferred — reason".'}
			bind:value={x.examNeurological}
		/>
	</Field>

	<Field label="Other systems / general inspection" inputId="examination-examOther">
		<TextAreaInput
			id="examination-examOther"
			label="Other systems / general inspection"
			rows={2}
			placeholder="General inspection and any other systems examined (optional)."
			bind:value={x.examOther}
		/>
	</Field>

	<Field label="Investigations" inputId="examination-investigations">
		<TextAreaInput
			id="examination-investigations"
			label="Investigations"
			rows={4}
			placeholder="ECG, bloods, venous gas, chest X-ray, point-of-care results..."
			bind:value={x.investigations}
		/>
	</Field>
</Fieldset>
