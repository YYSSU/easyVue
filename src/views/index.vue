<template>
    <div>
        <p>{{aaaa}}</p>
        <p>{{test1}}</p>
        <p>{{myType}}</p>
        <p>computed: {{listComputed}}</p>
        <p>{{extendInfo}}</p>
        <p>computedA: {{computedA}}</p>
    </div>
</template>

<script>
    let indexConfig = ev({
        data (){
            return {
                aaaa: '1111'
            }
        },

        mounted (){
            this.baseMethod();
            this.queryByPage();
            this.getInfo();
            this.extendTest();
            console.log(this);
            setTimeout(() => {
                console.log(`开始测试data属性的改变：${this.test1}`);
                this.test1 = 11112;
                this.extendInfo = '测试: ' + this.extendInfo;
                console.log(`改变完成：${this.test1}`);
            }, 3000);
        },

        helloWorld (){
            alert('helloWorld');
        },

        computed: {
            computedA (){
                return `computed: ${this.test1}`;
            }
        }
    }).form().module('test').build();

    export default indexConfig;
</script>