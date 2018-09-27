<script>
    import wangEditor from 'wangeditor';

    import Vue from 'vue';

    let evEditor_wangConfig = {
        name: 'evEditor_wang',

        componentName: 'evEditor_wang',

        registryName: 'ev-editor',

        props: {
            value: {
                required: true
            },
            uploadImgUrl: String,
            disabled: Boolean,
            excludeMenus: Array
        },

        render (h){
            return h('div', {
                style: {
                    width: '100%',
                    height: '100%'
                }
            }, [
                h('div', {
                    ref: 'editorContainerRef'
                }),
                h('el-upload', {
                    ref: 'editorAttachUploadRef',
                    props: {
                        multiple: true,
                        action: '/sysAttachment/upload',
                        onSuccess: this.uploadSuccess
                    },
                    style: {
                        display: 'none'
                    }
                }, [
                    h('i', {
                        class: 'el-icon-upload'
                    })
                ])
            ]);
        },

        data (){
            return {
                editorInstance: undefined
            }
        },

        created (){
            this.addAttachUpload();
        },

        mounted (){
            setTimeout(() => {
                this.init();
            }, 0);
        },

        methods: {
            init (){
                const _self = this;
                if(!this.$el) return;
                this.editorInstance = new wangEditor(this.$getRef('editorContainerRef'));

                this.editorInstance.config.menus = wangEditor.config.menus.filter(menuCode => !['source', 'location'].concat(this.excludeMenus || []).includes(menuCode)).concat('lineheight');

                if(!this.editorInstance.config.menus.includes('customUploadAttach') && (!this.excludeMenus || !this.excludeMenus.includes('customUploadAttach'))){
                    this.editorInstance.config.menus.push('customUploadAttach');
                }

                if(this.uploadImgUrl){
                    this.editorInstance.config.hideLinkImg = true;
                    this.editorInstance.config.uploadImgUrl = this.uploadImgUrl;
                    this.editorInstance.config.uploadImgFileName = 'file';
                    this.editorInstance.config.uploadImgFns.onload = function(resultText, xhr){
                        if(xhr.status === 200 && resultText){
                            try {
                                let { state, data, message } = JSON.parse(resultText);
                                if(state === 1){
//                                    let imgUrl = 'https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=1742588870,3338565942&fm=55&app=22&f=JPEG?w=121&h=81&s=6F322BC64ED2859A9904699203008091';
                                    let imgUrl = data.previewurl;
                                    let img = document.createElement('img');
                                    img.onload = () => {
                                        let html = '<img src="' + imgUrl + '" style="max-width:100%;"/>';
                                        this.command(null, 'insertHtml', html);
                                    };
                                    img.onerror = function () {
                                        _self.$error('图片插入异常，图片地址已打印在控制台');
                                        console.log('图片插入地址: ', imgUrl);
                                    }
                                    img.src = imgUrl;
                                }else{
                                    throw new Error(message);
                                }
                            } catch (e) {
                                console.log(e);
                                _self.$error('图片上传异常');
                            }
                        }else{
                            _self.$error('图片上传异常');
                        }
                    };
                }
                this.editorInstance.onchange = function () {
                    let html = this.$txt.html();
                    _self.$emit('input', html);
                };
                this.editorInstance.create();

                this.setEditorValue(this.value);
                if(this.disabled){
                    this.editorInstance.disable();
                }else{
                    this.editorInstance.enable();
                }

                console.log('editor: ', this.editorInstance);
            },

            uploadSuccess (response, file, fileList){
                if(response.state === 1){
                    let aDom = document.createElement('a');
                    aDom.target = '_blank';
                    aDom.href = response.data.previewurl;
                    aDom.innerHTML = response.data.oldname;
                    this.editorInstance.$txt.append(aDom);
                }else{
                    this.$error('附件上传失败');
                }
            },

            addAttachUpload (){
                const _self = this;

                let $ = require('jquery');

                wangEditor.createMenu(function (check) {

                    let editor = this;
                    let menuId = 'customUploadAttach';

//                    if(check(menuId)){
//                        throw new Error(`wangeditor扩展菜单异常，菜单id[${menuId}]已存在`);
//                    }

                    let menu = new wangEditor.Menu({
                        editor: editor,  // 编辑器对象
                        id: menuId,  // 菜单id
                        title: '上传附件', // 菜单标题

                        $domNormal: $('<a href="#" tabindex="-1" class="selected"><i class="el-icon-upload"></i></a>'),
                        $domSelected: $('<a href="#" tabindex="-1" class="selected"><i class="el-icon-upload"></i></a>')
                    });

                    // 菜单正常状态下，点击将触发该事件
                    menu.clickEvent = function (e) {
                        let attachUplaodInstance = _self.$getRef('editorAttachUploadRef');
                        attachUplaodInstance.$slots.default[0].elm.click();
                    };

                    // 增加到editor对象中
                    editor.menus[menuId] = menu;
                });
            },

            setEditorValue (value){
                this.editorInstance.$txt.html(value);
            },

            editorDestroy (){
                this.editorInstance && this.editorInstance.destroy();
            },

            editorUnDestroy (){
                this.editorInstance && this.editorInstance.undestroy();
            }
        }
    };

    export default evEditor_wangConfig;
</script>

<style lang="scss">
    .wangEditor-container{
        border: none;
        & .wangEditor-txt{
            height: calc(100% - 37px) !important;
            padding: 5px 10px !important;
            & p, & h1, & h2, & h3, & h4, & h5{
                margin: 0 !important;
            }
        }
        & .wangEditor-menu-container .menu-item{
            width: 30px !important;
        }
    }
</style>