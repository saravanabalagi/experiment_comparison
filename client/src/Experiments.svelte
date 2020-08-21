<script>
    import Experiments from "./Experiments.svelte";
    import { imageFile, imageFilePath } from "./stores";
    export let fetchFiles;
    export let path;
    export let level;
    let chosenFolder = null;
    let chosenFile = null;
    let imageFilePathValue = null;

    const unsubscribeImageFilePath =  imageFilePath.subscribe(val => imageFilePathValue = val);

    function setChosenFolder() {
        if(imageFilePathValue) {
            let pathTokens = path.split('/');
            pathTokens[level+1] = chosenFolder.name;
            imageFilePath.set(pathTokens.join('/'));
        } else imageFilePath.set(`${path}/${chosenFolder.name}`);
    }
    function setChosenFile() { imageFile.set(chosenFile.name); }
</script>

{#await fetchFiles(path)}
    Loading experiment files...
{:then expFiles}
    <div class="files" style="margin-left: {(level-1)*20}px">
        {#each expFiles as file}
            {#if file.directory}
                <label>
                    <input type=radio bind:group={chosenFolder} value={file} on:change={setChosenFolder}>
                    {file.name}
                </label>
            {:else if [".png", ".jpg", ".jpeg"].some(e => file.name.endsWith(e))}
                <label>
                    <input type=radio bind:group={chosenFile} value={file} on:change={setChosenFile}>
                    {file.name}
                </label>
            {/if}
        {/each}
    </div>
{:catch error}
    Error: {error}
{/await}

{#if chosenFolder}
    <Experiments path={`${path}/${chosenFolder.name}`} folder={chosenFolder} fetchFiles={fetchFiles} level={level+1} />
{/if}