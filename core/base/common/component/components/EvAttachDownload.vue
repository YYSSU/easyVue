<script>
    let evAttachDownloadConfig = {
        name: 'evAttachDownload',

        componentName: 'evAttachDownload',

        registryName: 'ev-attachDownLoad',

        props: {
            url: {
                required: true,
                type: String
            }
        },

        render (h){
            return h('i', {
                class: 'ev-attachment-download iconfont icon-xiazai',
                style: {
                    color: '#f6b160',
                    'font-weight': 'bolder',
                    'font-size': '14px',
                    'cursor': 'pointer',
                    'float': 'left'
                },
                on: {
                    click: () => this.$downloadAttach(this.url)
                }
            })
        }
    };

    export default evAttachDownloadConfig;
</script>

<style lang="scss">
    .ev-attachment-download:hover{
        color: #fd8800 !important;
    }
</style>