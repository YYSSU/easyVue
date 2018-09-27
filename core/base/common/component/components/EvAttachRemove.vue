<script>
    let evAttachRemoveConfig = {
        name: 'evAttachRemove',

        componentName: 'evAttachRemove',

        registryName: 'ev-attachRemove',

        props: {
            id: {
                required: true,
            }
        },

        render (h){
            return h('i', {
                class: 'ev-attachment-remove iconfont icon-shanchu',
                style: {
                    color: '#f6b160',
                    'font-weight': 'bolder',
                    'font-size': '14px',
                    'cursor': 'pointer',
                    'float': 'left',
                    'margin-left': '3px'
                },
                on: {
                    click: () => {
                        if(!this.id){
                            this.$error('新上传的文件，保存后才可删除');
                            return;
                        }
                        this.$isOk('确认删除该附件吗？', '附件删除').then(() => {
                            this.$http('common', 'removeAttach', { id: this.id }).then(() => {
                                this.$success('附件删除成功');
                                this.$emit('attach-remove-after', this.id, true);
                            }).catch(() => {
                                this.$emit('attach-remove-after', id, false);
                            })
                        });
                    }
                }
            })
        }
    };

    export default evAttachRemoveConfig;
</script>

<style lang="scss">
    .ev-attachment-remove:hover{
        color: #fd8800 !important;
    }
</style>