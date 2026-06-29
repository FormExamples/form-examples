<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import { request } from '$lib/stores/request.svelte';

	const d = request.data.medications;
</script>

<Fieldset legend="5. Medications">
	<p class="hint">
		Relevant medications, especially QT-prolonging or rate-controlling drugs that affect ECG
		interpretation.
	</p>

	<Field label="Relevant medications" inputId="relevantMedications" description="e.g. QT-prolonging or rate-controlling drugs.">
		<TextAreaInput
			id="relevantMedications"
			label="Relevant medications"
			rows={4}
			placeholder="e.g. Bisoprolol 5 mg OD, sotalol, amiodarone…"
			bind:value={d.relevantMedications}
		/>
	</Field>
</Fieldset>
