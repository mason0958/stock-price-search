// 1. Make getJson into a function so you can call it whenever you need to
// 2. save the previously searched company stocks, and if they are younger than
// certain amount of time, then pull use the local storage key/pair value instead
// 3.retrieve button
// 4.bookmarks on the side of the page
// 5. Automatically refresh all fo the stocks that you have saved
// 6. keep the watchlist stocks in a separate table from searched stocks
var userStocksSaved = localStorage.getItem('userStocks');

//Let the DOM load first
$('document').ready(function() {

	var noDuplicates = deleteDuplicateKeypairs();
	localStorage.setItem("userStocks", noDuplicates);
	appendSavedStocks();

	$('#arrow1').click(function() {
		$('#page1,#page2').animate({
			'right':'100vw'
		},100);
	});

	$('#arrow2').click(function() {
		$('#page1,#page2').animate({
			'right':'0vw'
		},100);
	});

	//retrieved the local storage previous searches, and, we 
	//split them up into an array
	// var userStocksSaved = localStorage.getItem('userStocks');
	// console.log(userStocksSaved);

	// for (var j = 0; j < userStocksSaved.length; j++) {
		// var htmlToPlot = buildStockRow(userStocksSaved); //not finished
		//more here
	// }

	$('.yahoo-form').submit(function() {
		//stop the form from submitting default action
		event.preventDefault();
		// get the value from the input box and place it in the symbol variable
		var symbol = $('#symbol').val();
		var checkForInstance = localStorage.getItem(symbol + ",");


		if (symbol.indexOf(',') == -1) {
			symbol += ",";
		}

		var quickTemp = localStorage.getItem(symbol);
		var arrayNow = quickTemp.split(",");
		var tempTime = Date.parse(arrayNow[5]);
		var tempTime2 = Date.now();


		if ((checkForInstance != null) && (tempTime2 - tempTime2 < 100000)) {
			//pull from the local storage

			var htmlToPlot5 = buildStockRowLocal(arrayNow[0],arrayNow[1],arrayNow[2],arrayNow[3],arrayNow[4]);
			$('#stock-body').append(htmlToPlot5);

			}
		else {
			//there is no instance of this symbol in local storage, go ahead
		

			//save the search history in local storage
			localStorage.setItem("userStocks", symbol + userStocksSaved);

			var url = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20("'
	        + symbol + '")%0A%09%09&env=http%3A%2F%2Fdatatables.org%2Falltables.env&format=json';
		



			$.getJSON(url, function(returnData) {

				var dateNow = new Date();

				var stockInfo = returnData.query.results.quote;

				var stockSymbol = stockInfo.Symbol + ',';
				var companyName = stockInfo.Name + ',';
				var askPrice =stockInfo.Ask + ',';
				var bidPrice = stockInfo.Bid + ',';
				var dailyChange = stockInfo.Change + ',';
				var everythingTogether = stockSymbol + companyName + askPrice + bidPrice + dailyChange;

				localStorage.setItem(symbol, everythingTogether + dateNow);
				

				if (returnData.query.count == 1) {

					var htmlToPlot2 = buildStockRow(stockInfo);
					$('#stock-body').append(htmlToPlot2);
				}
				else {
					for (var i = 0; i < stockInfo.length; i++) {

					var htmlToPlot = buildStockRow(stockInfo[i]);
					$('#stock-body').append(htmlToPlot);
					}
				}
			});
		}
	});
});



function buildStockRow(stock){

	var newHTML = '';

	if(stock.Change.indexOf('+') > -1) {
		var classChange = "success";
	}
	else {
		var classChange = "danger";
	}

	newHTML +=  '<tr>';
		newHTML +=  '<td>' + stock.Symbol + '</td>';
		newHTML +=  '<td>' + stock.Name + '</td>';
		newHTML +=  '<td>' + '$' + stock.Ask + '</td>';
		newHTML +=  '<td>' + '$' + stock.Bid + '</td>';
		newHTML +=  '<td class=" ' + classChange + ' ">' + stock.Change + '</td>';
	newHTML +=  '</tr>';

	return newHTML;

}

function buildStockRowLocal(symbol, name, ask, bid, change){

	var newHTML = '';

	if(change.indexOf('+') > -1) {
		var classChange = "success";
	}
	else {
		var classChange = "danger";
	}

	newHTML +=  '<tr>';
		newHTML +=  '<td>' + symbol + '</td>';
		newHTML +=  '<td>' + name + '</td>';
		newHTML +=  '<td>' + '$' + ask + '</td>';
		newHTML +=  '<td>' + '$' + bid + '</td>';
		newHTML +=  '<td class=" ' + classChange + ' ">' + change + '</td>';
	newHTML +=  '</tr>';

	return newHTML;

}


function appendSavedStocks() {

	var userStocksSavedSplit = userStocksSaved.split(',');

	for (var i = 0; i < userStocksSavedSplit.length; i++) {
		userStocksSavedSplit[i]


		var urlSaved = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20("'
        + userStocksSavedSplit[i] + '")%0A%09%09&env=http%3A%2F%2Fdatatables.org%2Falltables.env&format=json';

        $.getJSON(urlSaved, function(returnData) {
			
			var stockInfo = returnData.query.results.quote;
			console.log(stockInfo);


			if (returnData.query.count == 1) {

				var htmlToPlot3 = buildStockRow(stockInfo);
				$('#stock-body-saved').append(htmlToPlot3);
			}
			else {
				for (var i = 0; i < stockInfo.length; i++) {

				var htmlToPlot3 = buildStockRow(stockInfo[i]);
				$('#stock-body-saved').append(htmlToPlot3);

				}
			}
		});
	}
}


function deleteDuplicateKeypairs() {

	// console.log("+++++++ " + userStocksSaved);
	var userStocksSaved2 = userStocksSaved.split(",");
	// console.log("+++++++ " + userStocksSaved2);
	var userStocksSavedFinal = userStocksSaved2;

	for (var b = 0; b < userStocksSaved2.length; b++) {
		for (var c = 0; c < userStocksSaved2.length; c++) {
			if ((userStocksSaved2[b] == userStocksSaved2[c]) && (c != b)) {
				userStocksSavedFinal.splice(c,1);
			}
		}
	}
	return userStocksSavedFinal;
}


//275258a3655c449ba4907833f5baf08b