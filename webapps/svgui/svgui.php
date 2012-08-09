<html>
<!--
Copyright (c) 2012 SeRepo

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
-->
<head>
<title>SourceViewer</title>
<meta name="apple-mobile-web-app-capable" content="yes"/>
<meta name="viewport" content="initial-scale=1, user-scalable=no, maximum-scale=1"/>
<meta name="apple-mobile-web-app-status-bar-style" content="black"/>
<link rel="stylesheet" href="apis/codemirror/codemirror.css">
<script src="apis/codemirror/codemirror.js"></script>
<script src="apis/codemirror/xml.js"></script>
<script src="apis/codemirror/javascript.js"></script>
<script src="apis/codemirror/css.js"></script>
<script src="apis/codemirror/htmlmixed.js"></script>
</head>
<body style="color:black; margin:0px; padding:0px; background-color:white; -webkit-user-select:none" onload="toggle(); setVal(); noUrl()">
<div id="holdem" style="position:fixed; bottom:0; z-index:1000; background-color:rgba(240,240,240,0.6); display:none; width:100%; text-align:center; -webkit-tap-highlight-color:rgba(0,0,0,0)" onclick="toggle()" ontouchmove="javascript:return false;">
<a style='color:rgba(0,0,0,0.1)' >Show Viewer Bar</a>
</div>
<form style="width:100%; position:fixed; bottom:0; background-color:white; text-align:center; z-index:1000; margin:0px; display:none" id="dov" ontouchmove="javascript:return false;">
<input type="text" value="http://" name="url"/><input type="submit" value="View Source"/><input type="button" value="Hide" onclick="toggle()"/>
</form>
<script type="text/javascript">
var div = document.getElementById('dov')
var holder = document.getElementById("holdem")
function gup(name)
{
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
    return "";
  else
    return results[1];
}
function hide(){
div.style.display="none";
holder.style.display="block";
}
function show(){
div.style.display="block";
holder.style.display="none";
}
function toggle(){
if(holder.style.display=="none"){
hide()
}
else{
show()
}
}
function setVal(){
var eurl = gup("url")
var leurl = unescape(eurl)
document.getElementsByName("url")[0].value = leurl
}
function noUrl(){
if(gup("url")==""){
toggle();
document.getElementsByName("url")[0].value="http://";
}
}
</script>
<form id="form" style="margin-bottom:0px" readonly="readonly">
<input type="hidden" name="url"  value="<? echo "$_GET[url]"; ?>">
<textarea id="meh" name="meh" style="display:inline-block; width:100%; display:none" readonly="readonly">
<?
if ( isset($_GET[url]) )
{
@$string = file_get_contents($_GET[url]) or printf("<errstart>\n\n'$_GET[url]' seems to be invalid.\nTry entering a different URL.\n\n<errend>");/*die("Cannot read $_GET[url]");*/

$string = str_replace("><", ">\n<", $string);

$string = htmlspecialchars($string);
echo "$string";
}
elseif ( !(array_key_exists('url', $_GET)) )
{
printf("<start>\n\nWelcome to SourceViewer.\nEnter a URL below to start.\n\n<end>");
}
?>
</textarea>
</form>
<script type="text/javascript">
var editor = CodeMirror.fromTextArea(document.getElementById("meh"), {mode: "text/html", tabMode: "indent", lineNumbers: "true", readOnly: "nocursor", lineWrapping: "true"});
</script>
<script type="text/javascript">
if (window.top!=window.self){
document.getElementById('form').submit()
}
</script>
</body>
</html>