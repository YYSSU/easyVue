<script>
  export default {
    name: 'EvImportThirdFile',

    componentName: 'EvImportThirdFile',

    registryName: 'ev-importFile',

    props: {
      type: {
        required: false,
        type: String,
        default (){
          return "js"
        }
      },

      href: {
        required: true,
        type: String
      },
    },

    render (h){
      return h('div', {
        ref: 'importFileContainer'
      })
    },

    mounted() {
      let appendDom;
      switch (this.type) {
        case "css":
        case "link":
          appendDom = document.createElement('link');
          appendDom.type = 'text/css';
          appendDom.rel = 'stylesheet';
          appendDom.href = this.href;
          break;
        case "javascript":
        case "javaScript":
        case "js":
          appendDom = document.createElement('script');
          appendDom.type = 'text/javascript';
          appendDom.src = this.href;
          break
      }

      if (appendDom) {
        let _self = this;
        appendDom.onload = appendDom.onreadystatechange = function () {
          if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
            setTimeout(() => {
              _self.$emit('complete');
            });
            appendDom.onload = appendDom.onreadystatechange = null;
          }
        };
        let container = this.$refs.importFileContainer;
        if (container) {
          container.appendChild(appendDom);
        }
      }
    }
  }
</script>
