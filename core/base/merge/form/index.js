/**
 * Created by litao on 2018/8/21.
 */
export default {
    data: {
        myType: 'this is form!'
    },

    methods: {
        getInfo() {
            console.log('调用了getInfo');
        }
    },

    computed: {
        formComputed (){
            return 'this is formComputed!';
        }
    },

    watch: {

    }
}