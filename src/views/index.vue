<template>
    <div>
        <h1>list demo test page</h1>
        <p>{{aaaa}}</p>
        <p>{{extendInfo}}</p>
        <p>computedA: {{computedA}}</p>
        <p>{{testFilter | testFilter}}</p>

        <p>模拟查询到的数据</p>
        <ul>
            <li v-for="(item, index) in page.list" :key="index">
                <em>{{item.id}}</em>{{item.content}}
            </li>
        </ul>
    </div>
</template>

<script>
    let indexConfig = new ezv({
        data (){
            return {
                moduleName: 'index',
                listMethod: 'testQueryPage',
                testFilter: '',
                aaaa: '1111'
            }
        },

        methods: {
           beforeInit (){
               this.$testGlobalMethod();
               this.extendTest();
               console.log(this);
               setTimeout(() => {
                   console.log(`开始测试data属性的改变：${this.aaaa}`);
                   this.aaaa = 11112;
                   this.extendInfo = '测试: ' + this.extendInfo;
                   console.log(`改变完成：${this.aaaa}`);
               }, 3000);
           }
        },

        computed: {
            computedA (){
                return `computed: ${this.aaaa}`;
            }
        }
    }).list().module('test').build();

    export default indexConfig;
</script>