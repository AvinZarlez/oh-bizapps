(function() {
    'use strict';

    // Call the initialize API first
    microsoftTeams.initialize();

    // Check the initial theme user chose and respect it
    microsoftTeams.getContext(function(context){
        if (context) {
            if(context.theme) {
                setTheme(context.theme);
            }
        }
    });

    // Handle theme changes
    microsoftTeams.registerOnThemeChangeHandler(function(theme) {
        setTheme(theme);
    });

    // Save configuration changes
    microsoftTeams.settings.registerOnSaveHandler(function(saveEvent) {
        // Let the Microsoft Teams platform know what you want to load based on
        // what the user configured on this page

        var leaderboardUri = window.location.protocol + '//' +
            window.location.host +
            '/leaderboard';

        var leaderboardChoice = document.getElementById('leaderboardChoice');
        if (leaderboardChoice) {
            leaderboardUri += '/?type=' + leaderboardChoice[leaderboardChoice.selectedIndex].value;
        }
        
        microsoftTeams.settings.setSettings({
            contentUrl: leaderboardUri, // Mandatory parameter
            entityId: leaderboardUri // Mandatory parameter
        });

        // Tells Microsoft Teams platform that we are done saving our settings. Microsoft Teams waits
        // for the app to call this API before it dismisses the dialog. If the wait times out, you will
        // see an error indicating that the configuration settings could not be saved.
        saveEvent.notifySuccess();
    });

    // Logic to validate the Leaderboard Choice Selection
    document.addEventListener('DOMContentLoaded', function() {
        var leaderboardChoiceElm = document.getElementById('leaderboardChoice');
        if (leaderboardChoiceElm) {
            leaderboardChoiceElm.onchange = function() {
                var leaderboardChoice = this[this.selectedIndex].value;

                // This API tells Microsoft Teams to enable the 'Save' button. Since Microsoft Teams always assumes
                // an initial invalid state, without this call the 'Save' button will never be enabled.
                microsoftTeams.settings.setValidityState(leaderboardChoice === 'team' || 
                    leaderboardChoice === 'user');
            };
        }
    });

    // Set the desired theme
    function setTheme(theme) {
        if (theme) {
            // Possible values for theme: 'default', 'light', 'dark' and 'contrast'
            document.body.className = 'theme-' + (theme === 'default' ? 'light' : theme);
        }
    }
})();
