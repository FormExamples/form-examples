<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import LiechtensteinPassportNumberView from './LiechtensteinPassportNumberView.svelte';

  const { Story } = defineMeta({
    title: 'Headless/LiechtensteinPassportNumberView',
    component: LiechtensteinPassportNumberView,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Liechtenstein Passport Number View'}}
/>
