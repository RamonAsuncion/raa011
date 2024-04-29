<!--update the page with the correct answer-->
<?php
if (isset($_POST['question-1-answers']) && isset($_POST['question-2-answers']) && isset($_POST['question-3-answers']) && isset($_POST['question-4-answers'])) {
  $answer1 = $_POST['question-1-answers'];
  $answer2 = $_POST['question-2-answers'];
  $answer3 = $_POST['question-3-answers'];
  $answer4 = $_POST['question-4-answers'];

  $totalCorrect = 0;

  if ($answer1 == "A") {
    $totalCorrect++;
  }
  if ($answer2 == "A") {
    $totalCorrect++;
  }
  if ($answer3 == "D") {
    $totalCorrect++;
  }
  if ($answer4 == "A") {
    $totalCorrect++;
  }
  echo "<div id='results'>$totalCorrect / 4 correct</div>";
}
?>
