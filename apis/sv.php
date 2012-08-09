<html>
<!--
Copyright (c) 2012 SeRepo

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
-->
<head>
<title>SourceViewer</title>
<meta name="viewport" content="initial-scale=1, user-scalable=no, maximum-scale=1"/>
<link rel="stylesheet" href="codemirror/codemirror.css">
<script src="codemirror/codemirror.js"></script>
<script src="codemirror/xml.js"></script>
<script src="codemirror/javascript.js"></script>
<script src="codemirror/css.js"></script>
<script src="codemirror/htmlmixed.js"></script>
</head>
<body style="color:black; margin:0px; background-color:white">
<?
# prevent sourcing of your PHP files
if ( isset($_GET[url]) && !preg_match("@^http://@i", "$_GET[url]", $x)  )
{ 
echo "No URL entered or URL not detected.";
exit; 
}
?>
<form id="form" style="margin-bottom:0px" readonly="readonly">
<input type="hidden" name="url"  value="<? echo "$_GET[url]"; ?>">
<textarea id="meh" name="meh" style="display:inline-block; width:100%; height:100%" readonly="readonly">
<?
if ( isset($_GET[url]) )
{
/*
read source code into a string
suppress PHP error messages
die if can't read file
*/
@$string = file_get_contents($_GET[url]) or die("Cannot read $_GET[url]");
# make line breaks in source code for readability
$string = str_replace("><", ">\n<", $string);
# escape angle brackets for textarea
$string = htmlspecialchars($string);
echo "$string";
}
?>
</textarea>
</form>
<script type="text/javascript">
var editor = CodeMirror.fromTextArea(document.getElementById("meh"), {mode: "text/html", tabMode: "indent", lineNumbers: "true", readOnly: "nocursor", lineWrapping: "true"});
</script>
</body>
</html>