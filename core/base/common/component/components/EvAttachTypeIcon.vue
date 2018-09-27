<script>
    let evAttachmentTypeIconConfig = {
        name: 'evAttachmentTypeIcon',

        componentName: 'evAttachTypeIcon',

        registryName: 'ev-attachTypeIcon',

        props: {
            type: {
                required: true,
                type: String
            }
        },

        render (h){
            switch (this.type){
                case 'doc':
                case 'docx':
                    return rn('icon-word1', 'rgb(77, 157, 232)');
                case 'xls':
                case 'xlsx':
                    return rn('icon-excel', 'rgb(90, 204, 155)');
                case 'ppt':
                case 'pptx':
                    return rn('icon-ppt', 'rgb(223, 102, 57)');
                case 'jpeg':
                case 'jpg':
                case 'gif':
                case 'png':
                case 'psd':
                    return rn('icon-png', 'rgb(73, 201, 167)');
                case 'zip':
                case 'rar':
                case '7z':
                case 'gz':
                case 'gzip':
                case 'tar':
                    return rn('icon-zip', 'rgb(129, 153, 175)');
                default :
                    return rn('icon-wenjian');
            }
            
            function rn(name, color) {
                return h('i', {
                    class: `ev-attachment-icon iconfont ${name}`,
                    style: {
                        color: color,
                        float: 'left'
                    }
                });
            }
        }
    };

    export default evAttachmentTypeIconConfig;
</script>