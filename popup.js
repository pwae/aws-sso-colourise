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

function addRow(accid, colour) {
    const table = document.querySelector('#accountlist>tbody');
    var row = table.insertRow();
    var a = row.insertCell();
    a.innerHTML = '<input class="accid" type="text" />';
    var b = row.insertCell();
    b.innerHTML = '<td><input class="colour" type="color" value="#e6194b"></td>';

    if (accid) {
        a.firstChild.value = accid;
        b.firstChild.value = colour;
    }
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