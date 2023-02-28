<template>
  <div>
    <textarea id="tinymce-editor" v-model="textarea_str" />
  </div>
</template>

<script>
export default {
  name: 'TinymceEditor',
  data() {
    return {
      textarea_str: '',
      cont: '',
      cont_show: '',
      init_cont: ''

    }
  },

  mounted() {
    const that = this
    // eslint-disable-next-line no-undef
    tinymce.init({
      selector: '#tinymce-editor',
      language: 'zh_CN',
      branding: false,
      menu: {
        file: { title: 'File', items: 'newdocument' },
        edit: { title: 'Edit', items: 'undo redo cut copy paste pastetext selectall' },
        insert: { title: 'Insert', items: 'link media | template hr image' },
        view: { title: 'View', items: 'visualaid | fullscreen' },
        format: { title: 'Format', items: 'bold italic underline strikethrough superscript subscript | formats | removeformat' },
        table: { title: 'Table', items: 'inserttable tableprops deletetable | cell row column' },
        tools: { title: 'Tools', items: 'spellchecker code' }
      },
      plugins: ['autoresize', 'image', 'fullscreen', 'hr', 'nonbreaking', 'template'],
      autoresize_max_height: 500,
      autoresize_on_init: true,
      templates: [
        { title: '自定义标题', description: '自定义标题', content: '<div style="width: 100%;margin: 16px 0;">\n' +
              '    <h2 style="text-align:center;color: #3DBC6D;">所属目</h2>\n' +
              '    <div style="height: 5px;margin: 5px 0;width: 100%; background: -webkit-linear-gradient(left, rgba(255, 255, 255, 0), #5DDDD3, rgba(255, 255, 255, 0)); background: linear-gradient(to right, rgba(255, 255, 255, 0), #5DDDD3, rgba(255, 255, 255, 0));"></div>\n' +
              '</div>' },
        { title: '自定义段落', description: '自定义段落', content: '<p style="text-indent : 2em; line-height:1.6em;"></p>' },
        { title: '自定义图片', description: '自定义段落', content: `<div style="display:flex;justify-content: center;margin-bottom: 10px"><img style="border-radius: 10px;" src="https://www.upcl.ltd/images/news/ych1.jpg" alt="" width="90%"/></div>` }
      ],

      setup: function(editor) {
        console.log('Editor was clicked', editor)
        // editor.on('click', function() {
        //   that.cont = editor.getContent()
        //   that.cont_show = editor.getContent({ format: 'text' })
        // })
      },

      init_instance_callback: function(editor) {
        console.log('Editor: ' + editor.id + ' is now initialized.')
        editor.setContent(that.init_cont)
      },
      deactivated() {
        // eslint-disable-next-line no-undef
        console.log('销毁')
      }
    })
  },

  methods: {
    getCont() {
      // eslint-disable-next-line no-undef
      this.cont = tinyMCE.editors['tinymce-editor'].getContent()
      // eslint-disable-next-line no-undef
      this.cont_show = tinyMCE.editors['tinymce-editor'].getContent({ format: 'text' });
    },
    setCont() {
      // eslint-disable-next-line no-undef
      tinyMCE.editors['tinymce-editor'].setContent(this.init_cont)
    },
  }
}
</script>

<style scoped>

</style>
