// Fetch files here

let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

let touch = true;

const showTime = () => {
    date = new Date();
    _('#time').innerHTML = `${months[date.getMonth()]} ${date.getDate()} - ${date.getHours().zeroPad()}:${date.getMinutes().zeroPad()}`
}


showTime()
let timeinterv = setInterval(showTime,60000)


// After fetch, put home in place
_('.head').class.add('active');
_('.loading').class.remove('active')
_("#state").innerHTML = 'Home';
_('.homep').class.add('active');

// When a key is pressed
const checkKey = (e) => {
    if (e.keyCode == 27) {
        moveTo('.homep')
    }

    touch = false;

    _('#app>.body .homect .homeblock.keyboardparent').css('display','none');

    // https://stackoverflow.com/questions/4179708/how-to-detect-if-the-pressed-key-will-produce-a-character-inside-an-input-text
        if (String.fromCharCode(e.keyCode).match(/(\w|\s)/g)) {
            // console.log(e.key)
            if (e.key != 'Enter') {
                if (!_('.bulk').class.has('active')) {
                    moveTo('.bulk')
                }
                // _('#bulkinput').value = e.key;
                _('#bulkinput').focus();    
            } else {

            }
        } else {
            // console.log('not char')

            if (e.key == 'ArrowLeft' || e.key == 'ArrowRight')  {
                if (!_('.bulk').class.has('active')) {
                    moveTo('.bulk')
                }
            }
        }
    
}

// Move between different pages
function moveTo(a,b) {
    if (b == undefined) {
        switch (a) {
            case '.home'    : b = 'Home'    ;break
            case '.homep'   : b = 'Home'    ;break
            case '.bulk'    : b = 'Search'  ;break
            default         : b = 'App'     ;break
        }
    }

    _('.sc').class.remove('active');
    _('#state').innerHTML = b;
    _(a).class.add('active');

    if (a == '.bulk') {
        _('#bulkinput').value = '';
        _('#bulkinput').focus();
    }

    if (a == '.home') {
        if (_('.selected')) {
            _('.selected').class.remove('selected');
        }
    }
}

window.addEventListener('keydown', checkKey);

_('#app>.head .navigation').addEventListener('click', ()=>{moveTo('.homep')})
_('#app>.head .bulkbutton').addEventListener('click', ()=>{
    moveTo('.bulk');
})

_('#app>.body .homect .homeblock.dictionary').addEventListener('click', ()=>{moveTo('.bulk','Definition');})

_('#app>.body .homect .homeblock.thesaurus').addEventListener('click', ()=>{moveTo('.bulk','Thesaurus');})

_('#app>.body .homect .homeblock.example').addEventListener('click', ()=>{moveTo('.bulk','Example');})

_('#app>.body .homect .homeblock.phonetics').addEventListener('click', ()=>{moveTo('.bulk','Phonetics');})

_('#app>.body .homect .homeblock.random').addEventListener('click', ()=>{moveTo('.random','Random');})

_('#app>.body .homect .homeblock.history').addEventListener('click', ()=>{moveTo('.history','History');})

_('#app>.body .homect .homeblock.options').addEventListener('click', ()=>{moveTo('.options','Options');})


_('#app>.body .homect .homeblock.keyboardparent').addEventListener('click', ()=>{moveTo('.bulk');})






//https://stackoverflow.com/questions/8902787/navigate-through-list-using-arrow-keys-javascript-jq


function createLister(ul,scope) {
    var index = -1;

    var liSelected;
    

    document.addEventListener('keydown', function (event) {
        

        if (_(scope).class.has('active')) {
            var len = ul.getElementsByTagName('li').length - 1;
            if (event.which === 40) {
                index++;
                //down 
                if (liSelected) {
                    removeClass(liSelected, 'selected');
                    next = ul.getElementsByTagName('li')[index];
                    if (typeof next !== undefined && index <= len) {

                        liSelected = next;
                    } else {
                        index = 0;
                        liSelected = ul.getElementsByTagName('li')[0];
                    }
                    addClass(liSelected, 'selected');
                    console.log(index);
                } else {
                    index = 0;

                    liSelected = ul.getElementsByTagName('li')[0];
                    addClass(liSelected, 'selected');
                }
            } else if (event.which === 38) {

                //up
                if (liSelected) {
                    removeClass(liSelected, 'selected');
                    index--;
                    console.log(index);
                    next = ul.getElementsByTagName('li')[index];
                    if (typeof next !== undefined && index >= 0) {
                        liSelected = next;
                    } else {
                        index = len;
                        liSelected = ul.getElementsByTagName('li')[len];
                    }
                    addClass(liSelected, 'selected');
                } else {
                    index = 0;
                    liSelected = ul.getElementsByTagName('li')[len];
                    addClass(liSelected, 'selected');
                }
            }
        }
    }, false);

}
createLister(_('.homep ul.bottomrow'),'.homep')

createLister(_('ul.homect'),'.home')


function removeClass(el, className) {
    if (el.classList) {
        el.classList.remove(className);
    } else {
        el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
};

function addClass(el, className) {
    if (el.classList) {
        el.classList.add(className);
    } else {
        el.className += ' ' + className;
    }
};