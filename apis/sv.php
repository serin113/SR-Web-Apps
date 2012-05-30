<html>
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
var editor = CodeMirror.fromTextArea(document.getElementById("meh"), {mode: "text/html", tabMode: "indent", lineNumbers: "true", readOnly: "nocursor"});
</script>
<script type="text/javascript">
if (window.top!=window.self){
document.getElementById('form').submit
}
</script>
</body>
</html>