<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">

	<title>tech wizard</title>
	<link rel="icon" type="image/x-icon" href="./images/wizard.ico">
	<link rel="stylesheet" type="text/css" href="style.css">

	<!--Google Font Silkscreen-->
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Silkscreen&display=swap" rel="stylesheet">
</head>

<body>
	<div class="main-section">
		<h1 class="bouncing">
			<span>t</span>
			<span>h</span>
			<span>e</span>
			&nbsp;
			<span>p</span>
			<span>o</span>
			<span>i</span>
			<span>n</span>
			<span>t</span>
			&nbsp;
			<span>o</span>
			<span>f</span>
			&nbsp;
			<span>n</span>
			<span>o</span>
			&nbsp;
			<span>r</span>
			<span>e</span>
			<span>t</span>
			<span>u</span>
			<span>r</span>
			<span>n</span>
		</h1>
		<h2>ramón</h2>
		<h3>b.s. <span class="small-text">in</span> computer science</h3>
		<img src="./images/crazy.gif" alt="dance" width="300" height="300">
	</div>


	<div class="projects">
		<h2 class="courses-title">CS Courses</h2>
		<ul class="courses">
			<li><a href="musc216/musc">MUSC 216 Projects</a></li>
			<li><a href="csci201/csci">CSCI 201 Projects</a></li>
			<s>
				<li><a href="math227/math" class="disabled">MATH 227 Projects</a></li>
			</s>
			<s>
				<li><a href="csci205/csci" class="disabled">CSCI 205 Projects</a></li>
			</s>
			<s>
				<li><a href="csci204/csci" class="disabled">CSCI 204 Projects</a></li>
			</s>
		</ul>
	</div>
	<div class="footer">
		<?php

		// The list of the domains.
		$personal_website = "https://www.ramonasuncion.com";
		$github_website = "https://github.com/RamonAsuncion";

		function url_online($url) {
			$handle = curl_init($url);

			curl_setopt($handle,  CURLOPT_RETURNTRANSFER, TRUE);

			/* Get the HTML */
			$response = curl_exec($handle);

			/* Check for 404 (file not found). */
			$httpCode = curl_getinfo($handle, CURLINFO_HTTP_CODE);

			curl_close($handle);

			return ($httpCode === 200) ? "working" : "down";
		};


		// Check if the listed websites are online.	
		$status1 = url_online($personal_website);
		$status2 = url_online($github_website);

		echo <<<EOT
		<p>
			my website: <a href=$personal_website target="_blank" rel="noopener noreferrer">ramonasuncion.com</a>
			status: $status1
			<br>
			github: <a href="$github_website" target="_blank" rel="noopener noreferrer">github.com/RamonAsuncion</a>
			status: $status2
		</p>
		EOT;
		?>
	</div>
</body>

</html>