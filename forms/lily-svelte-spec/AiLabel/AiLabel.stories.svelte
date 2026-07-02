<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import AiLabel from './AiLabel.svelte';

  const { Story } = defineMeta({
    title: 'Headless/AiLabel',
    component: AiLabel,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Ai Label'}}
/>
