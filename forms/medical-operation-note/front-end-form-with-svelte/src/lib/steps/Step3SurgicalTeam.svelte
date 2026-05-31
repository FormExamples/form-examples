<script lang="ts">
  import { store } from '$lib/state.svelte.js';
  import type { SurgicalTeamMember } from '$lib/engine/types.js';
  import Fieldset from '$lib/components/ui/Fieldset.svelte';
  import Field from '$lib/components/ui/Field.svelte';
  import TextInput from '$lib/components/ui/TextInput.svelte';
  import Select from '$lib/components/ui/Select.svelte';
  import Button from '$lib/components/ui/Button.svelte';

  function add() {
    const m: SurgicalTeamMember = {
      role: '',
      name: '',
      registrationBody: '',
      registrationNumber: '',
    };
    store.data.team = [...store.data.team, m];
  }

  function remove(index: number) {
    store.data.team = store.data.team.filter((_, i) => i !== index);
  }
</script>

<Fieldset legend="Step 3 — Surgical team">
  <p class="hint">
    Record the lead surgeon, assistants, anaesthetist, ODP, scrub nurse,
    circulating nurse, and any students present.
  </p>

  {#each store.data.team as member, i (i)}
    <div class="field-grid field-grid-4" style="margin-bottom:0.5rem;">
      <Field label="Role">
        <Select label="Role" bind:value={member.role}>
          <option value="">—</option>
          <option value="lead-surgeon">Lead surgeon</option>
          <option value="first-assistant">First assistant</option>
          <option value="second-assistant">Second assistant</option>
          <option value="anaesthetist">Anaesthetist</option>
          <option value="odp">ODP</option>
          <option value="scrub-nurse">Scrub nurse</option>
          <option value="circulating-nurse">Circulating nurse</option>
          <option value="student">Student</option>
          <option value="other">Other</option>
        </Select>
      </Field>
      <Field label="Name">
        <TextInput label="Name" bind:value={member.name} />
      </Field>
      <Field label="Reg. body">
        <Select label="Registration body" bind:value={member.registrationBody}>
          <option value="">—</option>
          <option value="GMC">GMC</option>
          <option value="NMC">NMC</option>
          <option value="HCPC">HCPC</option>
          <option value="other">Other</option>
        </Select>
      </Field>
      <Field label="Reg. number">
        <div style="display:flex; gap:0.5rem;">
          <TextInput label="Registration number" bind:value={member.registrationNumber} />
          <Button data-variant="danger" onclick={() => remove(i)}>Remove</Button>
        </div>
      </Field>
    </div>
  {/each}

  <div class="button-group">
    <Button onclick={add}>Add team member</Button>
  </div>
</Fieldset>
