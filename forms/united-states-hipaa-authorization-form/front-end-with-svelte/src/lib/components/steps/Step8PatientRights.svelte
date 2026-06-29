<script lang="ts">
	import { authorization } from '$lib/stores/authorization.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';

	const d = authorization.data.patientRightsAcknowledgement;

	const acknowledgements: {
		key: keyof typeof d;
		label: string;
	}[] = [
		{ key: 'acknowledgedRightToRevoke', label: 'I understand I may revoke this authorization in writing at any time.' },
		{ key: 'acknowledgedNoConditioning', label: 'I understand my treatment, payment, enrolment, or eligibility for benefits may not be conditioned on signing.' },
		{ key: 'acknowledgedRedisclosureWarning', label: 'I understand the information may be re-disclosed by the recipient and no longer protected by the Privacy Rule.' },
		{ key: 'acknowledgedRightToCopy', label: 'I understand I have the right to receive a copy of this signed form.' }
	];

	function toggle(key: keyof typeof d, event: Event) {
		d[key] = (event.currentTarget as HTMLInputElement).checked ? 'yes' : '';
	}
</script>

<Fieldset legend="Patient rights acknowledgements">
	<p class="hint">Confirm each statement below.</p>

	<div class="checkbox-group">
		{#each acknowledgements as ack (ack.key)}
			<label class="field">
				<input
					type="checkbox"
					class="checkbox-input"
					id={`patientRights-${ack.key}`}
					name={`patientRights-${ack.key}`}
					checked={d[ack.key] === 'yes'}
					onchange={(e) => toggle(ack.key, e)}
				/>
				<span>{ack.label}</span>
			</label>
		{/each}
	</div>
</Fieldset>
