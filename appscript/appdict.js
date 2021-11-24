Array.prototype.resize = function(newSize) {

    if (newSize < this.length) {
        this.length = newSize;
    }

    return this
}

const dict = {};
dictcount = 0;
dictdone = false;

for (i=0; i<26; i++) {
    _.json('./data/'+(i+1)+'.json',(dat) => {
        Object.keys(dat)
            .forEach(key => dict[key] = dat[key]);
        dictcount++;
    })
}

_('#bulkinput').addEventListener('input',() => {
    _('.bulk .content .result').innerHTML = '';
    term = _('#bulkinput').value

    

    if (term != '') {
        term = term.toUpperCase()
        term = term.replace("<", "&lt;");
        term = term.replace(">", "&gt;");


        result = Object.keys(dict)
                       .filter(item => item.startsWith(term))
                       .sort((a,b) => a.length - b.length)
                       .resize(30)
                       .forEach(each=> {
                           
                           div = document.createElement('li');
                           div.classList.add('searchresult');

                           p = document.createElement('p');
                           p.classList.add('word');
                           p.innerHTML = each;
                           div.appendChild(p);

                           _('.bulk .content .result').appendChild(div);

                       })  

        online = document.createElement('li');
        online.classList.add('searchresult');
        online.classList.add('online');

        onlinetext = document.createElement('p');
        onlinetext.classList.add('word');
        onlinetext.innerHTML = `<strong>SEARCH ONLINE</strong> ${term}`;
        online.appendChild(onlinetext);
        _('.bulk .content .result').appendChild(online);
    }
})