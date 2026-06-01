<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import GraphicBlock from './GraphicBlock.svelte';

  const { Story } = defineMeta({
    title: 'Headless/GraphicBlock',
    component: GraphicBlock,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{
    label: "Sample chart",
    title: "Quarterly revenue",
    description: "Revenue across Q1–Q4 2025.",
    notes: "Source: internal data"
  }}
>
  <div role="img" aria-label="Chart placeholder">[chart goes here]</div>
</Story>
