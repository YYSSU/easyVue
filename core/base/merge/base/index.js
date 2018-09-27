/**
 * Created by litao on 2018/8/21.
 */
export default {
    props: ['routeParams'],

    data (){
        return {
            $routeParams: undefined,
            defaultPageNo: 1,
            defaultPageSize: 8
        }
    },

    methods: {
        initRouteParams (){
            if(!this.routeParams){
                _console.log(`[${this.$route.meta ? this.$route.meta.title : this.$route.name || this.$route.name}]无参数传递`);
                this.$routeParams = {};
                return;
            }
            _console.log('$routeParams加密时: ', this.routeParams);

            try {
                this.$routeParams = this.routeParams ? this.$decrypt(this.routeParams) || {} : {};
                this.$routeParams = this.$routeParams || {};
            } catch (e) {
                if(['URIError', 'SyntaxError'].includes(e.name)){
                    this.$jump({ name: '404' });
                    return;
                }
                this.$error(e.message, '参数异常');
            }

            _console.log('$routeParams解密后: ', this.$routeParams);
        },

        checkApi (methodName){
            if(!this.moduleName){
                throw new Error('未获取到当前模块的moduleName参数，无法执行');
            }else if(!this[methodName]){
                throw new Error(`未获取到当前模块${methodName}对应的api，无法执行`);
            }
        }
    },

    computed: {
        baseComputed (){
            return 'this is baseComputed!';
        }
    },

    watch: {
        '$route': {
            immediate: true,
            handler (v, o){
                this.initRouteParams();
            }
        }
    }
}