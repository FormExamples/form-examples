<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import MedicalBanner from './MedicalBanner.svelte';

  const { Story } = defineMeta({
    title: 'Headless/MedicalBanner',
    component: MedicalBanner,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Medical Banner'}}
>
  <p>Banner message</p>
</Story>
