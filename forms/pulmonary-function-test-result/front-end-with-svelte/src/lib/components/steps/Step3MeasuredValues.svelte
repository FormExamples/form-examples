<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import { resultStore } from '#lib/stores/result.svelte.js';

	const d = resultStore.data;
</script>

<Fieldset legend="3. Measured Values">
	<p class="hint">Spirometry and gas-transfer values (litres and percent predicted).</p>

	<Field label="FEV1 (litres)" inputId="fev1Litres" description="Forced expiratory volume in one second.">
		<NumberInput
			id="fev1Litres"
			label="FEV1 (litres)"
			min={0}
			max={12}
			step={0.01}
			bind:value={d.fev1Litres}
		/>
	</Field>

	<Field label="FEV1 (% predicted)" inputId="fev1PercentPredicted">
		<NumberInput
			id="fev1PercentPredicted"
			label="FEV1 (% predicted)"
			min={0}
			max={250}
			step={0.1}
			bind:value={d.fev1PercentPredicted}
		/>
	</Field>

	<Field label="FVC (litres)" inputId="fvcLitres" description="Forced vital capacity.">
		<NumberInput
			id="fvcLitres"
			label="FVC (litres)"
			min={0}
			max={12}
			step={0.01}
			bind:value={d.fvcLitres}
		/>
	</Field>

	<Field label="FVC (% predicted)" inputId="fvcPercentPredicted">
		<NumberInput
			id="fvcPercentPredicted"
			label="FVC (% predicted)"
			min={0}
			max={250}
			step={0.1}
			bind:value={d.fvcPercentPredicted}
		/>
	</Field>

	<Field
		label="FEV1/FVC ratio"
		inputId="fev1FvcRatio"
		description="Post-bronchodilator ratio < 0.70 confirms airflow obstruction (NICE NG115 / GOLD)."
	>
		<NumberInput
			id="fev1FvcRatio"
			label="FEV1/FVC ratio"
			min={0}
			max={1}
			step={0.01}
			bind:value={d.fev1FvcRatio}
		/>
	</Field>

	<Field label="Peak expiratory flow (L/min)" inputId="peakExpiratoryFlow">
		<NumberInput
			id="peakExpiratoryFlow"
			label="Peak expiratory flow (L/min)"
			min={0}
			max={1200}
			step={0.1}
			bind:value={d.peakExpiratoryFlow}
		/>
	</Field>

	<Field
		label="DLCO (% predicted)"
		inputId="dlcoPercentPredicted"
		description="Diffusing capacity of the lung for carbon monoxide (transfer factor)."
	>
		<NumberInput
			id="dlcoPercentPredicted"
			label="DLCO (% predicted)"
			min={0}
			max={250}
			step={0.1}
			bind:value={d.dlcoPercentPredicted}
		/>
	</Field>
</Fieldset>
