/**
 * 此处可以拦截请求并代理到本地进行处理，例：login
 * Created by litao on 2018/8/9.
 */

//列表demo请求
export function testQueryPage() {
    return {
        url: /\/test\/testQueryPage/,
        method: 'post',
        handler (params){
            return {
                state: 1,
                data: {
                    pageSize: 1,
                    pageNum: 5,
                    total: 5,
                    list: [
                        { id: 1, content: '我是数据1' },
                        { id: 2, content: '我是数据2' },
                        { id: 3, content: '我是数据3' },
                        { id: 4, content: '我是数据4' },
                        { id: 5, content: '我是数据5' },
                    ]
                },
                message: '查询成功'
            };
        }
    }
}

//表单demo请求
export function testGetInfo() {
    return {
        url: /\/test\/testGetInfo/,
        method: 'post',
        handler (params){
            return {
                state: 1,
                data: {
                    name: '张三',
                    sex: '男',
                    age: 45,
                    address: '山东省济南市历城区'
                },
                message: '查询成功'
            };
        }
    }
}