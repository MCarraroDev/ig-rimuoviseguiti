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

    // Quando il file è caricato, eseguiamo l'elaborazione
    reader.onload = function (e) {
      const content = e.target.result;
      if (event.target.id === 'following-file') {
        followingData = extractUsernames(content);
        updateButtonStatus('following-file');
      } else {
        followersData = extractUsernames(content);
        updateButtonStatus('followers-file');
      }

      // Quando entrambi i file sono caricati, mostriamo i risultati
      if (followingData && followersData) {
        hideFileButtons(); // Nascondiamo i pulsanti dopo il caricamento
        displayNonFollowers();
      }
    };

    // Se il browser supporta FileReader, leggiamo il file come testo
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

  // Funzione per mostrare gli utenti che segui ma che non ti seguono indietro
  function displayNonFollowers() {
    const $output = $('#output');
    $output.empty(); // Pulisce il contenuto precedente

    const nonFollowers = followingData.filter(
      (user) => !followersData.includes(user)
    );

    nonFollowers.forEach((user) => {
      const $card = $('<div>', { class: 'card' });
      
      const $usernameLink = $('<a>', {
        href: `https://www.instagram.com/${user}`,
        target: '_blank',
        text: user
      });

      const $cardInput = $('<div>', { class: 'checkbox-wrapper-11' });
      
      const $checkbox = $('<input>', {
        type: 'checkbox',
        id: `checkbox-${user}`,
        name: 'r',
        value: user
      });

      const $labelForCheckbox = $('<label>', {
        for: `checkbox-${user}`,
        html: 'Da fare'
      });

      // Costruisci la struttura della card
      $cardInput.append($checkbox, $labelForCheckbox);
      $card.append($usernameLink, '<br>', $cardInput);

      // Event listener per attivare/disattivare la checkbox cliccando sul div
      $cardInput.on('click', function(event) {
        if (!$(event.target).is('input, label')) {
          $checkbox.prop('checked', !$checkbox.prop('checked'));
          updateCardStyle($card, $checkbox);
        }
      });

      // Event listener per gestire il cambio di stato della checkbox
      $checkbox.on('change', function() {
        updateCardStyle($card, $(this));
      });

      $output.append($card);
    });
  }

  // Funzione helper per aggiornare lo stile della card
  function updateCardStyle($card, $checkbox) {
    $card.toggleClass('checked', $checkbox.prop('checked'));
  }

  // Aggiorna lo stato del pulsante dopo il caricamento del file
  function updateButtonStatus(fileId) {
    $(`label[for="${fileId}"]`)
      .text('Fatto!')
      .addClass('done');
  }

  // Nascondi i pulsanti per il caricamento dei file
  function hideFileButtons() {
    $('.file-buttons').addClass('hidden');
  }
});