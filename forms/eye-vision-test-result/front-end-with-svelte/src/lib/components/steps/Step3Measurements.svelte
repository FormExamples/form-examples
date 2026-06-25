<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import { resultStore } from '$lib/stores/result.svelte';
	import { ACUTE_IOP_MMHG, RAISED_IOP_MMHG } from '$lib/engine/utils';

	const d = resultStore.data;

	const acuteIop = $derived(
		(d.intraocularPressureRightMmhg !== null && d.intraocularPressureRightMmhg >= ACUTE_IOP_MMHG) ||
			(d.intraocularPressureLeftMmhg !== null && d.intraocularPressureLeftMmhg >= ACUTE_IOP_MMHG)
	);
</script>

<Fieldset legend="3. Measurements">
	<p class="hint">
		Visual acuity, intraocular pressure (NICE NG81 referral threshold {RAISED_IOP_MMHG} mmHg), and
		visual fields.
	</p>

	<Field label="Visual acuity — right" inputId="visualAcuityRight">
		<TextInput
			id="visualAcuityRight"
			label="Visual acuity — right"
			placeholder="e.g. 6/6, 6/9, CF, HM"
			bind:value={d.visualAcuityRight}
		/>
	</Field>

	<Field label="Visual acuity — left" inputId="visualAcuityLeft">
		<TextInput
			id="visualAcuityLeft"
			label="Visual acuity — left"
			placeholder="e.g. 6/6, 6/9, CF, HM"
			bind:value={d.visualAcuityLeft}
		/>
	</Field>

	<Field label="Intraocular pressure — right (mmHg)" inputId="intraocularPressureRightMmhg">
		<NumberInput
			id="intraocularPressureRightMmhg"
			label="Intraocular pressure — right (mmHg)"
			min={0}
			max={100}
			step={0.1}
			bind:value={d.intraocularPressureRightMmhg}
		/>
	</Field>

	<Field label="Intraocular pressure — left (mmHg)" inputId="intraocularPressureLeftMmhg">
		<NumberInput
			id="intraocularPressureLeftMmhg"
			label="Intraocular pressure — left (mmHg)"
			min={0}
			max={100}
			step={0.1}
			bind:value={d.intraocularPressureLeftMmhg}
		/>
	</Field>

	<Field label="Visual-field result" inputId="visualFieldResult">
		<Select id="visualFieldResult" label="Visual-field result" bind:value={d.visualFieldResult}>
			<option value="">Select…</option>
			<option value="full">Full fields</option>
			<option value="defect-right">Defect — right</option>
			<option value="defect-left">Defect — left</option>
			<option value="bilateral-defect">Bilateral defect</option>
		</Select>
	</Field>

	{#if acuteIop}
		<Alert type="error" heading="Acutely raised intraocular pressure">
			<p>
				An intraocular pressure of {ACUTE_IOP_MMHG} mmHg or above auto-escalates the follow-up
				urgency to a critical alert. Consider acute angle-closure glaucoma and arrange urgent
				ophthalmology review.
			</p>
		</Alert>
	{/if}
</Fieldset>
