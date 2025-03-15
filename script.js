// Controllo se il browser supporta FileReader
if (!window.FileReader) {
  alert(
    'Il tuo browser non supporta la lettura dei file. Si prega di aggiornare il browser.'
  );
} else {
  // Aggiungiamo i listener agli input file
  document
    .getElementById('following-file')
    .addEventListener('change', handleFiles);
  document
    .getElementById('followers-file')
    .addEventListener('change', handleFiles);

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
    const output = document.getElementById('output');
    output.innerHTML = ''; // Pulisce il contenuto precedente

    const nonFollowers = followingData.filter(
      (user) => !followersData.includes(user)
    );

    nonFollowers.forEach((user) => {
      const card = document.createElement('div');
      card.classList.add('card');

      const usernameLink = document.createElement('a');
      usernameLink.href = `https://www.instagram.com/${user}`;
      usernameLink.target = '_blank';
      usernameLink.textContent = user;

      const cardInput = document.createElement('div');
      cardInput.classList.add('checkbox-wrapper-11');

      let checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.setAttribute('id', `checkbox-${user}`);
      checkbox.setAttribute('name', 'r');
      checkbox.setAttribute('value', user);
      cardInput.appendChild(checkbox);

      let labelForCheckbox = document.createElement('label');
      labelForCheckbox.setAttribute('for', `checkbox-${user}`);
      labelForCheckbox.innerHTML = 'Da fare';
      cardInput.appendChild(labelForCheckbox);

      // Aggiungi il link e la checkbox alla card
      card.appendChild(usernameLink);
      card.appendChild(document.createElement('br'));
      card.appendChild(cardInput);

      // Aggiungi la card al contenitore di output
      output.appendChild(card);

      // Event listener per attivare/disattivare la checkbox cliccando sul div, ma ignorando il click sul label
      cardInput.addEventListener('click', function (event) {
        if (
          event.target !== checkbox &&
          event.target !== labelForCheckbox
        ) {
          checkbox.checked = !checkbox.checked;
        }

        // Cambia lo stile della card in base allo stato della checkbox
        if (checkbox.checked) {
          card.classList.add('checked');
        } else {
          card.classList.remove('checked');
        }
      });

      // Event listener per gestire il cambio di stato della checkbox direttamente
      checkbox.addEventListener('change', function () {
        if (checkbox.checked) {
          card.classList.add('checked');
        } else {
          card.classList.remove('checked');
        }
      });
    });
  }

  // Aggiorna lo stato del pulsante dopo il caricamento del file
  function updateButtonStatus(fileId) {
    const label = document.querySelector(`label[for="${fileId}"]`);
    label.textContent = 'Fatto!';
    label.classList.add('done');
  }

  // Nascondi i pulsanti per il caricamento dei file
  function hideFileButtons() {
    const buttons = document.querySelector('.file-buttons');
    buttons.classList.add('hidden');
  }
}