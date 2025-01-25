$(document).ready(function() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  let oscillators = [];

  function getColor(frequency) {
      const hue = (frequency / 5000) * 360; // Map frequency to hue (0-360)
      return `hsl(${hue}, 100%, 50%)`; // HSL color
  }

  $('.slider').each(function() {
      const frequency = $(this).data('frequency');
      const labelId = $(this).next('span').attr('id');

      $(this).slider({
          value: frequency,
          min: 20,
          max: 5000,
          step: 1,
          slide: function(event, ui) {
              $('#' + labelId).text(ui.value);
              updateFrequency($(this), ui.value);
              $(this).css('background-color', getColor(ui.value)); // Change color
          }
      });

      $(this).on('slide', function(event, ui) {
          if (oscillators[$(this).index()]) {
              oscillators[$(this).index()].frequency.setValueAtTime(ui.value, audioContext.currentTime);
          } else {
              const oscillator = audioContext.createOscillator();
              oscillator.type = 'sine'; // Type of wave
              oscillator.frequency.setValueAtTime(ui.value, audioContext.currentTime);
              oscillator.connect(audioContext.destination);
              oscillator.start();
              oscillators[$(this).index()] = oscillator;
          }
      });

      $(this).css('background-color', getColor(frequency));
  });

  $('.slider').on('mouseup touchend', function() {
      const index = $(this).index();
      if (oscillators[index]) {
          oscillators[index].stop();
          oscillators[index] = null;
      }
  });

  function updateFrequency(slider, value) {
      const index = slider.index();
      if (oscillators[index]) {
          oscillators[index].frequency.setValueAtTime(value, audioContext.currentTime);
      }
  }
});
