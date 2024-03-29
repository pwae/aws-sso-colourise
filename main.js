let currentData = undefined;

window.onload = function() {
    pageLoad(1);
}

function pageLoad(counter) {
    const menuExists = document.querySelector('[data-testid="awsc-nav-regions-menu-button"]>span');
    if (currentData && menuExists || counter > 10)
    {
        let regionId = document.querySelector('meta[name="awsc-mezz-region"]').content;
        const regionName = document.querySelector('[data-testid="awsc-nav-regions-menu-button"]>span').innerText;

        if (regionName == "Global") {
            regionId = "🌍";
        }

        const accessandUser = document.querySelector('[data-testid="awsc-nav-account-menu-button"]>span').innerText;
        const accountTitle = document.querySelector('[data-testid="awsc-nav-account-menu-button"]>span').title;
        let accountAlias = undefined;
        if (accountTitle.indexOf('@') >= 0)
        {
            const titleSplit = accountTitle.split('@')
            accountAlias = titleSplit[titleSplit.length-1].replace(' ', '');
        }
        let accountNumber = '';
        if (document.querySelector('input[name=account]'))
        {
            accountNumber = document.querySelector('input[name=account]').value;
        } else {
            const tmpAN = document.querySelector('div[id=menu--account]').querySelectorAll('span')[1].innerText;
            accountNumber = tmpAN.replace(/-/g,'');
        }
        document.querySelector('[data-testid="awsc-nav-regions-menu-button"]>span').innerText = regionId + " (" + regionName + ")";
        document.querySelector('[data-testid="awsc-nav-account-menu-button"]>span').innerHTML = "<strong>" + accountAlias + "</strong>:  " + accessandUser;
        colourHeader(accountAlias, accountNumber);
    }
    else {
        setTimeout(function() { pageLoad(counter+1) }, 100);
    }
}

function shouldTextBeBlack (backgroundcolor) {
    return computeLuminence(backgroundcolor) > 0.179;
}

function computeLuminence(backgroundcolor) {
    var colors = hexToRgb(backgroundcolor);
    
    var components = ['r', 'g', 'b'];
    for (var i in components) {
        var c = components[i];
        
        colors[c] = colors[c] / 255.0;

        if (colors[c] <= 0.03928) { 
            colors[c] = colors[c]/12.92;
        } else { 
            colors[c] = Math.pow (((colors[c] + 0.055) / 1.055), 2.4);
        }
    }
    
    var luminence = 0.2126 * colors.r + 0.7152 * colors.g + 0.0722 * colors.b;

    return luminence;
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}


//var style = 'background: rgb(2,0,36); background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,121,68,1) 71%)';
//document.querySelector('[data-testid=awsc-nav-header]>nav').setAttribute('style', style);

function colourHeader(alias, number) {
    console.log('Colour for ', alias, ' and ', number);
    for (const acc in currentData) {
        if (acc == alias || acc == number)
        {
            var colour = currentData[acc];
            var textcolour = '';
            if (shouldTextBeBlack(colour)) {
                textcolour = 'color: #000 !important';
            }
            var style = 'background: rgb(2,0,36); background: linear-gradient(90deg, rgba(2,0,36,1) 0%, ' + currentData[acc] + ' 71%); ' + textcolour;
            document.querySelector('[data-testid=awsc-nav-header]>nav').setAttribute('style', style);

            // set text colour to black if required
            document.querySelector('[data-testid=more-menu__awsc-nav-account-menu-button]').style = textcolour;
            document.querySelector('[data-testid=more-menu__awsc-nav-regions-menu-button]').style = textcolour;
            document.querySelector('[data-testid=awsc-nav-support-menu-button]').style = textcolour;
            document.querySelector('div[data-testid=awsc-phd__bell-icon]').style = textcolour;
            document.querySelector('[data-testid=awsc-nav-scallop-icon]').style = textcolour;
        }
    }
}

chrome.storage.sync.get(['accounts'], (results) => {
    if (Object.keys(results.accounts).length > 0) {
        currentData = results.accounts;
    }
});