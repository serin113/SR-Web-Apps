<html>
<body style="color:black; margin:0px">
<?
# prevent sourcing of your PHP files
if ( isset($_GET[url]) && !preg_match("@^http://@i", "$_GET[url]", $x)  )
{ 
echo "No URL entered or URL not detected.";
exit; 
}
?>
<form id="form" style="margin-bottom:0px">
<input type="hidden" name="url"  value="<? echo "$_GET[url]"; ?>">
<textarea id="meh" style="display:block; width:100%; height:100%" readonly="readonly">
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
if (window.top!=window.self){
document.getElementById('form').submit
}
</script>
</body>
</html>