# SR API Docs

## SourceViewer

SourceViewer lets you embed a page source on any website.
The SourceViewer API goes in this syntax: **http://test.serepo.site88.net/apis/sv.php?url="yoururlhere"**
with **"yoururlhere"** (without the quotation marks) as URL of the page which you want to view its source (which must include **http://**).
To embed it, all you have to do is make an iframe, set src to refer to a website via the API,
set width and height to desired values, set style to "border:0px" to make it look like a textarea, then you're done!
Live demo [here](http://test.serepo.site88.net/apis/sourceviewerdemo.html).
#### Credits:
SourceViewer is based on [http://eclecticdjs.com/mike/tutorials/php/files_04.php](http://eclecticdjs.com/mike/tutorials/php/files_04.php)