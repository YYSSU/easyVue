/**
 * Created by litao on 2018/8/21.
 */
export default {
    data (){
        return {
            moduleName: undefined,
            listMethod: undefined,
            deleteMethod: undefined,
            createPageName: undefined,
            detailPageName: undefined,
            editPageName: undefined,
            queryFormRef: undefined,
            tableRef: undefined,
            dialogRef: undefined,
            querying: false,
            tableSelections: [],
            queryFormData: {

            },
            page: {
                list: [],
                pageNum: 1,
                pageSize: 5,
                total: 0
            }
        }
    },

    computed: {
        dialogInstance (){
            if(!this.dialogRef)
                throw new Error('未获取到弹窗ref属性');

            return this.$getRef(this.dialogRef);
        }
    },

    mounted (){
        this.__listInit();
    },

    methods: {
        __listInit (){
            this.init();
        },

        //初始化之前
        beforeInit (){

        },

        //初始化
        async init (){
            try {
                this.beforeInit();

                await this.resetQueryFormData();

                this.queryHandler();

                this.afterInit();
            } catch (e) {
                this.$error(e.msg || e.message || e);
            }
        },

        //初始化之后
        afterInit (){

        },

        //重置查询表单
        resetQueryFormData (){
            if(this.queryFormRef){
                let instance = this.$getRef(this.queryFormRef);
                instance.resetFields && instance.resetFields();
            }
        },

        //初始化page数据之前的处理
        beforeInitPageInfo (responseData){
            return responseData;
        },

        //初始化page数据
        initPageInfo (response = {}){
            this.$set(this, 'page', {
                list: response.list || [],
                pageNum: response.pageNum || 0,
                pageSize: response.pageSize || 0,
                total: response.total || 0
            });
        },

        //初始化page数据之后的处理
        afterInitPageInfo (responseData){
            // _console.log(`初始化列表数据完成，返回数据为：${JSON.stringify(responseData)}`);
        },

        //开始查询处理
        async queryHandler({ pageNum, pageSize } = {}) {
            let queryParam = await this.getQueryParam();

            let queryPageParam = await this.getQueryPageParam(pageNum, pageSize);

            queryParam = Object.assign({}, queryParam, queryPageParam);

            let handlerQueryParam = await this.beforeQueryHandler(queryParam);

            queryParam = queryParam || handlerQueryParam;

            this.querying = true;

            this.$openMask(this.tableRef);

            let response = await this.doQuery(queryParam);

            this.$closeMask();

            this.querying = false;

            let responseData = response.data || {};

            let handlerResponse = await this.beforeInitPageInfo(responseData);

            responseData = responseData || handlerResponse;

            await this.initPageInfo(responseData);

            this.afterInitPageInfo(responseData);
        },

        //获取查询条件
        getQueryParam (){
            return this.queryFormData;
        },

        //获取分页参数
        getQueryPageParam (pageNum, pageSize){
            return {
                pageNum: pageNum || this.page.pageNum || this.defaultPageNo,
                pageSize: pageSize || this.page.pageSize || this.defaultPageSize
            }
        },

        //查询之前的处理
        beforeQueryHandler (queryParam){
            return queryParam;
        },

        //执行查询
        async doQuery (queryParam = {}){
            this.checkApi('listMethod');

            return await this.$http(this.moduleName, this.listMethod, queryParam);
        },

        //页码切换
        pageNoToggleHandler (pageNum){
            this.queryHandler({pageNum})
        },

        //条目数切换
        pageSizeToggleHandler (pageSize){
            this.queryHandler({pageSize})
        },

        //列表选中事件
        selectionHandler (selections){
            this.tableSelections = selections;
        },

        //批量删除
        batchDeleteHandler (){
            if(this.tableSelections.length === 0){
                this.$warn('请选择需要删除的数据');
                return;
            }

            this.deleteHandler(this.tableSelections);
        },

        //删除
        deleteHandler (idMaps){
            this.checkApi('deleteMethod');

            return new Promise((resolve, reject) => {
                this.$isOk('是否删除数据？', '删除确认').then(() => {
                    this.$http(this.moduleName, this.deleteMethod, idMaps).then(({state, message, data}) => {
                        if(state === 1){
                            this.$success('删除成功');
                            this.listMethod && this.queryHandler();
                            resolve();
                        }else{
                            this.$error(message || '删除失败');
                            reject();
                        }
                    });
                });
            })
        },

        //要传到新页面的参数
        getToPageParam (params = {}){
            return Object.assign({}, params);
        },

        //新建（弹窗）
        createHandler (title, params = {}){
            this.dialogInstance.show(Object.assign({ title }, this.getToPageParam(params) || {}));
        },

        //查看（弹窗）
        detailHandler (id, title, params = {}){
            this.dialogInstance.show(Object.assign({ id, title, readonly: true }, this.getToPageParam(params) || {}));
        },

        //编辑（弹窗）
        editHandler (id, title, params = {}){
            this.dialogInstance.show(Object.assign({ id, title, readonly: false }, this.getToPageParam(params) || {}));
        },

        //新建（新页面）
        createPageHandler (){
            if(!this.createPageName){
                this.$error('未获取到createPageName属性，请检查！');
                return;
            }
            this.$jump({ name: this.createPageName, params: this.getToPageParam() || {} });
        },

        //查看（新页面）
        detailPageHandler (item = {}){
            let pageName = this.detailPageName || this.editPageName || this.createPageName;
            if(!pageName){
                this.$error('未获取到detailPageName属性，请检查！');
                return;
            }

            let params = Object.assign(this.getToPageParam(item) || {}, {
                readonly: true
            });

            this.$jump({ name: pageName, params: this.$encrypt(params)});
        },

        //编辑（新页面）
        editPageHandler (item = {}){
            let pageName = this.editPageName || this.detailPageName || this.createPageName;
            if(!pageName){
                this.$error('未获取到editPageName属性，请检查！');
                return;
            }
            let params = Object.assign(this.getToPageParam(item) || {}, {
                readonly: false
            });

            this.$jump({ name: pageName, params: this.$encrypt(params)});
        }
    },

    watch: {

    }
}