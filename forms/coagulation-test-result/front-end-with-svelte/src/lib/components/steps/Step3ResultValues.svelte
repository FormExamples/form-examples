<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import { resultStore } from '$lib/stores/result.svelte';

	const d = resultStore.data;
</script>

<Fieldset legend="3. Result Values">
	<p class="hint">The reported coagulation result values. Leave a value blank if not measured.</p>

	<Field
		label="Prothrombin time — PT (s)"
		inputId="prothrombinTimeSeconds"
		description="Extrinsic / common pathway; reference range approximately 11–14 s."
	>
		<NumberInput
			id="prothrombinTimeSeconds"
			label="Prothrombin time — PT (s)"
			min={0}
			max={300}
			step={0.1}
			bind:value={d.prothrombinTimeSeconds}
		/>
	</Field>

	<Field
		label="INR"
		inputId="inr"
		description="Standardised PT for warfarin monitoring; > 8 is a critical value."
	>
		<NumberInput id="inr" label="INR" min={0} max={50} step={0.1} bind:value={d.inr} />
	</Field>

	<Field
		label="APTT (s)"
		inputId="activatedPartialThromboplastinTimeSeconds"
		description="Intrinsic / common pathway; reference range approximately 25–40 s."
	>
		<NumberInput
			id="activatedPartialThromboplastinTimeSeconds"
			label="APTT (s)"
			min={0}
			max={300}
			step={0.1}
			bind:value={d.activatedPartialThromboplastinTimeSeconds}
		/>
	</Field>

	<Field
		label="APTT ratio"
		inputId="apttRatio"
		description="Patient APTT divided by the mean normal APTT."
	>
		<NumberInput
			id="apttRatio"
			label="APTT ratio"
			min={0}
			max={50}
			step={0.1}
			bind:value={d.apttRatio}
		/>
	</Field>

	<Field
		label="Fibrinogen (g/L)"
		inputId="fibrinogenGL"
		description="Clauss fibrinogen; < 1.0 g/L is a critical value."
	>
		<NumberInput
			id="fibrinogenGL"
			label="Fibrinogen (g/L)"
			min={0}
			max={50}
			step={0.1}
			bind:value={d.fibrinogenGL}
		/>
	</Field>

	<Field
		label="D-dimer"
		inputId="dDimer"
		description="Fibrin degradation product (units as reported by the assay)."
	>
		<NumberInput
			id="dDimer"
			label="D-dimer"
			min={0}
			max={1000000}
			step={0.1}
			bind:value={d.dDimer}
		/>
	</Field>

	<Field
		label="Thrombin time — TT (s)"
		inputId="thrombinTimeSeconds"
		description="Fibrinogen function; heparin / dabigatran effect."
	>
		<NumberInput
			id="thrombinTimeSeconds"
			label="Thrombin time — TT (s)"
			min={0}
			max={300}
			step={0.1}
			bind:value={d.thrombinTimeSeconds}
		/>
	</Field>

	<Field label="Factor assays / special tests" inputId="factorAssays">
		<TextAreaInput
			id="factorAssays"
			label="Factor assays / special tests"
			rows={3}
			placeholder="Factor VIII/IX levels, von Willebrand panel, lupus anticoagulant, anti-Xa…"
			bind:value={d.factorAssays}
		/>
	</Field>
</Fieldset>
