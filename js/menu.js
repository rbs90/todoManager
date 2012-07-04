$(document).ready(function(){
	
	//set german layout for datepicker:
	$.datepicker.regional['de'] = {clearText: 'löschen', clearStatus: 'aktuelles Datum löschen',
                closeText: 'schließen', closeStatus: 'ohne &Auml;nderungen schließen',
                prevText: '<zur&uuml;ck', prevStatus: 'letzten Monat zeigen',
                nextText: 'Vor>', nextStatus: 'n&auml;chsten Monat zeigen',
                currentText: 'heute', currentStatus: '',
                monthNames: ['Januar','Februar','M&auml;rz','April','Mai','Juni',
                'Juli','August','September','Oktober','November','Dezember'],
                monthNamesShort: ['Jan','Feb','M&auml;r','Apr','Mai','Jun',
                'Jul','Aug','Sep','Okt','Nov','Dez'],
                monthStatus: 'anderen Monat anzeigen', yearStatus: 'anderes Jahr anzeigen',
                weekHeader: 'Wo', weekStatus: 'Woche des Monats',
                dayNames: ['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'],
                dayNamesShort: ['So','Mo','Di','Mi','Do','Fr','Sa'],
                dayNamesMin: ['So','Mo','Di','Mi','Do','Fr','Sa'],
                dayStatus: 'Setze DD als ersten Wochentag', dateStatus: 'W&auml;hle D, M d',
                dateFormat: 'dd.mm.yy', firstDay: 1,
                initStatus: 'W&auml;hle ein Datum', isRTL: false};
    $.datepicker.setDefaults($.datepicker.regional['de']);
        
	$(".menuitem").hover(function(){
		$(this).addClass("menuhover");
	},
	function () {
		$(this).removeClass("menuhover");
	});
	
	$("#reload").click(function(){
		getTasksByMainTask(hist[hist.length - 1]);
	});
	
	$("#back").click(function(){
		hist.pop();
		getTasksByMainTask(hist[hist.length - 1]);
	});
	
	$("#add").click(function(){
		$("#addPopup").bPopup({
			modalClose: false,
            opacity: 0.7,
            modalColor: 'white',
            closeClass:'close'
		});
	});
	
	$("#deadline").datepicker({
		numberOfMonths: 1,
		showButtonPanel: true,
		changeMonth: true,
		changeYear: true,
		minDate: 0 //only today and future
	});
		
	$('#time').timepicker({
	    hourText: 'Stunden',
	    minuteText: 'Minuten',
	    showPeriodLabels: false,
	    timeSeparator: ':',
	    showNowButton: false,
	    showCloseButton: false,
	    showDeselectButton: false,
	    defaultTime: '00:00'
	});
})