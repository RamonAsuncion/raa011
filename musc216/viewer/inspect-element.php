<!-- 
References: 
The question mark represents the start of a Query String. 
Since data-src is blank we are passing in a file into the blank.
https://en.wikipedia.org/wiki/Query_string
https://prismjs.com/plugins/file-highlight/index.html
https://prismjs.com/plugins/jsonp-highlight/
https://www.w3schools.com/php/php_superglobals_get.asp 
-->
<!DOCTYPE html>
<html>
<head>
	<link href="prism.css" rel="stylesheet" />
</head>
<body>
	<script src="prism.js" async></script>
	<pre data-start="0" class="line-numbers" data-src="<?php echo $_GET['file']; ?>"></pre>
</body>
</html>
