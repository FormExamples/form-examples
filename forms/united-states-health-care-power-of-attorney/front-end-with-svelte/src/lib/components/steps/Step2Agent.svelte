<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';

  const a = assessment.data.agent;
</script>

<Fieldset legend="Step 2 of 6 — Agent and successors">
  <p class="hint">
    The person who will make health care decisions if you cannot, and the people who step in if the
    agent cannot.
  </p>

  <Field label="Agent — full name" inputId="agent-agentName">
    <TextInput id="agent-agentName" label="Agent — full name" bind:value={a.agentName} />
  </Field>
  <Field label="Relationship to the principal" inputId="agent-agentRelationship">
    <Select
      id="agent-agentRelationship"
      label="Relationship to the principal"
      bind:value={a.agentRelationship}
    >
      <option value="">— Select —</option>
      <option value="spouse">Spouse or partner</option>
      <option value="adult-child">Adult child</option>
      <option value="parent">Parent</option>
      <option value="sibling">Sibling</option>
      <option value="other-relative">Other relative</option>
      <option value="friend">Friend</option>
      <option value="other">Other</option>
    </Select>
  </Field>
  <Field label="Agent age (years)" inputId="agent-agentAge">
    <NumberInput
      id="agent-agentAge"
      label="Agent age (years)"
      min={0}
      max={120}
      bind:value={a.agentAge}
    />
  </Field>
  <p class="hint">The agent must be an adult (18 or older).</p>
  <Field label="Agent phone" inputId="agent-agentPhone">
    <TextInput id="agent-agentPhone" label="Agent phone" bind:value={a.agentPhone} />
  </Field>
  <Field
    label="Is the agent the principal's health care provider, or that provider's employee?"
    inputId="agent-agentIsHealthCareProvider"
  >
    <Select
      id="agent-agentIsHealthCareProvider"
      label="Is the agent the principal's health care provider, or that provider's employee?"
      bind:value={a.agentIsHealthCareProvider}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <Field
    label="Does the agent operate or work at the facility where the principal is a patient?"
    inputId="agent-agentIsFacilityEmployee"
  >
    <Select
      id="agent-agentIsFacilityEmployee"
      label="Does the agent operate or work at the facility where the principal is a patient?"
      bind:value={a.agentIsFacilityEmployee}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <Field
    label="Is the agent related to the principal by blood, marriage, or adoption?"
    inputId="agent-agentRelatedToPrincipal"
  >
    <Select
      id="agent-agentRelatedToPrincipal"
      label="Is the agent related to the principal by blood, marriage, or adoption?"
      bind:value={a.agentRelatedToPrincipal}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <Field label="Has the agent agreed to serve?" inputId="agent-agentAccepted">
    <Select
      id="agent-agentAccepted"
      label="Has the agent agreed to serve?"
      bind:value={a.agentAccepted}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <Field label="First successor agent" inputId="agent-successor1Name">
    <TextInput
      id="agent-successor1Name"
      label="First successor agent"
      bind:value={a.successor1Name}
    />
  </Field>
  <Field label="First successor phone" inputId="agent-successor1Phone">
    <TextInput
      id="agent-successor1Phone"
      label="First successor phone"
      bind:value={a.successor1Phone}
    />
  </Field>
  <Field label="Second successor agent" inputId="agent-successor2Name">
    <TextInput
      id="agent-successor2Name"
      label="Second successor agent"
      bind:value={a.successor2Name}
    />
  </Field>
</Fieldset>
