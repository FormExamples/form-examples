<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	import { assessment } from '$lib/stores/assessment.svelte';

	const w = assessment.data.otherWishes;
</script>

<Fieldset legend="Other Wishes">
	<p class="hint">Preferences that inform your care (these are NOT legally binding)</p>
	<div class="mb-4 rounded-lg border border-warning/40 bg-warning/10 p-4 text-sm text-warning">
		<p class="font-semibold">Please note</p>
		<p class="mt-1">This section records your preferences and wishes. Unlike the treatment refusals in the previous sections, these wishes are <strong>not legally binding</strong> but will be taken into account by healthcare professionals when planning your care.</p>
	</div>

	<Field label="Preferred Care Setting" inputId="preferredCareSetting"><TextAreaInput id="preferredCareSetting" label="Preferred Care Setting" rows={3} placeholder="e.g. 'I wish to remain at home if possible' or 'I would prefer to be in a hospice'" bind:value={w.preferredCareSetting} /></Field>

	<Field label="Comfort Measures" inputId="comfortMeasures"><TextAreaInput id="comfortMeasures" label="Comfort Measures" rows={3} placeholder="e.g. 'Please ensure adequate pain relief' or 'I would like to listen to music'" bind:value={w.comfortMeasures} /></Field>

	<Field label="Spiritual or Religious Wishes" inputId="spiritualReligiousWishes"><TextAreaInput id="spiritualReligiousWishes" label="Spiritual or Religious Wishes" rows={3} placeholder="Any spiritual, religious, or cultural preferences for your care" bind:value={w.spiritualReligiousWishes} /></Field>

	<Field label="Other Preferences" inputId="otherPreferences"><TextAreaInput id="otherPreferences" label="Other Preferences" rows={3} placeholder="Any other wishes or preferences about your care" bind:value={w.otherPreferences} /></Field>
</Fieldset>
