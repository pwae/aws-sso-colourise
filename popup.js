function saveData() {
    var data = {};
    var saveButton = document.getElementById('save');
    saveButton.disabled = true;
    saveButton.textContent = 'Saving...';

    for (const row of document.querySelectorAll('tbody>tr')) {
        var accountId = row.getElementsByClassName('accid')[0].value.trim()
        var colour = row.getElementsByClassName('colour')[0].value;

        if (accountId.length) {
            data[accountId] = colour;
        }
    }

    chrome.storage.sync.set({accounts: data}, function() {
        saveButton.disabled = false;
        saveButton.textContent = 'Saved!';
        setTimeout(() => {
            saveButton.textContent = 'Save';
        }, 1500);
    });

}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function deleteAllRows() {
    var body = document.querySelector('tbody');
    body.replaceWith(document.createElement('tbody'));
}

function addRow(accid, colour) {
    const table = document.querySelector('#accountlist>tbody');
    var row = table.insertRow();

    var cell = row.insertCell();
    cell.innerHTML = '<input class="accid" type="text" />';
    if (accid) cell.firstChild.value = accid;

    var randomColour = getRandomColor();

    var cell = row.insertCell();
    cell.innerHTML = '<input class="colourtext" type="text" maxlength="7" value="' + randomColour + '">';
    if (accid) cell.firstChild.value = colour;
    cell.addEventListener('input', function(event) {
        var colourField = cell.parentElement.getElementsByClassName('colour')[0];
        colourField.value = event.target.value;
    });

    var cell = row.insertCell();
    cell.innerHTML = '<input class="colour" type="color" value="' + randomColour + '">';
    if (accid) cell.firstChild.value = colour;
    cell.addEventListener('input', function(event) {
        var colourText = cell.parentElement.getElementsByClassName('colourtext')[0];
        colourText.value = event.target.value;
    });

    var cell = row.insertCell();
    cell.innerHTML = '<a id="removelink" href="#">Remove</a>'
    cell.addEventListener('click', function() {
        table.deleteRow(row.rowIndex-1);
    })
}

document.querySelectorAll('input').forEach(input => {
    const cell = input.parentElement.parentElement;
    const region = cell.firstElementChild.innerText;
})

document.addEventListener('DOMContentLoaded', function() {
    var addNewButton = document.getElementById('addnew');
    addNewButton.addEventListener('click', function() {
        addRow();
    });

    var saveButton = document.getElementById('save');
    saveButton.addEventListener('click', function() {
        saveData();
    });

    var importButton = document.getElementById('import');
    importButton.addEventListener('click', function() {
        var data = window.prompt('Paste a import string', '');

        deleteAllRows();

        var rows = data.split(',');
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i].split(';');
            addRow(row[0], row[1]);
        }
        
        saveData();
    })

    var exportButton = document.getElementById('export');
    exportButton.addEventListener('click', function() {
        var allItems = [];
        for (const row of document.querySelectorAll('tbody>tr')) {
            var accountId = row.getElementsByClassName('accid')[0].value.trim()
            var colour = row.getElementsByClassName('colour')[0].value;
    
            if (accountId.length) {
                allItems.push(accountId + ';' + colour);
            }
        }

        var data = allItems.join(',');
        navigator.clipboard.writeText(data).then(function () {
            alert('Copied!');
        }, function() {
            alert('Use this as your export string:\n' + data);
        })
    })

    chrome.storage.sync.get(['accounts'], (results) => {
        if (Object.keys(results.accounts).length > 0) {
            for (const acc in results.accounts) {
                addRow(acc, results.accounts[acc]);
            }
        }
        else {
            addRow();
        }
    });
});