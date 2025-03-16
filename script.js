$(document).ready(function() {
  // Controllo se il browser supporta FileReader
  if (!window.FileReader) {
    alert('Il tuo browser non supporta la lettura dei file. Si prega di aggiornare il browser.');
    return;
  }

  // Aggiungiamo i listener agli input file
  $('#following-file, #followers-file').on('change', handleFiles);

  let followingData = '';
  let followersData = '';

  function handleFiles(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      const content = e.target.result;
      if (event.target.id === 'following-file') {
        followingData = extractUsernames(content);
        updateButtonStatus('following-file');
      } else {
        followersData = extractUsernames(content);
        updateButtonStatus('followers-file');
      }

      if (followingData && followersData) {
        hideFileButtons();
        displayNonFollowers();
      }
    };

    reader.readAsText(file);
  }

  function extractUsernames(html) {
    const regex = /https:\/\/www\.instagram\.com\/([a-zA-Z0-9._]+)/g;
    let usernames = [];
    let match;
    while ((match = regex.exec(html)) !== null) {
      usernames.push(match[1]);
    }
    return usernames;
  }

  function displayNonFollowers() {
    const $output = $('#output');
    $output.empty();

    const nonFollowers = followingData.filter(
      (user) => !followersData.includes(user)
    );

    nonFollowers.forEach((user) => {
      // Card container con animazione al hover
      const $card = $('<div>', {
        class: 'bg-dark-card hover:bg-dark-card/90 rounded-xl p-4 w-64 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1'
      });
      
      // Username link con stile moderno
      const $usernameLink = $('<a>', {
        href: `https://www.instagram.com/${user}`,
        target: '_blank',
        text: user,
        class: 'text-white hover:text-accent font-medium text-lg block mb-3 transition-colors duration-300'
      });

      // Checkbox container con layout migliorato
      const $cardInput = $('<div>', {
        class: 'flex items-center gap-3 p-2 rounded-lg hover:bg-black/20 transition-colors duration-300 cursor-pointer'
      });
      
      // Checkbox personalizzata
      const $checkbox = $('<input>', {
        type: 'checkbox',
        id: `checkbox-${user}`,
        name: 'r',
        value: user,
        class: 'w-5 h-5 rounded border-gray-400 text-success focus:ring-success transition-colors duration-300'
      });

      // Label della checkbox
      const $labelForCheckbox = $('<label>', {
        for: `checkbox-${user}`,
        html: 'Da fare',
        class: 'text-gray-200 select-none'
      });

      $cardInput.append($checkbox, $labelForCheckbox);
      $card.append($usernameLink, $cardInput);

      // Event listener per il click sulla card
      $cardInput.on('click', function(event) {
        if (!$(event.target).is('input, label')) {
          $checkbox.prop('checked', !$checkbox.prop('checked'));
          updateCardStyle($card, $checkbox);
        }
      });

      // Event listener per il cambio stato della checkbox
      $checkbox.on('change', function() {
        updateCardStyle($card, $(this));
      });

      $output.append($card);
    });
  }

  function updateCardStyle($card, $checkbox) {
    if ($checkbox.prop('checked')) {
      $card.addClass('bg-success hover:bg-success-hover')
           .removeClass('bg-dark-card hover:bg-dark-card/90');
    } else {
      $card.removeClass('bg-success hover:bg-success-hover')
           .addClass('bg-dark-card hover:bg-dark-card/90');
    }
  }

  function updateButtonStatus(fileId) {
    $(`label[for="${fileId}"]`)
      .text('Fatto!')
      .removeClass('bg-primary hover:bg-primary-hover')
      .addClass('bg-success hover:bg-success-hover');
  }

  function hideFileButtons() {
    $('.file-buttons')
      .addClass('opacity-0')
      .one('transitionend', function() {
        $(this).addClass('hidden');
      });
  }
});