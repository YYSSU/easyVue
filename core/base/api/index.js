/**
 * Created by litao on 2018/8/10.
 */
const loadModuleApi = function (moduleName) {
    return require('./' + moduleName);
};

export default (module, method, param) => {
    return new Promise(function(resolve, reject) {
        if(!module){
            reject({message: '调用api时，未获取到模块名参数！'});
        }else{
            if(!method){
                reject({message: '调用api时，未获取到方法名参数！'});
            }else{
                let moduleApi = loadModuleApi(module);
                let func = moduleApi[method];
                if(func && Object.prototype.toString.call(func).toLowerCase() === '[object function]'){
                    func(param).then(resolve).catch(reject);
                }else{
                    reject({message: `调用api时，未获取到对应可执行的方法[${module}.${method}]！`});
                }
            }
        }
    });
}