<template>
    <transition name="fade" enterActiveClass="animated fadeInUp" leaveActiveClass="animated fadeOutDown">
        <div class="ev-back-top-container" @click="backTop" v-show="show">
            <ev-iconFont icon="icon-huidaodingbu2"></ev-iconFont>
        </div>
    </transition>

</template>

<script>
    let evBackTopConfig = {
        name: 'evBackTop',

        componentName: 'evBackTop',

        registryName: 'ev-backTop',

        props: {
            duration: {
                type: Number,
                default (){
                    return 1000
                }
            },
            top: {
                type: Number,
                default (){
                    return 200
                }
            }
        },

        data (){
           return {
               show: false
           }
        },

        computed: {
            scrollInstance (){
                return this.$el.parentElement;
            }
        },

        mounted (){
            if(!this.scrollInstance) return;

            if(this.scrollInstance){
                this.scrollInstance.addEventListener('scroll', this.scrollHandler, false);
                this.$once('hook:destroyed', () => {
                    this.scrollInstance.removeEventListener('scroll', this.scrollHandler, false)
                })
            }
        },

        methods: {
            scrollHandler (e){
                this.show = this.top < this.scrollInstance.scrollTop;
            },

            backTop (){
                this.$emit('scroll-before');
                this.$scrollTop(this.scrollInstance, this.scrollInstance.scrollTop, 0, this.duration, () => {
                    this.$emit('scroll-after');
                });
            }
        }
    };

    export default evBackTopConfig;
</script>

<style lang="scss">
    .ev-back-top-container{
        width: 35px;
        height: 35px;
        line-height: 35px;
        text-align: center;
        position: fixed;
        bottom: 35px;
        right: 30px;
        cursor: pointer;
        background-color: rgba(204,204,204,.5);
        & i{
            font-size: 25px;
            color: #9E9E9E;
            transition: all .3s;
            &:hover{
                color: #5f6165;
            }
        }
    }
</style>