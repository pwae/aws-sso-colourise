const regionId = document.querySelector('meta[name="awsc-mezz-region"]').content;
const regionName = document.querySelector('[data-testid="awsc-nav-regions-menu-button"]>span').innerText;
const accessandUser = document.querySelector('[data-testid="awsc-nav-account-menu-button"]>span').innerText;
const accountAlias = document.querySelector('[data-testid="awsc-nav-account-menu-button"]>span').title.split('@')[2].replace(' ', '')
const accountNumber = document.querySelector('input[name=account]').value;

document.querySelector('[data-testid="awsc-nav-regions-menu-button"]>span').innerText = regionId + " (" + regionName + ")";
document.querySelector('[data-testid="awsc-nav-account-menu-button"]>span').innerHTML = "<strong>" + accountAlias + "</strong>:  " + accessandUser;

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

chrome.storage.sync.get(['accounts'], (results) => {
    if (Object.keys(results.accounts).length > 0) {
        for (const acc in results.accounts) {
            if (acc == accountAlias || acc == accountNumber)
            {
                var colour = results.accounts[acc];
                var textcolour = '';
                if (shouldTextBeBlack(colour)) {
                    textcolour = 'color: #000 !important';
                }
                var style = 'background: rgb(2,0,36); background: linear-gradient(90deg, rgba(2,0,36,1) 0%, ' + results.accounts[acc] + ' 71%); ' + textcolour;
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
    //var style = 'background: rgb(2,0,36); background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,121,68,1) 71%)';
    //document.querySelector('[data-testid=awsc-nav-header]>nav').setAttribute('style', style);
});