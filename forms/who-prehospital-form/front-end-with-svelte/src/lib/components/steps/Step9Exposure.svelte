<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Checkbox from '#lib/components/ui/Checkbox.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const e = assessment.data.exposure;
</script>

<Fieldset
	title="Exposure (E)"
	description="Primary survey: exposure assessment. Additional exam findings are captured under Physical Exam."
>
	<Checkbox label="Normal (NML)" name="exposureNormal" bind:checked={e.normal} />
	<Checkbox
		label="Exposed completely"
		name="exposedCompletely"
		bind:checked={e.exposedCompletely}
	/>
	<TextAreaInput label="Notes" name="exposureNotes" bind:value={e.notes} rows={3} />
</Fieldset>
