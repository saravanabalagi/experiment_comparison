<script>
    import { filePath, allowedExtensions } from "./stores";
    import * as path from 'path';
    $: extname = path.extname($filePath).slice(1);
</script>

<style>
    .viewer {
        flex: 1;
    }
</style>

<div class="viewer">
    {$filePath}
    {#if (allowedExtensions.includes(extname))}
        <img alt="Experiment Result" style="height: 700px; width: auto"
            src={`/getImage?path=${$filePath}`} />
    {/if}
</div>
