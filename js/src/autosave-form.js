function autoSave(formElemIndex, successMsg, errorMsg, showTimestamp) {
    var formElem = document.forms[formElemIndex];
    if (showTimestamp) {
        var now = new Date();
        successMsg += " : " + (now.getMonth()+1) + "/"
                + now.getDate() + "/"
                + now.getFullYear() + " "
                + formatAMPM(now);
        errorMsg += " : " + (now.getMonth() + 1) + "/"
                + now.getDate() + "/"
                + now.getFullYear() + " "
                + formatAMPM(now);
    }
    $.ajax({
        type: $(formElem).attr('method'),
        url: $(formElem).attr('action'),
        data: $(formElem).serialize(),
        success: function (data) {
            if(typeof $(formElem).attr("onSuccess") !== "undefined"){
                eval($(formElem).attr("onSuccess"));
            }
            else{
                $('#autosaveSuccessNotification').html(successMsg).css('background-color', '#1A1').fadeIn('slow', function () {
                                       setTimeout(function () {
                                           //wait 15 seconds and fade out
                                           $('#autosaveSuccessNotification').fadeOut('slow');
                                       }, 15000);
                                   });
            }
        },
        error: function (data) {
            if(typeof $(formElem).attr("onError") !== "undefined"){
                eval($(formElem).attr("onError"));
            }
            else{
                $('#autosaveErrorNotification').html(errorMsg).css('background-color', '#F00').fadeIn('slow', function () {
                    setTimeout(

                    function () {
                        //wait 15 seconds and fade out
                        $('#autosaveErrorNotification').fadeOut('slow');
                    }, 15000);
                });
            }
        }
    });
}


function manualSubmit() {
    $('form[is="autosave-form"]').each(function () {
        var jFormElem = $(this);
        var formIndex = $('form').index(jFormElem);
        var successMsg = jFormElem.attr("successMsg") || "Your form data has been saved.";
        var errorMsg = jFormElem.attr("errorMsg") || "There was an error saving your form data. Will retry in " + parseFloat(this.submitInterval / 1000) + " seconds.";

        autoSave(formIndex, successMsg, errorMsg);
    });

}
$(function () {
    var saveNotification = "<div id='autosaveSuccessNotification' class='autosaveNotifications'>Your text has been saved</div>";
    var errorNotification = "<div id='autosaveErrorNotification' class='autosaveNotifications'>There was an error saving your form data. Will retry shortly.</div>";
    var styles = "<style> .autosaveNotifications {display:none;color:#FFF;font-weight:bold;text-align:center;position:fixed;top:0;left:0;width:100%;z-index:1000;}</style>";
    $('body').append(styles).append(saveNotification).append(errorNotification);

    //initialize autosave forms
    $('form[is="autosave-form"]').each(function () {
        var jFormElem = $(this);
        var formIndex = $('form').index(jFormElem);
        var formElem = document.forms[formIndex];
        var submitInterval = jFormElem.attr("submitInterval") || 30000; //default 30 seconds
        var successMsg = jFormElem.attr("successMsg") || "Your form data has been saved.";
        var errorMsg = jFormElem.attr("errorMsg") || "There was an error saving your form data. Will retry in " + parseFloat(submitInterval / 1000) + " seconds.";
        var showTimestamp = 0;
        if (typeof (jFormElem.attr("showTimestamp")) !== "undefined") {
            showTimestamp = 1;
        }

        setInterval(function () {
            autoSave(formIndex, successMsg, errorMsg, showTimestamp);
        }, submitInterval);
    });
});

function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    var hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    strTime = hours + ':' + minutes + ampm;
    return strTime;
}