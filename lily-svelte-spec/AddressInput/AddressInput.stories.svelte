<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import AddressInput from './AddressInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/AddressInput',
    component: AddressInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'AddressInput'}}
>
  <span>AddressInput</span>
</Story>
