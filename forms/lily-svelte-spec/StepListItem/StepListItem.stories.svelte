<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import StepListItem from './StepListItem.svelte';

  const { Story } = defineMeta({
    title: 'Headless/StepListItem',
    component: StepListItem,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{ status: 'in-progress', current: true }}
>
  Shipping
</Story>
