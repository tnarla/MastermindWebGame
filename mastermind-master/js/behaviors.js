$('#toggleInstructions').on('click', function () {
	$('#instructions').find('p').toggle();
	$(this).find('#arrow').html(function(index, oldhtml) {
		var compare = $("<div/>").html('&rArr;').text();
		if (oldhtml == compare) { //'&rArr;') {
			return '&dArr;';
		} else {
			return '&rArr;';
		}
	});
});