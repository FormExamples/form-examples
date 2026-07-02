<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';

	const u = assessment.data.urine;
</script>

<Fieldset legend="Step 9 of 12 — Urine albumin:creatinine ratio (ACR)">
	<p class="hint">
		A missing ACR raises a flag; ACR 70 mg/mmol and over tightens the CKD target.
	</p>

	<Field label="Urine ACR (mg/mmol)" inputId="urine-urineAcr">
		<NumberInput
			id="urine-urineAcr"
			label="Urine ACR (mg/mmol)"
			min={0}
			max={3000}
			step={0.1}
			placeholder="e.g. 2.4"
			bind:value={u.urineAcr}
		/>
	</Field>
</Fieldset>
