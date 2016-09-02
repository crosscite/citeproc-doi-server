window.addEventListener('load', function(e){
    var moreButton = document.getElementById('more').parentNode;
    var moreParent = moreButton.parentNode;
    var siblings = [];
    while (moreParent.nextSibling) {
        var last = moreParent.parentNode.childNodes[moreParent.parentNode.childNodes.length - 1];
        siblings.push(last);
        moreParent.parentNode.removeChild(last);
    }
    var postContainer = document.createElement('div');
    postContainer.setAttribute('id', 'more-container');
    postContainer.hidden = true;
    moreParent.parentNode.insertBefore(postContainer, moreParent.nextSibling);
    for (var i = 0, ilen = siblings.length; i < ilen; i++) {
        postContainer.insertBefore(siblings[i], postContainer.firstChild);
    }
    moreButton.parentNode.removeChild(moreButton);
    moreParent.parentNode.insertBefore(moreButton, postContainer);
    moreButton.firstChild.hidden = false;
    if (document.location.href.match(/\#/) && !document.location.href.match(/#(?:my-amazing|dynamic-editing|editor)/)) {
        var more = document.getElementById('more');
        var moreContainer = document.getElementById('more-container');
        more.innerHTML = 'Less ...';
        moreContainer.hidden = false;
    }
    if (document.getElementById('editor')) {
        document.getElementById('editor').children[0].hidden = true;
    }
});

window.addEventListener('hashchange', function(e){
    var more = document.getElementById('more');
    var moreContainer = document.getElementById('more-container');
    if (e.newURL.match(/\#/) && !document.location.href.match(/#(?:my-amazing|dynamic-editing|editor)/)) {
        more.innerHTML = 'Less ...';
        moreContainer.hidden = false;
    } else {
        more.innerHTML = 'More ...';
        moreContainer.hidden = true;
    }
});

window.addEventListener('click', function(e){
    if (e.target.getAttribute('id') === 'more') {
        var more = document.getElementById('more');
        var moreContainer = document.getElementById('more-container');
        if (moreContainer.hidden) {
            more.innerHTML = 'Less ...';
            moreContainer.hidden = false;
        } else {
            more.innerHTML = 'More ...';
            moreContainer.hidden = true;
        }
    }
});
