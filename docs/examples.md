#Fragmentify Usage Examples

##Contents

- [Inheritance](#inheritance)
- [Replace](#replace)
- [Append](#append)
- [Prepend](#prepend)
- [Before](#before)
- [After](#after)
- [Surround](#surround)
- [Merge](#merge)
- [Remove](#remove)
- [Require](#require)
- [Nested Inheritance](#nested-inheritance)

###Inheritance
[top](#top)

Let's say we have a common header, footer, some scripts and css that will be on
every page on our site.

We'll put these into a base template, `abstract/base.html`:

    <!doctype html>
    <html>
        <head>
            <script src="js/my-scripts.js"></script>
            <link rel="stylesheet" href="css/my-styles.css"/>
        </head>
        <body>
            <div id="header"><h1>My Neat Site</h1></div>
            <div id="content">Content will go here.</div>
            <div id="footer">
                <span id="copy">Copyright 2012 My Company</span>
                <ul id="footer-links">
                    <li><a href="#">Legal</a></li>
                    <li><a href="#">Contact</a></li>
                </ul>
            </div>
        </body>
    </html>

Note that we've used paths `js` and `css`. These must be relative to the file
that extends `abstract/base.html`, not `abstract/base.html` itself.

Also note that we've put in the placeholder `#content` element - this is to give
us an easy target later.

And now each of our pages that should use those common elements can extend
`base.html` by using the `base` attribute on its `html` node, for example in
`home.html`:
    
    <html base="abstract/base.html">
    </html>

Now if we look at `home.html` in our browser we will see the contents of
`abstract/base.html`. This isn't very exciting, so now we'll add some actions to
`home.html` to modify `abstract/base.html`.

###Replace
[top](#top)

Let's say we want to replace the `#content` node with some real content. In
`home.html`, as a child of the `html` node, we add a `div` node with the
attribute `replace="//*[@id='header']"`. The value of the `replace` attribute is
an xpath selector that specifies the element to be replaced. If it matches more
than one element, each matched element will be replaced with a copy of this
element.

    <html base="abstract/base.html">
        <div id="content" replace="//*[@id='content']">
            This is the real content.
        </div>
    </html>

Now if we load `home.html` in our browser we will see this:

    <!doctype html>
    <html>
        <head>
            <script src="js/my-scripts.js"></script>
            <link rel="stylesheet" href="css/my-styles.css"></script>
        </head>
        <body>
            <div id="header"><h1>My Neat Site</h1></div>
            <div id="content">
                This is the real content.
            </div>
            <div id="footer">
                <span id="copy">Copyright 2012 My Company</span>
                <ul id="footer-links">
                    <li><a href="#">Legal</a></li>
                    <li><a href="#">Contact</a></li>
                </ul>
            </div>
        </body>
    </html>

###Append
[top](#top)

Now let's say we want to add some CSS that only appears on `home.html`. We add a
`link` node as a child of the `html` node, and give it the attribute
`append="//head"`:

    <html base="abstract/base.html">
        <div id="content" replace="//*[@id='content']">
            This is the real content.
        </div>
        <link append="//head" rel="stylesheet" href="css/home.css"/>
    </html>

Now in the browser `home.html` will look like this:

    <!doctype html>
    <html>
        <head>
            <script src="js/my-scripts.js"></script>
            <link rel="stylesheet" href="css/my-styles.css"></script>
            <link rel="stylesheet" href="css/home.css"></script>
        </head>
        <body>
            <div id="header"><h1>My Neat Site</h1></div>
            <div id="content">
                This is the real content.
            </div>
            <div id="footer">
                <span id="copy">Copyright 2012 My Company</span>
                <ul id="footer-links">
                    <li><a href="#">Legal</a></li>
                    <li><a href="#">Contact</a></li>
                </ul>
            </div>
        </body>
    </html>

###Prepend
[top](#top)

Now we want to add a `strong` node inside the `#header` node, before the `h1`.
We add a `strong` node as a child of the `html` node, and give it the attribute
`prepend="//*[@id='header']`.

    <html base="abstract/base.html">
        <div id="content" replace="//*[@id='content']">
            This is the real content.
        </div>
        <link append="//head" rel="stylesheet" href="css/home.css"/>
        <strong prepend="//*[@id='header']">Welcome to </strong>
    </html>

Now in the browser `home.html` will look like this:

    <!doctype html>
    <html>
        <head>
            <script src="js/my-scripts.js"></script>
            <link rel="stylesheet" href="css/my-styles.css"></script>
            <link rel="stylesheet" href="css/home.css"></script>
        </head>
        <body>
            <div id="header"><strong>Welcome to </strong><h1>My Neat Site</h1></div>
            <div id="content">
                This is the real content.
            </div>
            <div id="footer">
                <span id="copy">Copyright 2012 My Company</span>
                <ul id="footer-links">
                    <li><a href="#">Legal</a></li>
                    <li><a href="#">Contact</a></li>
                </ul>
            </div>
        </body>
    </html>

###Before
[top](#top)

Now we'll add an "About" link into the footer between "Legal" and "Contact". We
add a `li` node as a child of the `html` node, and use the attribute
`before="//*[@id='links']/li[2]"`.

    <html base="abstract/base.html">
        <div id="content" replace="//*[@id='content']">
            This is the real content.
        </div>
        <link append="//head" rel="stylesheet" href="css/home.css"/>
        <strong prepend="//*[@id='header']">Welcome to </strong>
        <li before="//*[@id='footer-links']/li[2]"><a href="#">About</a></li>
    </html>

In the browser we now see:

    <!doctype html>
    <html>
        <head>
            <script src="js/my-scripts.js"></script>
            <link rel="stylesheet" href="css/my-styles.css"></script>
            <link rel="stylesheet" href="css/home.css"></script>
        </head>
        <body>
            <div id="header"><strong>Welcome to </strong><h1>My Neat Site</h1></div>
            <div id="content">
                This is the real content.
            </div>
            <div id="footer">
                <span id="copy">Copyright 2012 My Company</span>
                <ul id="footer-links">
                    <li><a href="#">Legal</a></li>
                    <li><a href="#">About</a></li>
                    <li><a href="#">Contact</a></li>
                </ul>
            </div>
        </body>
    </html>

###After
[top](#top)

Now we want to add a logout link in a `p` to the header, after the `h1`. We add
a `p` node as a child of our `html` node, and give it the attribute
`after="//*[@id='header']/h1"`.

    <html base="abstract/base.html">
        <div id="content" replace="//*[@id='content']">
            This is the real content.
        </div>
        <link append="//head" rel="stylesheet" href="css/home.css"/>
        <strong prepend="//*[@id='header']">Welcome to </strong>
        <li before="//*[@id='footer-links']/li[2]"><a href="#">About</a></li>
        <p after="//*[@id='header']/h1"><a href="#">Logout</a></p>
    </html>

In the browser, `home.html` now looks like this:

    <!doctype html>
    <html>
        <head>
            <script src="js/my-scripts.js"></script>
            <link rel="stylesheet" href="css/my-styles.css"></script>
            <link rel="stylesheet" href="css/home.css"></script>
        </head>
        <body>
            <div id="header">
                <strong>Welcome to </strong><h1>My Neat Site</h1>
                <p><a href="#">Logout</a></p>
            </div>
            <div id="content">
                This is the real content.
            </div>
            <div id="footer">
                <span id="copy">Copyright 2012 My Company</span>
                <ul id="footer-links">
                    <li><a href="#">Legal</a></li>
                    <li><a href="#">About</a></li>
                    <li><a href="#">Contact</a></li>
                </ul>
            </div>
        </body>
    </html>

###Surround
[top](#top)

Now we want to wrap an extra `div` around `#footer`. We add a `div` node to the
`html` node, and put the attribute `surround="//*[@id='footer']"` on it:

    <html base="abstract/base.html">
        <div id="content" replace="//*[@id='content']">
            This is the real content.
        </div>
        <link append="//head" rel="stylesheet" href="css/home.css"/>
        <strong prepend="//*[@id='header']">Welcome to </strong>
        <li before="//*[@id='footer-links']/li[2]"><a href="#">About</a></li>
        <p after="//*[@id='header']/h1"><a href="#">Logout</a></p>
        <div surround="//*[@id='footer']" id="footer-wrap"></div>
    </html>

Viewed in the browser, `home.html` will look like this:

    <!doctype html>
    <html>
        <head>
            <script src="js/my-scripts.js"></script>
            <link rel="stylesheet" href="css/my-styles.css"></script>
            <link rel="stylesheet" href="css/home.css"></script>
        </head>
        <body>
            <div id="header">
                <strong>Welcome to </strong><h1>My Neat Site</h1>
                <p><a href="#">Logout</a></p>
            </div>
            <div id="content">
                This is the real content.
            </div>
            <div id="footer-wrap">
                <div id="footer">
                    <span id="copy">Copyright 2012 My Company</span>
                    <ul id="footer-links">
                        <li><a href="#">Legal</a></li>
                        <li><a href="#">About</a></li>
                        <li><a href="#">Contact</a></li>
                    </ul>
                </div>
            </div>
        </body>
    </html>

###Merge
[top](#top)

Now we want to add a class to the `body` node. We add a `body` node as a child
of our `html` node, with the attribute `merge="//body"`. It actually doesn't
matter what type of node we use here, only its attributes are merged.

    <html base="abstract/base.html">
        <div id="content" replace="//*[@id='content']">
            This is the real content.
        </div>
        <link append="//head" rel="stylesheet" href="css/home.css"/>
        <strong prepend="//*[@id='header']">Welcome to </strong>
        <li before="//*[@id='footer-links']/li[2]"><a href="#">About</a></li>
        <p after="//*[@id='header']/h1"><a href="#">Logout</a></p>
        <div surround="//*[@id='footer']" id="footer-wrap"></div>
        <body merge="//body" class="home"></body>
    </html>

And now in the browser:

    <!doctype html>
    <html>
        <head>
            <script src="js/my-scripts.js"></script>
            <link rel="stylesheet" href="css/my-styles.css"></script>
            <link rel="stylesheet" href="css/home.css"></script>
        </head>
        <body class="home">
            <div id="header">
                <strong>Welcome to </strong><h1>My Neat Site</h1>
                <p><a href="#">Logout</a></p>
            </div>
            <div id="content">
                This is the real content.
            </div>
            <div id="footer-wrap">
                <div id="footer">
                    <span id="copy">Copyright 2012 My Company</span>
                    <ul id="footer-links">
                        <li><a href="#">Legal</a></li>
                        <li><a href="#">About</a></li>
                        <li><a href="#">Contact</a></li>
                    </ul>
                </div>
            </div>
        </body>
    </html>

###Remove
[top](#top)

Now we'll say that in `home.html` we don't want to include the "Legal" footer
link. We add a node (the type doesn't matter, we'll use a `div` here) to the
`html` element, and give it the attribute `remove="//div[@id='footer']"`.

    <html base="abstract/base.html">
        <div id="content" replace="//*[@id='content']">
            This is the real content.
        </div>
        <link append="//head" rel="stylesheet" href="css/home.css"/>
        <strong prepend="//*[@id='header']">Welcome to </strong>
        <li before="//*[@id='footer-links']/li[2]"><a href="#">About</a></li>
        <p after="//*[@id='header']/h1"><a href="#">Logout</a></p>
        <div surround="//*[@id='footer']" id="footer-wrap"></div>
        <body merge="//body" class="home"></body>
        <div remove="//*[@id='footer-links']/li[1]"></div>
    </html>

In the browser `home.html` looks like this:

    <!doctype html>
    <html>
        <head>
            <script src="js/my-scripts.js"></script>
            <link rel="stylesheet" href="css/my-styles.css"></script>
            <link rel="stylesheet" href="css/home.css"></script>
        </head>
        <body class="home">
            <div id="header">
                <strong>Welcome to </strong><h1>My Neat Site</h1>
                <p><a href="#">Logout</a></p>
            </div>
            <div id="content">
                This is the real content.
            </div>
            <div id="footer-wrap">
                <div id="footer">
                    <span id="copy">Copyright 2012 My Company</span>
                    <ul id="footer-links">
                        <li><a href="#">About</a></li>
                        <li><a href="#">Contact</a></li>
                    </ul>
                </div>
            </div>
        </body>
    </html>

###Require
[top](#top)

Let's say we have a certain bit of content, some sort of widget that we want to
include on various pages, but not in the same location. For this we use
`require`. First we need to create a file to put the widget markup in, let's
make it `fragments/widget.html`. Required files must be valid XML, which means a
single root element - we use `fragment`:

    <fragment>
        <div class="widget">My neat widget.</div>
    </fragment>

And then in `home.html` we add a `div` node (the type of node here doesn't
matter - it isn't used) to the `html` node and give it the attribute
`require="fragments/widget.html"`. We want to add the widget to the body, so we
also use `append`:

    <html base="abstract/base.html">
        <div id="content" replace="//*[@id='content']">
            This is the real content.
        </div>
        <link append="//head" rel="stylesheet" href="css/home.css"/>
        <strong prepend="//*[@id='header']">Welcome to </strong>
        <li before="//*[@id='footer-links']/li[2]"><a href="#">About</a></li>
        <p after="//*[@id='header']/h1"><a href="#">Logout</a></p>
        <div surround="//*[@id='footer']" id="footer-wrap"></div>
        <body merge="//body" class="home"></body>
        <div remove="//*[@id='footer-links']/li[1]"></div>
        <div require="fragments/widget.html" append="//body"></div>
    </html>

When loaded in the browser, `home.html` will now look like this:

    <!doctype html>
    <html>
        <head>
            <script src="js/my-scripts.js"></script>
            <link rel="stylesheet" href="css/my-styles.css"></script>
            <link rel="stylesheet" href="css/home.css"></script>
        </head>
        <body class="home">
            <div id="header">
                <strong>Welcome to </strong><h1>My Neat Site</h1>
                <p><a href="#">Logout</a></p>
            </div>
            <div id="content">
                This is the real content.
            </div>
            <div id="footer-wrap">
                <div id="footer">
                    <span id="copy">Copyright 2012 My Company</span>
                    <ul id="footer-links">
                        <li><a href="#">About</a></li>
                        <li><a href="#">Contact</a></li>
                    </ul>
                </div>
            </div>
            <div class="widget">My neat widget.</div>
        </body>
    </html>

The `require` attribute can be used anywhere - inside a base document, inside a
document that extends a base document, or inside another required document.

###Nested Inheritance
[top](#top)

Now let's say we've got another subset of pages that should use `home.html` as a
common base, and then extend it further. We simply create another html file for
each of these, for example `home2.html` and fill it as so:

    <html base="home.html">
    </html>

And then you can go and add actions to the `html` node in `home2.html` as
described above.
