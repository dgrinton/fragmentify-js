Fragmentify-js
============

About:
------

Fragmentify-js is a pure JavaScript HTML inheritance utility. It allows you to
create HTML documents as a set of components which are then assembled
in-browser. It can run off a webserver or your local filesystem (when used as a
Chrome extension).

Chrome Extension or plain JavaScript?
-------------------------------------

The easiest way to use Fragmentify is via its Chrome Extension. It's not
currently in the Chrome Web Store, so you'll need to download the .crx file and
drag it onto Chrome's Extensions screen. To work off your local file system
you'll need to tick "Allow access to file URLs" for the Fragmentify extension.

The other way to use Fragmentify is by including fragmentify.min.js in each leaf
document of your project - ie if home.html requires widget.html and extends
base.html, you'd only need to include the JavaScript in home.html (which is the
file you'd be loading in the browser). This is the only way to way to view
Fragmentify pages in browsers other than Chrome, though we should soon have
another extension that will let you save a compiled page as a single file so you
can then load it in any browser.

Syntax in a nutshell:
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
        <div id="content" replace="//[@id='content']">
            This div will replace the #content div in base.html.
            <div require="fragments/widget.html"></div>
        </div>
    </html>

In blog.html:

    <html base="abstract/base.html">
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

Fragmentify's syntax consists of attributes added to regular HTML elements. The
"require" attribute can be used anywhere. The "base" attribute can only be used
on a html node. The rest of the attributes (we'll call them actions) must be
used on children of a html node with the "base" attribute. These action
attributes should all have a value which is an xpath selector that specifies
which nodes in the base document to modify. An action can match multiple
elements, and a subsequent action can modify something produced by a prior
action (including "require"d content).

###require:

In any document you can use the require="path/to/file.html" attribute. The
path must be relative to the file doing the requiring. The file being required
must contain one single fragment node at the root of the document.

Optionally the xpath attribute can be used to specify some content within the
required document that should be included, instead of the entire contents of the
fragment node.

The type of the node with the require attribute is arbitrary.

You can combine require with another action, eg append, to append the contents
of the fragment to the target node.

###base:

This is used to provide inheritance. The specified path must be relative to the
current file, and should contain a complete HTML document (or should inherit
from another complete HTML document). The base document will be loaded, each of
the actions of the current HTML document will be processed, modifying the base
document, and then the base document will replace the current document.

###replace:

Replace each of the matched nodes with the current node. Can optionally use
the "keep-contents" attribute, which will append the contents of the replaced
node to the replacing node.

###append:

Append the current node to each of the matched nodes.

###prepend:

Prepend the current node to each of the matched nodes.

###before:

Insert the current node before each of the matched nodes.

###after:

Insert the current node after each of the matched nodes.

###surround:

Wrap the matched nodes with the current node. Takes an optional attribute
"where" which specifies where the wrapped node should be placed inside the
wrapping node, only supports "top" or "bottom", defaults to "bottom".

###merge:

Write each of the attributes on the current node onto the matched nodes,
existing attributes with the same names will be overwritten.

###remove:

Remove the matched nodes.

Compatibility:
--------------

Fragmentify-js has been tested in:

* Chrome 20.0.1132.57
* Safari 6.0 (7536.25)
* Firefox 14.0.1

See also:
---------

* Fragmentify-js' PHP predecessor: https://github.com/iaindooley/Fragmentify

Known Issues:
-------------

Fragmentify runs when it sees a "base" attribute on the "html" node, or a
"require" attribute anywhere else. It's quite possible that these attributes
might be used on another site you visit, which might have unexpected results.
Most likely you'll get an alert about a file that can't be loaded, or some XML
that can't be parsed. Currently there's not much you can do except disable the
extension while you're browsing those sites.
