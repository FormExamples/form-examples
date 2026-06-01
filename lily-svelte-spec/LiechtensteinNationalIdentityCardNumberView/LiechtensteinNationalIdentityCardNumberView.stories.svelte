<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import LiechtensteinNationalIdentityCardNumberView from './LiechtensteinNationalIdentityCardNumberView.svelte';

  const { Story } = defineMeta({
    title: 'Headless/LiechtensteinNationalIdentityCardNumberView',
    component: LiechtensteinNationalIdentityCardNumberView,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Liechtenstein National Identity Card Number View'}}
/>
