<script>
    import {operationMode, operationModes} from './stores';
</script>

<div>
    Operation Mode
    {#each Object.entries(operationModes) as oMode}
        <label>
            <input type="radio" bind:group={$operationMode} value={oMode[1]} />
            {oMode[0]}
        </label>
    {/each}
</div>
