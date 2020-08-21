<script>
    let imageFileValue;
    let imageFilePathValue;
    import { imageFile, imageFilePath } from "./stores";
    const unsubscribeImageFile = imageFile.subscribe(val => imageFileValue = val);
    const unsubscribeImageFilePath = imageFilePath.subscribe(val => imageFilePathValue = val);
</script>

<style>
    .viewer {
        flex: 1;
    }
</style>

<div class="viewer">
    {imageFilePathValue+'/'+imageFileValue}
    {#if imageFileValue && imageFilePathValue}
        <img alt="Experiment Result" style="height: 700px; width: auto"
            src={`/getImage?path=${imageFilePathValue}/${imageFileValue}`} />
    {/if}
</div>
