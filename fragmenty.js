window.Fragmenty = function(){
    var _pub = {
        'init':function(){
            if(!document.evaluate) {
                alert('how do i shot xpath?');
                return;
            }
            if($('html').attr('base')) {
                process_base();
            }
            process_requires(document);
        },
    };
    var process_base = function(){
        var actions = $('body > *');
        var base = $('html').attr('base');
        $.ajax({
            'url':base,
            'error':function(){
                alert('could not load ' + base);
            },
            'success':function(data){
                data = data.replace('<!doctype html>','');
                try{
                    var replacement = $.parseXML(data);
                }
                catch(e){
                    alert('xml error in '+base);
                    return;
                }
                replace_special(replacement, 'head');
                replace_special(replacement, 'body');
                //process requires in the base doc
                process_requires(document);
                $('[require]').each(process_require);
                actions.each(function(k,v){
                    process_action(v);
                });
            },
            'async':false,
        });
        //and then process requires in the final doc
        $('html').removeAttr('base');
    };
    var process_requires = function(root, path) {
        if(!path) {
            path = '';
        }
        if(!root.find) {
            root = $(root);
        }
        root.find('[require]').each(function(k,v){
            process_require(v, path);
        });
    };
    var process_require = function(req, parent_path) {
        req = $(req);
        var required = parent_path+req.attr('require');
        var query = req.attr('xpath');
        var parts = required.split('/');
        parts.pop();
        if(parts.length) {
            parts.push('');
        }
        path = parts.join('/');
        if(!query) {
            query = '//fragment/node()';
        }
        $.ajax({
            'url':required,
            'error':function(){
                alert('could not load ' + required);
            },
            'success':function(data){
                var fragment = $(data).get(0);
                process_requires(fragment, path);
                fragment = $.parseXML('<fragment>'+$(fragment).html()+'</fragment>');
                if(fragment instanceof Document) {
                    var to_import = fragment.evaluate(query, fragment, null,
                        XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
                }
                else {
                    var to_import = document.evaluate(query, fragment, null,
                        XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
                }
                var src;
                while(src = to_import.iterateNext()) {
                    if(src instanceof Text) {
                        req.before(src.textContent);
                    }
                    else {
                        var xml = xml_to_string(src);
                        var instance = $(xml);
                        req.before(instance);
                    }
                }
                req.remove();
            },
            'async':false,
        });
    };
    var replace_special = function(xml_doc, s) {
        xml_doc = $(xml_doc);
        var to_replace = $(s);
        to_replace.html('');
        xml_doc.find(s+' > *').each(function(k,v){
            var node = $(xml_to_string(v));
            to_replace.append(node);
        });
    };
    var xml_to_string = function(node) {
        if (window.ActiveXObject) {     
            return node.xml;   
        } 
        else {     
            return (new XMLSerializer()).serializeToString(node);
        } 
    };
    var process_action = function(src) {
        src = $(src);
        var actions = [
            ['replace',function(dst, instance){
                $(dst).before(instance);
                if(src.attr('keep-contents') == 'true') {
                    instance.removeAttr('keep-contents');
                    while(dst.firstChild) {
                        instance.get(0).appendChild(dst.firstChild);
                    }
                }
                $(dst).remove();
            }],
            ['append',function(dst, instance){
                $(dst).append(instance);
            }],
            ['prepend',function(dst, instance){
                $(dst).prepend(instance);
            }],
            ['before',function(dst, instance){
                $(dst).before(instance);
            }],
            ['after',function(dst, instance){
                $(dst).after(instance);
            }],
            ['surround',function(dst, instance){
                var where = instance.attr('where');
                instance.removeAttr('where');
                $(dst).before(instance);
                switch(where){
                    case 'top':
                        instance.prepend(dst);
                        break;
                    default:
                        instance.append(dst);
                        break;
                }
            }],
            ['merge',function(dst, instance) {
                $.each(instance.get(0).attributes, function(i, att) {
                    $(dst).attr(att.name, att.value);
                });
            }],
            ['remove',function(dst, instance) {
                $(dst).remove();
            }],
        ];
        $.each(actions,function(k,pair){
            var xp;
            if(xp = src.attr(pair[0])) {
                var targets = get_targets(xp);
                $.each(targets,function(k,dst){
                    var instance = src.clone();
                    instance.removeAttr(pair[0]);
                    pair[1](dst, instance);
                });
            }
        });
    };
    var manipulate = function(node, callback) {
        
    };
    var get_targets = function(xp) {
        var rs = document.evaluate(xp, document, null,
            XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
        var t;
        var ret = []
        while(t = rs.iterateNext()) {
            ret.push(t);
        }
        return ret;
    };
    return _pub;
}();
$(document).ready(Fragmenty.init);
