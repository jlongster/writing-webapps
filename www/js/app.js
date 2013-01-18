
// This uses require.js to structure javascript:
// http://requirejs.org/docs/api.html#define

define(function(require) {
    // Receipt verification (https://github.com/mozilla/receiptverifier)
    require('receiptverifier');

    // Installation button
    require('./install-button');

    // Install the layouts
    require('layouts/layouts');

    // Write your app here.
    var onAnimationEnd = require('layouts/anim').onAnimationEnd;

    function getSibling(node, offset) {
        var parent = $(node).parents('x-view');
        var views = parent.find('x-view');
        var i = views.get().indexOf(node.get(0));

        return [i + offset, views.get(i + offset)];
    }

    function prev() {
        var view = $(this).parents('x-view').first();
        var sib = getSibling(view.find('x-view.open'), -1);
        var offset = sib[0];
        var node = $(sib[1]);

        if(node.length) {
            $('header .next').removeClass('hidden');
            view.find('x-view').removeClass('open');
            node.addClass('open');
            node.get(0).openAlone(null, 'slideRight');

            if(offset == 0) {
                $('header .prev').addClass('hidden');
            }
        }
    }

    function next() {
        var view = $(this).parents('x-view').first();
        var sib = getSibling(view.find('x-view.open'), 1);
        var offset = sib[0];
        var node = $(sib[1]);

        if(node.length) {
            $('header .prev').removeClass('hidden');
            view.find('x-view').removeClass('open');
            node.addClass('open');
            node.get(0).openAlone(null, 'slideLeft');

            if(offset == view.find('x-view').length - 1) {
                $('header .next').addClass('hidden');
            }
        }
    }

    $('button.prev').click(prev);
    $('button.next').click(next);

    onAnimationEnd($('x-view.animations .box'), function() {
        $(this).css({ 'animation-name': 'none' });
    });

    $('x-view.animations').get(0).onOpen = function(view) {
        $('.box', view.el).css({ 'animation-name': 'box-animation' });
    };

    $('x-view.touch').get(0).onOpen = function(view) {
        var a = $('.touch1', view.el);
        var b = $('.touch2', view.el);
        a.text('Click');
        b.text('Touch');
        a.add(b).css({ 'background-color': '#22aa99' });
    };

    $('.touch1').click(function() {
        var el = $(this);
        el.text('TOUCHED');

        // Simulate click detection on touch devices
        setTimeout(function() {
            el.css({ 'background-color': 'black' });
        }, 100);
    });

    $('.touch2').mousedown(function() {
        var el = $(this);
        el.css({ 'background-color': 'black' });
        el.text('TOUCHED');
    });

    $('x-view.ajax').get(0).onOpen = function(view) {
        var el = $('.ajax-content', view.el);
        el.html('<img src="/img/ajax-loader.gif" />');

        // Simulate slow ajax laod
        setTimeout(function() {
            $.get('/ajax.html', function(r) {
                el.text(r);
            });
        }, 1500);
    };

    $(window).on('keypress', function(e) {
        switch(e.keyCode) {
            case 37: prev.call($('x-view.open')); break;
            case 39: next.call($('x-view.open')); break;
        }
    });
});
