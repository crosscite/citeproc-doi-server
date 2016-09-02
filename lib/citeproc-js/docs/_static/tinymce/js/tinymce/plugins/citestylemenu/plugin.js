tinymce.PluginManager.add('citestylemenu', function(editor) {

    var citesupport = editor.plugins.citesupport.citesupport;
    
    editor.addButton('citestylemenu', {
        type: 'listbox',
        text: 'Citation style',
        icon: false,
        onselect: function (e) {
            // Style
            var styleContainer = citesupport.editor.getDoc().getElementById('citesupport-style-container');
            if (!styleContainer) {
                styleContainer = citesupport.editor.getDoc().createElement('div');
                styleContainer.setAttribute('id', 'citesupport-style-container');
                styleContainer.hidden = true;
                citesupport.editor.getBody().appendChild(styleContainer);
            }
            styleContainer.innerHTML = this.value();
            citesupport.initDocument();
        },
        values: [
            { text: "ACM Proceedings", value: "acm-sig-proceedings" },
            { text: "AMA", value: "american-medical-association" },
            { text: "Chicago (author-date)", value: "chicago-author-date" },
            { text: "Chicago (full note)", value: "jm-chicago-fullnote-bibliography" },
            { text: "DIN-1505-2 (alpha)", value: "din-1505-2-alphanumeric" },
            { text: "JM Indigo", value: "jm-indigobook" },
            { text: "JM Indigo (L. Rev.)", value: "jm-indigobook-law-review" },
            { text: "JM OSCOLA", value: "jm-oscola" }
        ],
        onPostRender: function (e) {
            var me = this;
            setTimeout(function() {
                // Select the second item by default
                var styleContainer = citesupport.editor.getDoc().getElementById('citesupport-style-container');
                if (styleContainer) {
                    me.value(styleContainer.innerHTML);
                } else {
                    me.value("american-medical-association");
                }
            }, 100);
        }
    });
});
