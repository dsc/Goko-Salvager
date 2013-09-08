/*jslint browser: true, devel: true, indent: 4, es5: true, vars: true, nomen: true, regexp: true, forin: true, white:true */
/*global jQuery, _, $, Audio  */

var createSidebar, resizeSidebar;

// Resize and reposition the logviewer to match the new window size
resizeSidebar = function (gs) {
    "use strict";

    // Hide sidebar if disabled in options
    if (!gs.get_option('logviewer')) {
        $('#sidebar').css('display', 'none');
    }

    // Keep Goko play area in center
    if ($('#sidebar').css('display') === 'none') {
        $('#goko-game').attr('style', 'left: 50% !important; margin-left: -512px !important');
        return;
    }

    // Move Goko play area to far left
    // Note that the usual jQuery .css() function doesn't have precendence
    // over the entries in Goko's .css files.
    $('#goko-game').attr('style', 'left: 0px !important; margin-left: 0px !important');

    // Calculate new logviewer size and position
    var goko_w = $('#myCanvas').width();
    var w = window.innerWidth - goko_w;

    // Resize and reposition the sidebar
    $('#sidebar').css('left', goko_w + 'px')
                 .css('width', w + 'px')
                 .css('margin-top', $('#myCanvas').css('margin-top'))
                 .css('height', $('#myCanvas').css('height'));

    // Scroll to bottom of log
    $('#prettylog').css('max-height',$('#sidebar').height() - $('#sidebar').css('margin-top').replace('px', 0));
    $('#prettylog').scrollTop(99999999);
};

// Add logviewer to GUI
createSidebar = function (gs, logManager) {
    "use strict";
    $('#goko-game')
        .append($('<div>').attr('id', 'sidebar')
            .append($('<table>').attr('id', 'vptable')
                                .addClass('vptable')
                                .attr('ng-app', 'vpApp')
                                .attr('ng-controller', 'vpController')
                .append($('<tbody>')
                    .append($('<tr>').attr('ng-repeat',
                                           'player in players | orderBy:"vps":true')
                        .addClass('{{player.pclass}}')
                        .append($('<td>').text('{{player.pname}}'))
                        .append($('<td>').text('{{player.vps}}')))))
            .append($('<div>').attr('id', 'prettylog')));

    // Hide sidebar until first game message
    $('#sidebar').hide();

    gs.alsoDo(logManager, 'addLog', null, function (opt) {
        if ($('#goko-game').css('display') !== 'none') {
            // TODO: this is excessive
            $('#sidebar').show();
            resizeSidebar(gs);
        }
    });

    window.addEventListener('resize', function () {
        setTimeout(function () {
            resizeSidebar(gs);
        }, 100);
    }, false);
};

window.GokoSalvager.depWait(
    ['GokoSalvager',
     'Dom.LogManager'],
    100, createSidebar, this, 'Sidebar'
);
