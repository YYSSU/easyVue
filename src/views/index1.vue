<template>
    <div>
        <p>{{aaaa}}</p>
        <p>{{test1}}</p>
        <p>{{myType}}</p>
        <p>computed: {{listComputed}}</p>
    </div>
</template>

<script>
    let indexConfig = {
        name: 'index',

        data (){
            return {
                aaaa: '1111'
            }
        },

        mounted (){
            this.baseMethod();
            this.queryByPage();
            console.log(this);
            setTimeout(() => {
                console.log(`开始测试data属性的改变：${this.test1}`);
                this.test1 = 11112;
                console.log(`改变完成：${this.test1}`);
            }, 3000);
        },

        computed: {
            ccTest (){
                return '';
            }
        },

        watch: {
            aaaa (){

            }
        }
    }.module('test');

    export default indexConfig;
</script>