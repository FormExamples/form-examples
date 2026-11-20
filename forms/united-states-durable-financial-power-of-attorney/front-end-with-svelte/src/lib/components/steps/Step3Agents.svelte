<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';

  const a = assessment.data.agents;
</script>

<Fieldset legend="Step 3 of 6 — Agent and successors">
  <p class="hint">
    The person or institution who will act, who acts if they cannot, and how they are paid. New York
    and Pennsylvania require the agent’s acknowledgment.
  </p>

  <Field label="Agent full name" inputId="agents-agentName">
    <TextInput id="agents-agentName" label="Agent full name" bind:value={a.agentName} />
  </Field>
  <Field label="Agent relationship" inputId="agents-agentRelationship">
    <Select
      id="agents-agentRelationship"
      label="Agent relationship"
      bind:value={a.agentRelationship}
    >
      <option value="">— Select —</option>
      <option value="spouse">Spouse</option>
      <option value="child">Child</option>
      <option value="other-family">Other family member</option>
      <option value="friend">Friend</option>
      <option value="professional">Professional fiduciary</option>
      <option value="financial-institution">Financial institution with trust powers</option>
    </Select>
  </Field>
  <Field
    label="Agent is an adult (18+) individual or a qualifying institution?"
    inputId="agents-agentIsAdult"
  >
    <Select
      id="agents-agentIsAdult"
      label="Agent is an adult (18+) individual or a qualifying institution?"
      bind:value={a.agentIsAdult}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <Field
    label="Agent has signed the acknowledgment of duties?"
    inputId="agents-agentSignedAcknowledgment"
  >
    <Select
      id="agents-agentSignedAcknowledgment"
      label="Agent has signed the acknowledgment of duties?"
      bind:value={a.agentSignedAcknowledgment}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <Field label="Successor agent full name" inputId="agents-successorAgentName">
    <TextInput
      id="agents-successorAgentName"
      label="Successor agent full name"
      bind:value={a.successorAgentName}
    />
  </Field>
  <Field label="Single agent or co-agents" inputId="agents-coAgentsMode">
    <Select id="agents-coAgentsMode" label="Single agent or co-agents" bind:value={a.coAgentsMode}>
      <option value="">— Select —</option>
      <option value="sole">One agent acts alone</option>
      <option value="jointly">Co-agents must act jointly</option>
      <option value="independently">Co-agents may act independently</option>
    </Select>
  </Field>
  <Field label="Agent compensation" inputId="agents-compensation">
    <Select id="agents-compensation" label="Agent compensation" bind:value={a.compensation}>
      <option value="">— Select —</option>
      <option value="none">No compensation</option>
      <option value="reasonable">Reasonable compensation</option>
      <option value="fixed">Fixed compensation</option>
    </Select>
  </Field>
  <Field label="Fixed annual compensation (USD)" inputId="agents-compensationAmount">
    <NumberInput
      id="agents-compensationAmount"
      label="Fixed annual compensation (USD)"
      min={0}
      bind:value={a.compensationAmount}
    />
  </Field>
</Fieldset>
