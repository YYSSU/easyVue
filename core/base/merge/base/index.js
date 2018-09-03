/**
 * Created by litao on 2018/8/21.
 */
export default {
    data: {
        test1: 'this is test1',
        myType: 'this is base!'
    },

    methods: {
        baseMethod() {
            console.log('调用了baseMethod');
        }
    },

    computed: {
        baseComputed (){
            return 'this is baseComputed!';
        }
    },

    watch: {
        test1 (){
            console.log('watch test!!');
        }
    }
}