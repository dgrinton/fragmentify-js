jQuery.noConflict();
if(!window.Fragmentify) {
window.Fragmentify = function(){
    var $ = jQuery;
    var ran = false;
    var _pub = {
        'init':function(path){
            if(!path || typeof(path) == 'function') {
                if($('html[base],[require]').length == 0) {
                    return;
                }
                path = window.location.pathname;
            }
            if(ran) {
                return;
            }
            ran = true;
            if(!document.evaluate) {
                alert('how do i shot xpath?');
                return;
            }
            var doc = process(path);
            replace_document(doc);
            $('[xmlns]').removeAttr('xmlns');
            $('html').removeAttr('base');
            $('script[src$="fragmentify.min.js"]').remove();
        },
    };
    var get_file = function(path, doc_cb) {
        path = cleanpath(path);
        var file_cb = function(data){
            try{
                var doctype = null;
                data = data.replace(/<!doctype [^>]+>/,function(dt){
                    doctype = dt;
                    return '';
                });
                var doc = $.parseXML(data);
                doc.fragmentify_doctype = doctype;
            }
            catch(e){
                alert('xml error in '+path);
                return;
            }
            doc_cb(doc);
        };
        $.ajax({
            'url':path,
            'error':function(){
                alert('could not load ' + path);
            },
            'success':file_cb,
            'async':false,
            'dataType':'text',
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
    };
    var process_base = function(doc, parent_path){
        var actions = $(doc).find('html > *');
        var base_fn = parent_path+$(doc).find('html').attr('base');
        var base_doc = process(base_fn);
        actions.each(function(k,v){
            if(v.nodeName == 'head') {
                return;
            }
            process_action(base_doc,v,parent_path);
        });
        $(doc).find('html').removeAttr('base');
        return base_doc;
    };
    var process_requires = function(root, path) {
        $(root).find('*').andSelf().filter('[require]').each(function(k,v){
            process_require(v, path);
        });
    };
    var process_require = function(req, parent_path) {
        var original = req;
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
        var owner = req.get(0).ownerDocument;
        req.remove();
    };
    var replace_document = function(xml_doc) {
        document.open();
        if(xml_doc.fragmentify_doctype) {
            document.write(xml_doc.fragmentify_doctype);
        }
        document.write(xml_to_string(xml_doc.documentElement));
        document.close();
    };
    var xml_to_string = function(node) {
        if (window.ActiveXObject) {     
            var ret = node.xml;   
        } 
        else {     
            var ret = (new XMLSerializer()).serializeToString(node);
        } 
        var canselfclose = 'area,base,br,col,command,embed,hr,img,input,keygen,link,meta,param,source,track,wbr'.split(',');
        ret = ret.replace(/<([a-z0-9]+)([^>]*)\/>/g, function(all, tag, rest) {
            if($.inArray(tag, canselfclose) == -1) {
                return '<'+tag+rest+'></'+tag+'>';
            }
            else {
                return all;
            }
        });
        return ret;
    };
    var process_action = function(base_doc, src, parent_path) {
        src = $(src);
        var actions = [
            ['replace',function(dst, instance){
                $(dst).before(instance);
                if(src.attr('keep-contents') == 'true') {
                    instance.removeAttr('keep-contents');
                    while(dst.firstChild) {
                        instance.get(0).appendChild(dst.firstChild);
                    }
                    process_requires(instance, parent_path);
                }
                $(dst).remove();
            }],
            ['append',function(dst, instance){
                $(dst).append(instance);
                process_requires(instance.get(0), parent_path);
            }],
            ['prepend',function(dst, instance){
                $(dst).prepend(instance);
                process_requires(instance.get(0), parent_path);
            }],
            ['before',function(dst, instance){
                $(dst).before(instance);
                process_requires(instance.get(0), parent_path);
            }],
            ['after',function(dst, instance){
                $(dst).after(instance);
                process_requires(instance.get(0), parent_path);
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
                process_requires(instance.get(0), parent_path);
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
    var cleanpath = function(path) {
        path = path.replace(/^\/([A-Z]):\/(.*)/, function(all, drive, rest) {
            return 'file:///'+drive+':/'+rest;
        });
        return path;
    };
    return _pub;
}();}
jQuery(window).ready(Fragmentify.init);
