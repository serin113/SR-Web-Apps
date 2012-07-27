## SourceViewer
SourceViewer lets you preview the page source of any website.
The SourceViewer API goes in this syntax: ```http://sr-apis.comyr.com/sv.php?url=yoururlhere```
with ```yoururlhere``` as URL of the page which you want to view its source (which must include ```http://```).
To embed it, all you have to do is make an ```<iframe>``` (or ```<embed>```), set src to refer to a website via the API,
set width and height to desired values then you're done!

There's a webapp version [here](http://test.serepo.site88.net/svgui.php).

#### Bonus:
You can use this to view any page source via a bookmarklet.
Just copy the code below and add it as a bookmark.
```
javascript:window.location.href='http://sr-apis.comyr.com/sv.php?url='+window.location.href
```
Then while you're on another website, you can click the bookmark to instantly view the page source of the website.
This works on any device that supports JavaScript bookmarklets (including iPhone).

#### Troubleshooting:
If the API shows an error message or does not show anything, try adding "www" to the URL (i.e. ```http://yahoo.com``` will not work, use ```http://www.yahoo.com``` instead).

#### Credits:
SourceViewer is based on [http://eclecticdjs.com/mike/tutorials/php/files_04.php](http://eclecticdjs.com/mike/tutorials/php/files_04.php).
Syntax highlighting feature from [CodeMirror](http://codemirror.net/).