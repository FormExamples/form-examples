<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import { resultStore } from '$lib/stores/result.svelte';

	const d = resultStore.data;
</script>

<Fieldset legend="4. Findings">
	<p class="hint">Structured electrophysiological finding flags.</p>

	<Field label="Structured findings">
		<CheckboxGroup label="Structured findings">
			<label><CheckboxInput label="ST-segment elevation" bind:checked={d.stElevation} /> ST-segment elevation</label>
			<label><CheckboxInput label="ST-segment depression" bind:checked={d.stDepression} /> ST-segment depression</label>
			<label><CheckboxInput label="T-wave inversion" bind:checked={d.tWaveInversion} /> T-wave inversion</label>
			<label><CheckboxInput label="Pathological Q waves" bind:checked={d.pathologicalQWaves} /> Pathological Q waves</label>
			<label><CheckboxInput label="Left ventricular hypertrophy" bind:checked={d.leftVentricularHypertrophy} /> Left ventricular hypertrophy</label>
			<label><CheckboxInput label="Bundle branch block" bind:checked={d.bundleBranchBlock} /> Bundle branch block</label>
			<label><CheckboxInput label="Ischaemia" bind:checked={d.ischaemia} /> Ischaemia</label>
			<label><CheckboxInput label="Normal ECG" bind:checked={d.normalEcg} /> Normal ECG</label>
		</CheckboxGroup>
	</Field>

	{#if d.stElevation}
		<Alert type="error" heading="Critical finding selected">
			<p>
				ST-segment elevation (a potential STEMI / acute injury pattern) auto-escalates the follow-up
				urgency to a critical alert. Ensure the result is communicated to the responsible team on
				sign-off.
			</p>
		</Alert>
	{/if}
</Fieldset>
