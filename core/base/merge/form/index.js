/**
 * Created by litao on 2018/8/21.
 */
export default {
    data (){
        return {
            pageType: 'page',
            moduleName: undefined,
            getMethod: undefined,
            submitMethod: undefined,
            editFormRef: undefined,
            formData: {
                id: undefined
            },
            title: undefined,
            visible: false,
            readonly: true,
            submiting: false,
            parentParam: {}
        }
    },

    mounted (){
        this.readonly = this.$routeParams ? this.$routeParams.readonly : false || false;
        if(this.pageType === 'page')
            this.__formInit();
    },

    methods: {
        getFormInstance (){
            return this.$getRef(this.editFormRef);
        },

        show (params){
            this.parentParam  = params || {};
            this.title = params.title;
            this.readonly = params.readonly;
            this.visible = true;
            this.id = params.id;
            this.__formInit();
        },

        beforeInit (){

        },

        __formInit (){
            this.beforeInit();
            this.initForm();
            this.afterInit();
        },

        afterInit (){

        },

        async initForm (){
            this.resetFormDataInfo();

            this.beforeLoadFormDataInfo();

            let formDataInfo = {};

            if(this.isLoadDataInfo()){ //查看 or 编辑
                let loadParams = this.getLoadInfoParams();
                formDataInfo = await this.loadFormDataInfo(loadParams);
            }

            let responseData = formDataInfo.data || {};

            let handlerResponse = await this.afterLoadFormDataInfo(responseData);

            handlerResponse = handlerResponse || responseData;

            await this.initFormDataInfo(handlerResponse);

            this.afterInitFormData(handlerResponse);
        },

        //获取加载详情时的参数
        getLoadInfoParams (){
            return { id: this.$routeParams.id || this.id };
        },

        //重置表单数据
        resetFormDataInfo (){
            this.getFormInstance() && this.getFormInstance().resetFields && this.getFormInstance().resetFields();
        },

        //加载表单数据之前
        beforeLoadFormDataInfo (){

        },

        //是否加载表单数据
        isLoadDataInfo (){
            return (this.$routeParams && this.$routeParams.id) || (this.parentParam && this.parentParam.id);
        },

        //加载表单数据之后
        afterLoadFormDataInfo (responseData){
            // _console.log(`初始化表单数据完成，返回数据为：${JSON.stringify(responseData)}`);
        },

        //加载表单数据
        async loadFormDataInfo (queryParam = {}){
            this.checkApi('getMethod');

            this.$openMask(this.editFormRef);

            let response = await this.$http(this.moduleName, this.getMethod, queryParam);

            this.$closeMask();

            return response;
        },

        //初始化表单数据
        initFormDataInfo (responseData){
            this.$set(this, 'formData', responseData);
        },

        //初始化表单数据之后的操作
        afterInitFormData (){

        },

        //提交表单数据
        submitHandler (callback){
            this.checkApi('submitMethod');

            if(this.submiting){
                this.$info('不要心急哦，已经在提交的路上了！');
                return;
            }

            this.getFormInstance() && this.getFormInstance().validate(valid => {
                if (valid) {
                    this.submiting = true;
                    this.$openMask(this.editFormRef, '正在提交...');
                    let formData = this.getEditFormDataInfo();
                    try {
                        if(this.beforeSubmit(formData)){
                            this.$http(this.moduleName, this.submitMethod, formData).then(response => {
                                this.submitSuccess(response);
                                callback && typeof callback === 'function' && callback(response);
                                this.submiting = false;
                                this.$closeMask();
                            }).catch(error => {
                                this.submiting = false;
                                this.$closeMask();
                                this.submitError(error);
                            });
                        }
                    } catch (error) {
                        this.$closeMask();
                        this.submiting = false;
                        if(error && error.message){
                            this.$error(error.message || error);
                        }
                    }
                } else {
                    this.submiting = false;
                    return false;
                }
            })
        },

        //获取表单数据
        getEditFormDataInfo (){
            return this.formData || {};
        },

        //提交之前的处理 返回false则不进行提交操作
        beforeSubmit (submitFormData){
            return true;
        },

        //提交成功之后的处理
        submitSuccess (response){
            this.$success("提交成功");
            this.visible = false;
            this.$parent && this.$parent.queryHandler && typeof this.$parent.queryHandler === 'function' && this.$parent.queryHandler();
        },

        //提交失败之后的处理
        submitError (error){

        },

        //取消编辑
        cancelEdit (){
            let match = this.$route.matched;
            if(match && match.length - 2 > -1){
                this.$jump({ name: match[match.length - 2].name });
                return;
            }
            this.$jump({ name: 'homepage' });
        },

        //弹框关闭事件
        dialogCloseHandler (){
            if(this.visible){
                this.visible = false;
            }else{
                this.$closeMask();
                this.resetFormDataInfo();
            }
        }
    },

    watch: {

    }
}