<script lang="ts">
	import { request } from '$lib/stores/request.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const i = request.data.indication;
</script>

<Fieldset legend="Clinical indication">
	<p class="hint">The indication, the specific clinical question, and the relevant history.</p>

	<Field label="Primary indication" required inputId="primaryIndication">
		<Select id="primaryIndication" label="Primary indication" required bind:value={i.primaryIndication}>
			<option value="">— Select —</option>
			<option value="suspected-food-allergy">Suspected food allergy</option>
			<option value="suspected-drug-allergy">Suspected drug allergy</option>
			<option value="rhinitis-asthma">Rhinitis / asthma</option>
			<option value="anaphylaxis-investigation">Anaphylaxis investigation</option>
			<option value="venom-allergy">Venom allergy</option>
			<option value="contact-dermatitis">Contact dermatitis</option>
			<option value="urticaria">Urticaria</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Specific clinical question" required inputId="clinicalQuestion">
		<TextAreaInput
			id="clinicalQuestion"
			label="Specific clinical question"
			rows={2}
			required
			placeholder="e.g. Confirm or exclude IgE-mediated peanut allergy."
			bind:value={i.clinicalQuestion}
		/>
	</Field>

	<Field label="Relevant clinical details / history" inputId="clinicalDetails">
		<TextAreaInput
			id="clinicalDetails"
			label="Relevant clinical details / history"
			rows={3}
			placeholder="Reaction description, timing, suspected triggers, prior testing."
			bind:value={i.clinicalDetails}
		/>
	</Field>
</Fieldset>
