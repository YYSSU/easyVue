<template>
    <div>
        <h1>form demo test page</h1>
        <p>模拟查询到的数据</p>
        <p><em>姓名：</em>{{formData.name}}</p>
        <p><em>性别：</em>{{formData.sex}}</p>
        <p><em>年龄：</em>{{formData.age}}</p>
        <p><em>地址：</em>{{formData.address}}</p>
    </div>
</template>

<script>
    let indexConfig = new ezv({
        data (){
            return {
                moduleName: 'index1',
                getMethod: 'testGetInfo'
            }
        },

        methods: {
            beforeInit (){
                this.$success('this is form demo page');
            },

            isLoadDataInfo (){
                return true;
            }
        }
    }).form().module('test').build();

    export default indexConfig;
</script>