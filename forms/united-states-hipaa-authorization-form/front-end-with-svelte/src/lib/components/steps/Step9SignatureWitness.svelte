<script lang="ts">
	import { authorization } from '#lib/stores/authorization.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';

	const d = authorization.data.signatureWitness;

	function toggle(key: 'individualSignatureConfirmed' | 'witnessSignatureConfirmed', event: Event) {
		d[key] = (event.currentTarget as HTMLInputElement).checked ? 'yes' : '';
	}
</script>

<Fieldset legend="Signature, witness & date">
	<p class="hint">Confirm signature and add witness details. A signature and date are required core elements.</p>

	<div class="checkbox-group">
		<label class="field">
			<input
				type="checkbox"
				class="checkbox-input"
				id="signatureWitness-individualSignatureConfirmed"
				name="signatureWitness-individualSignatureConfirmed"
				checked={d.individualSignatureConfirmed === 'yes'}
				onchange={(e) => toggle('individualSignatureConfirmed', e)}
			/>
			<span>I have signed this authorization.</span>
		</label>
	</div>

	<Field label="Signature date" required inputId="signatureWitness-signatureDate">
		<DateInput id="signatureWitness-signatureDate" label="Signature date" required bind:value={d.signatureDate} />
	</Field>

	<Field label="Witness name" inputId="signatureWitness-witnessName">
		<TextInput id="signatureWitness-witnessName" label="Witness name" bind:value={d.witnessName} />
	</Field>

	<Field label="Witness date" inputId="signatureWitness-witnessDate">
		<DateInput id="signatureWitness-witnessDate" label="Witness date" bind:value={d.witnessDate} />
	</Field>

	<div class="checkbox-group">
		<label class="field">
			<input
				type="checkbox"
				class="checkbox-input"
				id="signatureWitness-witnessSignatureConfirmed"
				name="signatureWitness-witnessSignatureConfirmed"
				checked={d.witnessSignatureConfirmed === 'yes'}
				onchange={(e) => toggle('witnessSignatureConfirmed', e)}
			/>
			<span>Witness has signed.</span>
		</label>
	</div>
</Fieldset>
