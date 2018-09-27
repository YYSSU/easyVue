<script>
    let evAttachmentPreviewConfig = {
        name: 'evAttachmentPreview',

        componentName: 'evAttachPreview',

        registryName: 'ev-attachPreview',

        props: {
            url: {
                required: true,
                type: String
            },

            width: String,

            minWidth: String,

            maxWidth: String
        },

        render (h){
            let fileName = this.$slots.default && this.$slots.default.length > 0 ? this.$slots.default[0].text || '' : '';
            return h('span', {
                class: 'ev-attachment-preview',
                domProps: {
                    title: fileName
                },
                style: {
                    'width': this.width || '',
                    'min-width': this.minWidth || '',
                    'max-width': this.maxWidth || '',
                    'margin-right': '2px',
                    'text-align': 'justify'
                },
                on: {
                    click: () => this.$preViewFile(this.url)
                }
            }, [this.$slots.default]);
        }
    };

    export default evAttachmentPreviewConfig;
</script>

<style lang="scss">
    .ev-attachment-preview{
        float: left;
        margin-left: 3px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: inline-block;
        cursor: pointer;
        color: #606266;
        &:hover{
            font-weight: 500;
            color: #333333;
        }
        &:focus{
            color: #606266;
        }
    }
</style>