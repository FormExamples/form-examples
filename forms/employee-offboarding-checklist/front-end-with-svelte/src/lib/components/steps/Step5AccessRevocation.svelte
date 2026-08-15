<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import YesNoRadio from '#lib/components/ui/YesNoRadio.svelte';

	const d = assessment.data.accessRevocation;
</script>

<Fieldset legend="Access Revocation">
	<p class="hint">Confirm every digital and physical access channel has been revoked. These are security-critical.</p>

	<div class="grid gap-4 sm:grid-cols-2">
		<Field label="Email account revoked">
			<YesNoRadio label="Email account revoked" name="emailRevoked" bind:value={d.emailRevoked} />
		</Field>
		<Field label="EHR / EPR access revoked">
			<YesNoRadio label="EHR / EPR access revoked" name="ehrEprRevoked" bind:value={d.ehrEprRevoked} />
		</Field>
		<Field label="VPN access revoked">
			<YesNoRadio label="VPN access revoked" name="vpnRevoked" bind:value={d.vpnRevoked} />
		</Field>
		<Field label="Active Directory account disabled">
			<YesNoRadio label="Active Directory account disabled" name="activeDirectoryDisabled" bind:value={d.activeDirectoryDisabled} />
		</Field>
		<Field label="Building access revoked">
			<YesNoRadio label="Building access revoked" name="buildingAccessRevoked" bind:value={d.buildingAccessRevoked} />
		</Field>
		<Field label="Cloud applications access revoked">
			<YesNoRadio label="Cloud applications access revoked" name="cloudAppsRevoked" bind:value={d.cloudAppsRevoked} />
		</Field>
		<Field label="Smartcard deactivated">
			<YesNoRadio label="Smartcard deactivated" name="smartcardDeactivated" bind:value={d.smartcardDeactivated} />
		</Field>
		<Field label="Data download / export audit performed">
			<YesNoRadio label="Data download / export audit performed" name="dataDownloadAuditPerformed" bind:value={d.dataDownloadAuditPerformed} />
		</Field>
		<Field label="Unauthorised data download detected">
			<YesNoRadio label="Unauthorised data download detected" name="unauthorisedDownloadDetected" bind:value={d.unauthorisedDownloadDetected} />
		</Field>
	</div>

	<Field label="Notes" inputId="accessRevocationNotes">
		<TextAreaInput id="accessRevocationNotes" label="Notes" rows={3} bind:value={d.accessRevocationNotes} />
	</Field>
</Fieldset>
