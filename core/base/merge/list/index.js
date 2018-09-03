/**
 * Created by litao on 2018/8/21.
 */
export default {
    data: {
        myType: 'this is list!'
    },

    methods: {
        queryByPage() {
            console.log('调用了queryByPage');
        }
    },

    computed: {
        listComputed (){
            return 'this is listComputed!';
        }
    },

    watch: {

    }
}