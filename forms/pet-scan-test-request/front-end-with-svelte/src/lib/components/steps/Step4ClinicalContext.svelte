<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import { request } from '#lib/stores/request.svelte.js';

	const d = request.data.context;
</script>

<Fieldset legend="4. Clinical Context">
	<p class="hint">Primary tumour site, relevant history, and recent treatment.</p>

	<Field label="Primary tumour site" inputId="primaryTumourSite">
		<TextInput
			id="primaryTumourSite"
			label="Primary tumour site"
			placeholder="e.g. right upper lobe lung"
			bind:value={d.primaryTumourSite}
		/>
	</Field>

	<Field label="Relevant history" inputId="relevantHistory">
		<TextAreaInput
			id="relevantHistory"
			label="Relevant history"
			rows={3}
			placeholder="Relevant clinical history and context for the referral…"
			bind:value={d.relevantHistory}
		/>
	</Field>

	<Field label="Recent chemotherapy / radiotherapy" inputId="recentChemoRadiotherapy" description="Agent and dates — affects timing and uptake.">
		<TextAreaInput
			id="recentChemoRadiotherapy"
			label="Recent chemotherapy / radiotherapy"
			rows={3}
			placeholder="Agent and dates…"
			bind:value={d.recentChemoRadiotherapy}
		/>
	</Field>
</Fieldset>
