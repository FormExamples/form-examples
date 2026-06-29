<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import { request } from '$lib/stores/request.svelte';

	const d = request.data.neuroSafety;

	const raisedIcp = $derived(
		d.suspectedRaisedIntracranialPressure || d.focalNeurologicalSigns || d.reducedConsciousness
	);
	const reassuringCt = $derived(d.ctHeadStatus === 'not-required' || d.ctHeadStatus === 'done-normal');
</script>

<Fieldset legend="4. Raised-ICP and Neuro Safety">
	<p class="hint">
		Raised intracranial pressure without a reassuring CT head is a contraindication to LP. Image and
		stabilise first.
	</p>

	<Field label="Raised-ICP / neurological screen">
		<CheckboxGroup label="Raised-ICP / neurological screen">
			<label><CheckboxInput label="Suspected raised intracranial pressure" bind:checked={d.suspectedRaisedIntracranialPressure} /> Suspected raised intracranial pressure</label>
			<label><CheckboxInput label="New focal neurological signs" bind:checked={d.focalNeurologicalSigns} /> New focal neurological signs</label>
			<label><CheckboxInput label="Reduced consciousness (GCS ≤ 9)" bind:checked={d.reducedConsciousness} /> Reduced consciousness (GCS ≤ 9)</label>
		</CheckboxGroup>
	</Field>

	<Field label="CT head status" inputId="ctHeadStatus" description="Required when raised ICP is suspected.">
		<Select id="ctHeadStatus" label="CT head status" bind:value={d.ctHeadStatus}>
			<option value="">Select…</option>
			<option value="not-required">Not required</option>
			<option value="awaited">Awaited</option>
			<option value="done-normal">Done — normal / reassuring</option>
			<option value="done-abnormal">Done — abnormal</option>
		</Select>
	</Field>

	{#if raisedIcp && !reassuringCt}
		<Alert type="error" heading="Image and stabilise before LP">
			<p>
				Suspected raised intracranial pressure without a reassuring CT head is a contraindication to
				lumbar puncture (risk of cerebral herniation). Obtain a CT head and stabilise first.
			</p>
		</Alert>
	{:else if raisedIcp && reassuringCt}
		<Alert type="warning" heading="Raised-ICP features recorded">
			<p>Raised-ICP features are present; LP may proceed only after CT head confirms it is safe.</p>
		</Alert>
	{/if}
</Fieldset>
