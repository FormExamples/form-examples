<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	import { assessment } from '$lib/stores/assessment.svelte';

	const ros = assessment.data.reviewOfSystems;
</script>

<Fieldset legend="Review of Systems">
	<p class="hint">Please note any current symptoms in each area. Leave blank if none.</p>
	<Field label="Constitutional (fever, weight changes, fatigue)" inputId="constitutional"><TextAreaInput id="constitutional" label="Constitutional (fever, weight changes, fatigue)" placeholder="e.g. unexplained weight loss, persistent fatigue" bind:value={ros.constitutional} /></Field>

	<Field label="HEENT (Head, Eyes, Ears, Nose, Throat)" inputId="heent"><TextAreaInput id="heent" label="HEENT (Head, Eyes, Ears, Nose, Throat)" placeholder="e.g. headaches, vision changes, hearing loss" bind:value={ros.heent} /></Field>

	<Field label="Cardiovascular" inputId="cardiovascular"><TextAreaInput id="cardiovascular" label="Cardiovascular" placeholder="e.g. chest pain, palpitations, shortness of breath on exertion" bind:value={ros.cardiovascular} /></Field>

	<Field label="Respiratory" inputId="respiratory"><TextAreaInput id="respiratory" label="Respiratory" placeholder="e.g. cough, wheezing, shortness of breath" bind:value={ros.respiratory} /></Field>

	<Field label="Gastrointestinal" inputId="gastrointestinal"><TextAreaInput id="gastrointestinal" label="Gastrointestinal" placeholder="e.g. nausea, abdominal pain, changes in bowel habits" bind:value={ros.gastrointestinal} /></Field>

	<Field label="Genitourinary" inputId="genitourinary"><TextAreaInput id="genitourinary" label="Genitourinary" placeholder="e.g. urinary frequency, pain, blood in urine" bind:value={ros.genitourinary} /></Field>

	<Field label="Musculoskeletal" inputId="musculoskeletal"><TextAreaInput id="musculoskeletal" label="Musculoskeletal" placeholder="e.g. joint pain, stiffness, swelling" bind:value={ros.musculoskeletal} /></Field>

	<Field label="Neurological" inputId="neurological"><TextAreaInput id="neurological" label="Neurological" placeholder="e.g. numbness, tingling, weakness, seizures" bind:value={ros.neurological} /></Field>

	<Field label="Psychiatric" inputId="psychiatric"><TextAreaInput id="psychiatric" label="Psychiatric" placeholder="e.g. anxiety, depression, sleep disturbance" bind:value={ros.psychiatric} /></Field>

	<Field label="Skin" inputId="skin"><TextAreaInput id="skin" label="Skin" placeholder="e.g. rashes, lesions, changes in moles" bind:value={ros.skin} /></Field>
</Fieldset>
