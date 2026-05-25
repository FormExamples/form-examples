<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import StepList from './StepList.svelte';

  const { Story } = defineMeta({
    title: 'Headless/StepList',
    component: StepList,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{ label: 'Checkout', current: 1 }}
>
  <li>Cart</li>
  <li>Shipping</li>
  <li>Payment</li>
</Story>
