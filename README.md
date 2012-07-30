Fragmenty.js
============

About:
------

Fragmenty.js is a pure JavaScript HTML inheritance utility. All you need is a
webserver that can serve static files.

In a nutshell:
--------------

Let's say we're building a website with two templates, home.html and blog.html.
Both of these templates will have a common header and footer. We'll lay our
files out like this:

    abstract/base.html #this contains the common header and footer
    fragments/widget.html #a widget that both templates need to use
    home.html
    blog.html

In abstract/base.html:

    <!doctype html>
    <html>
        <head>
            <!-- all of your common css, javascript etc here -->
        </head>
        <body>
            <div id="header">
                This is the header of my site.
            </div>
            <div id="content">
                This will be overridden by the inheriting templates.
            </div>
            <div id="footer">
                This is the footer of my site.
            </div>
        </body>
    </html>

In home.html:

    <html base="abstract/base.html">
        <script type="text/javascript" src="fragmenty.min.js"></script>
        <div id="content" replace="//[@id='content']">
            This div will replace the #content div in base.html.
            <div require="fragments/widget.html"></div>
        </div>
    </html>

In blog.html:

    <html base="abstract/base.html">
        <script type="text/javascript" src="fragmenty.min.js"></script>
        <div id="content" replace="//[@id='content']">
            This is a blog entry!
            <div class="extra-markup">
                <div require="fragments/widget.html"></div>
            </div>
        </div>
    </html>

In fragments/widget.html:
    
    <fragment>
        <div class="widget">I'm a widget.</div>
    </fragment>

What you'll see when you hit home.html in your browser:

    <!doctype html>
    <html>
        <head>
            <!-- all of your common css, javascript etc here -->
        </head>
        <body>
            <div id="header">
                This is the header of my site.
            </div>
            <div id="content">
                This div will replace the #content div in base.html.
                <div class="widget">I'm a widget.</div>
            </div>
            <div id="footer">
                This is the footer of my site.
            </div>
        </body>
    </html>

And blog.html:

    <!doctype html>
    <html>
        <head>
            <!-- all of your common css, javascript etc here -->
        </head>
        <body>
            <div id="header">
                This is the header of my site.
            </div>
            <div id="content">
                This is a blog entry!
                <div class="extra-markup">
                    <div class="widget">I'm a widget.</div>
                </div>
            </div>
            <div id="footer">
                This is the footer of my site.
            </div>
        </body>
    </html>

The details:
------------

Fragmenty works by adding attributes to regular HTML elements. The "require"
attribute can be used anywhere. The "base" attribute can only be used on a html
node. The rest of the attributes (we'll call them actions) must be used on
children of a html node with the "base" attribute. These last attributes should
all contain xpath selectors which specify which nodes in the base document to
modify. An action can match multiple elements, and a subsequent action can
modify something produced by a prior action.

#require:

In any document you can use the require="path/to/file.html" attribute. The
path must be relative to the file doing the requiring. The file being required
must contain one single fragment node at the root of the document.

Optionally the xpath attribute can be used to specify some content within the
required document that should be included, instead of the entire contents of the
fragment node.

The type of the node with the require attribute is arbitrary.

#base:

This is used to provide inheritance. The specified path must be relative to the
current file, and should contain a complete HTML document (or should inherit
from another complete HTML document). The base document will be loaded, each of
the child nodes of the current HTML document will be processed, modifying the
base document, and then the base document will replace the current document.

#replace:

Replace each of the matched nodes with the current node. Can optionally use
the "keep-contents" attribute, which will append the contents of the replaced
node to the replacing node.

#append:

Append the current node to each of the matched nodes.

#prepend:

Prepend the current node to each of the matched nodes.

#before:

Insert the current node before each of the matched nodes.

#after:

Insert the current node after each of the matched nodes.

#surround:

Wrap the matched nodes with the current node. Takes an optional attribute "where"
which specifies where the wrapped node should be placed inside the wrapping
node, defaults to "bottom".

#merge:

Write each of the attributes on the current node onto the matched nodes,
replacing anything that was already there.

#remove:

Remove the matched nodes.

Known issues:
-------------

* The template must be requested off a web server via http, otherwise the
    JavaScript requests for resources (other html files) will fail. This can be
    worked around in Chrome (and possibly other browsers) with the
    --allow-file-access-from-files flag. Ultimately I intend to write browser
    extensions to work around this.
