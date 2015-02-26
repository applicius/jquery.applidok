(function ($) {
    "use strict";

    var proto = (self.location.href.toLowerCase().indexOf("https://") == 0)
        ? "https:" : "http:",
    mergeUrl = proto + "//go.fudok.com/api/merge",
    merge = function(arg) {
        if ((typeof arg['fudok_token']) != "string") window.alert(_mergeI18N['NoApplicationToken']);
        
        if ((typeof arg['fudok_template']) != "string") window.alert(_mergeI18N['NoTemplateId']);
        
        var data = function() {
            if ((typeof arg['data']) == "object" 
                && !arg.data['jquery']) return arg.data; // Should be a dict
            else {
                var d = $(arg['data']);
                if (d.length != 1) return window.alert(_mergeI18N.unsupportedTarget.replace("{0}", arg['data']));
                else if (d.get(0).tagName.toLowerCase() != "form") return window.alert(_mergeI18N.NotForm.replace("{0}", arg['data']));
                
                var r = {};
                $("input[type!='checkbox'][type!='radio'], input[type='checkbox']:checked, input[type='radio']:checked, select, textarea", d).each(function(i,e){
                    var x = $(e), n = x.attr("name"), v = x.val();
                    if ((typeof n) != "string") { 
                        window.alert(_mergeI18N['MissingName']); 
                        return false 
                    }
                    
                    r[n] = v
                });

                return r
            }
        }, f = $('<form action="'+mergeUrl+'" method="POST"><input type="hidden" name="fudok_token" value="'+arg.fudok_token+'" /><input type="hidden" name="fudok_template" value="'+arg.fudok_template+'" /></form>');

        if ((typeof arg['form_target']) == "string") 
            f.attr("target", arg.form_target);
        
        $.each(data(), function(k,v){
            $('<input type="hidden" name="'+k+'" value="'+v+'" />').appendTo(f);
        });
        
        f.appendTo("body").trigger('submit').remove()
    };    
    
    $.fudok = function(arg) {
        if (arg && arg['action'] == "merge") return merge(arg);
        return false
    }
})(jQuery);
