(function() {
    'use strict';

    var userToken = null;

    function getUrlParam(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

    function loadLeaderboard(leaderboardChoice, context) {
        var leaderboardElm = $('#leaderboard');
        var leaderBoardHtml = '<table><tr><th>Name:</th><th>Score:</th></tr>';

        if(leaderboardElm) {
            var lbUri = 'https://msopenhack.azurewebsites.net/api/trivia/leaderboard/' + 
                leaderboardChoice
            $.post(lbUri, context, function(leaderboard) {
                var leaderBoardTable = $(document.createElement('table'));
                var authmsgElm = $('#authmsg');

                if(leaderboardChoice === 'user') {
                    leaderBoardTable.append('<tr><th>Photo:</th><th>Name:</th><th>Score:</th></tr');
                    leaderboardElm.append(`<div><code>${JSON.stringify(leaderboard)}</code></div>`)
                    leaderboard.forEach(entry => { 
                        leaderBoardTable.append(
                            '<tr>'+
                            `<td><img src="/photo/?userId=${entry.id}" width="48"/></td>`+
                            '<td>' + entry.name + '</td>'+
                            '<td>' + entry.score + '</td>'+
                            '</tr>'                                          
                        ) 
                    }); 
                } else {                    
                    leaderBoardTable.append('<tr><th>Photo:</th><th>Name:</th><th>Score:</th></tr');
                    leaderboard.forEach(entry => {       
                        leaderBoardTable.append(
                            '<tr>'+
                            '<td>' + entry.name + '</td>'+
                            '<td>' + entry.score + '</td>'+
                            '</tr>'                                          
                        ) 
                    });
                }

                leaderboardElm.append(leaderBoardTable);
            });
        }
    }
        
    document.addEventListener('DOMContentLoaded', function() {
        microsoftTeams.getContext(function(context){
            if (context) {
                var leaderboardChoice = getUrlParam('type');
                var tcontextElm = $('#tcontext');
                var leaderboardTitleElm = $('#leaderboardtitle');
                var authmsgElm = $('#authmsg');

                if(leaderboardTitleElm) {
                    leaderboardTitleElm.html('<strong>' +
                        leaderboardChoice.charAt(0).toUpperCase() +
                        leaderboardChoice.substr(1) +
                        ' Leaderboard</strong>');
                }

                if(tcontextElm) {
                    tcontextElm.html('<CODE>' + JSON.stringify(context) + '</CODE>');
                }

                if(leaderboardChoice === 'user') {                    
                    loadLeaderboard(leaderboardChoice, context);
                    // NO LONGER NEEDED
                    /*if (userToken == null)
                    {
                        microsoftTeams.authentication.authenticate({
                            url: '/auth',
                            width: 500,
                            height: 500,
                            successCallback: function(token) {
                                userToken = token;
                                loadLeaderboard(leaderboardChoice, context);
                                authmsgElm.html(`<CODE>${JSON.stringify(userToken)}</CODE>`);
                            },
                            failureCallback: function(err) {
                                authmsgElm.html(`Failed to get authenticate and get token! Err: <code>${JSON.stringify(err)}</code>`);
                            }
                        });
                    } else {
                        loadLeaderboard(leaderboardChoice, context);
                    }*/
                } else {      
                    loadLeaderboard(leaderboardChoice, context);
                }
            }
        });
    });
})();