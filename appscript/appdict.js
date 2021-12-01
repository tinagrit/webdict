Array.prototype.resize = function(newSize) {

    if (newSize < this.length) {
        this.length = newSize;
    }

    return this
}

// function notInViewport(element) {
//     const rect = element.getBoundingClientRect();
//     if (
//         rect.top >= 0 &&
//         rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
//     ) {
//         return false;
//     } else {
//         return [rect.top,rect.bottom];
//     }
// }


const dict = {};
dictcount = 0;
dictdone = false;

let selectindex = -1;

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
                           div.onclick = function() {
                               selectme(this)
                           }

                           p = document.createElement('p');
                           p.classList.add('word');
                           p.innerHTML = each;
                           div.appendChild(p);

                           _('.bulk .content .result').appendChild(div);

                       })  

        online = document.createElement('li');
        online.classList.add('searchresult');
        online.classList.add('online');
        online.onclick = function() {
            searchme(this)
        }

        onlinetext = document.createElement('p');
        onlinetext.classList.add('word');
        onlinetext.classList.add('onlineword');
        onlinetext.innerHTML = `<strong>SEARCH ONLINE</strong> ${term}`;
        online.appendChild(onlinetext);
        _('.bulk .content .result').appendChild(online);

        selectindex = 0;
        _('.searchresult','0').class.add('selected');
        _('.searchresult','0').focus();
    }

    _('.result').scrollTop = 0;
    showWord(_('.searchresult.selected>p.word:not(.onlineword)').innerHTML);
    
})

document.addEventListener('keydown',moveResults)

function selectme(w) {
    _('.selected').class.remove('selected');

    selectindex = Array.from(w.parentNode.children).indexOf(w)

    _(w).class.add('selected');

    console.log(_('.searchresult.selected>p.word:not(.onlineword)').innerHTML);
    showWord(_('.searchresult.selected>p.word:not(.onlineword)').innerHTML);
}

function moveResults(e) {
    if (_('.bulk').class.has('active')) {
        if (e.keyCode == 40) {
            if (selectindex != _('.result').childElementCount -1) {
                e.preventDefault();
                _('.selected').class.remove('selected')
                selectindex++;
                _('.searchresult',String(selectindex)).class.add('selected');
                _('.searchresult',String(selectindex)).focus();

                showWord(_('.searchresult.selected>p.word:not(.onlineword)').innerHTML);
            }
        }
        if (e.keyCode == 38) {
            if (selectindex != 0) {
                e.preventDefault();
                _('.selected').class.remove('selected')
                selectindex--;
                _('.searchresult',String(selectindex)).class.add('selected');
                _('.searchresult',String(selectindex)).focus();

                showWord(_('.searchresult.selected>p.word:not(.onlineword)').innerHTML);
            }
        }

        _('.result').scrollTop = 0;

        let offset = _('.searchresult.selected').getBoundingClientRect().top - _('.result').getBoundingClientRect().top

        _('.result').scrollTop = offset - parseFloat(getComputedStyle(_('.searchresult.selected'), null).height.replace("px", ""));

        console.log(_('.searchresult.selected>p.word:not(.onlineword)').innerHTML);
        
    }
}

let a
function showWord(word) {
    let dicSearch = dict[word];

    _('.alldefines').innerHTML = '';
    _('.previewdefinition .synonyms').innerHTML = '';

    _('.previewdefinition .word').innerHTML = word;

    let allmeanings = Object.values(dicSearch.MEANINGS);

    allmeanings.forEach(each => {
        definebig = document.createElement('div');
        definebig.classList.add('define');

        definepos = document.createElement('p');
        definepos.classList.add('partOfSpeech');
        definepos.innerHTML = each[0];
        definebig.appendChild(definepos);

        definemea = document.createElement('p');
        definemea.classList.add('meaning');
        definemea.innerHTML = each[1];
        definebig.appendChild(definemea)

        _('.alldefines').appendChild(definebig)
    })

    if (dicSearch.SYNONYMS.length > 0) {
        dicSearch.SYNONYMS.forEach(each=> {
            result = '';
            _('.previewdefinition .synonyms').innerHTML += each + ', ';
            
        })
        _('.previewdefinition .synonyms').innerHTML = _('.previewdefinition .synonyms').innerHTML.slice(0, -2);
    }
}