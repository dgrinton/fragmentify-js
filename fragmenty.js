jQuery.noConflict();
window.Fragmenty = function(){
    var $ = jQuery;
    var _pub = {
        'init':function(){
            if(!document.evaluate) {
                alert('how do i shot xpath?');
                return;
            }
            var doc = process(window.location.pathname);
            replace_document(doc);
            $('[xmlns]').removeAttr('xmlns');
            $('html').removeAttr('base');
        },
    };
    var get_file = function(path, callback) {
        $.ajax({
            'url':path,
            'error':function(){
                alert('could not load ' + path);
            },
            'success':function(data){
                try{
                    data = data.replace('<!doctype html>','');
                    var doc = $.parseXML(data);
                }
                catch(e){
                    alert('xml error in '+path);
                    return;
                }
                callback(doc);
            },
            'async':false,
        });
    };
    var process = function(path) {
        var ret = null;
        get_file(path,function(doc){
            if($(doc).find('html').attr('base')) {
                doc = process_base(doc, dirname(path));
            }
            process_requires(doc, dirname(path));
            ret = doc;
        });
        return ret;
    }
    var process_base = function(doc, parent_path){
        var actions = $(doc).find('html > *');
        var base_fn = parent_path+$(doc).find('html').attr('base');
        var base_doc = process(base_fn);
        actions.each(function(k,v){
            if(v.nodeName == 'head') {
                return;
            }
            process_action(base_doc,v);
        });
        $(doc).find('html').removeAttr('base');
        return base_doc;
    };
    var process_requires = function(root, path) {
        $(root).find('[require]').each(function(k,v){
            process_require(v, path);
        });
    };
    var process_require = function(req, parent_path) {
        req = $(req);
        var required = parent_path+req.attr('require');
        path = dirname(required);
        var query = req.attr('xpath');
        if(!query) {
            query = '//fragment/node()';
        }
        var fragment = process(required)
        var to_import = fragment.evaluate(query, fragment, null,
            XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
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
    };
    var replace_document = function(xml_doc) {
        var html = $('html').get(0);
        var head = $('head').get(0);
        var body = $('body').get(0);
        var where = 'pre-head';
        var to_insert = [];
        $.each(xml_doc.documentElement.childNodes, function(i,node){
            to_insert.push(node);
        });
        var replace_node = function(s) {
            var to_replace = $(s);
            to_replace.html('');
            var old_atts = [];
            $.each(to_replace.get(0).attributes, function(i, att){
                old_atts.push(att.name);
            });
            $.each(old_atts,function(i,att) {
                to_replace.removeAttr(att);
            });
            $.each($(xml_doc).find(s).get(0).attributes, function(i, att){
                to_replace.attr(att.name, att.value);
            });
            $(xml_doc).find(s+' > *').each(function(k,v){
                var node = $(xml_to_string(v));
                to_replace.append(node);
            });
        };
        $.each(to_insert, function(i,node){
            if(node.tagName == 'head') {
                replace_node('head');
                where = 'pre-body';
            }
            else if(node.tagName == 'body') {
                replace_node('body');
                where = 'post-body';
            }
            else {
                if(where == 'pre-head') {
                    html.insertBefore(node, head);
                }
                else if(where == 'pre-body') {
                    html.insertBefore(node, body);
                }
                else if(node instanceof Text){
                    html.appendChild(node);
                }
                else {
                    $(html).append($(xml_to_string(node)));
                }
            }
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
    var process_action = function(base_doc, src) {
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
                var targets = get_targets(base_doc, xp);
                $.each(targets,function(k,dst){
                    var instance = src.clone();
                    instance.removeAttr(pair[0]);
                    pair[1](dst, instance);
                });
            }
        });
    };
    var get_targets = function(base_doc, xp) {
        var rs = base_doc.evaluate(xp, base_doc, null,
            XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
        var t;
        var ret = []
        while(t = rs.iterateNext()) {
            ret.push(t);
        }
        return ret;
    };
    var dirname = function(path) {
        var parts = path.split('/');
        parts.pop();
        if(parts.length) {
            parts.push('');
        }
        return parts.join('/');
    };
    return _pub;
}();
jQuery(document).ready(Fragmenty.init);
