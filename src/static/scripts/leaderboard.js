(function() {
    'use strict';

    function getUrlParam(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };
        
    document.addEventListener('DOMContentLoaded', function() {
        microsoftTeams.getContext(function(context){
            if (context) {
                var leaderboardChoice = getUrlParam('type');
                var tcontextElm = $('#tcontext');
                var leaderboardTitleElm = $('#leaderboardtitle');
                var leaderboardElm = $('#leaderboard');

                if(leaderboardTitleElm) {
                    leaderboardTitleElm.html('<strong>' +
                        leaderboardChoice.charAt(0).toUpperCase() +
                        leaderboardChoice.substr(1) +
                        ' Leaderboard</strong>');
                }

                if(tcontextElm) {
                    tcontextElm.html('<CODE>' + JSON.stringify(context) + '</CODE>');
                }

                if(leaderboardElm) {
                    var lbUri = 'https://msopenhack.azurewebsites.net/api/trivia/leaderboard/' + leaderboardChoice
                    $.post(lbUri, context, function(leaderboard) {
                        var leaderBoardHtml = '<table><tr><th>Name:</th><th>Score:</th></tr>';
                        leaderboard.forEach(entry => {
                            leaderBoardHtml += '<tr>' 
                            leaderBoardHtml += '<td>' + entry.name   + '</td>'
                            leaderBoardHtml += '<td>' + entry.score   + '</td>'
                            leaderBoardHtml += '</tr>' 
                        });
                        leaderBoardHtml += '<table>';
                        leaderboardElm.html(leaderBoardHtml);
                    });
                }
            }
        });
    });
})();