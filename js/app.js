(function ($) {

	var eventsAdded = false,

	//function to hide splash Screen
	hideSplashScreen = function(){

		setTimeout(function(){
			$('.splashScreenContainer').fadeOut(1500, function(){
				$('.views').fadeIn(1500);
			});

		},3500);
	
	},

	//setup right click context menu on account view
	setAccountViewContext = function(){

		$.contextMenu({
	        selector: '.accountContext', 
	        callback: function(key, options) {
	        	
	        	//here is the element where click is performed, do work by setting the attr of clicked element
            	
	        	 $('#chartingModal').modal('show'); 

	            if(key === "showLineGraph"){
	            	
	            	//line chart dummy data
					var lineChartData = [
					[[0,0],[2,4],[8,8],[9,6],[11,9],[12,10],[14,14]],
					[[0,0],[1,4],[8,5],[10,4],[12,5],[14,6],[15,8]]
					];
					
					$('.barChart').hide();
					$('.lineChart').show();
					$('#lineChart').empty();
					setupLineChart($('#lineChart') , lineChartData);
					
	            }else{

	            	//bar chart dummy
					var barChartData = [    
						[[0, 11], 
						[1, 15], 
						[2, 25], 
						[3, 24], 
						[4, 13], 
						[5, 18]]  
					];
					
					$('.lineChart').hide();
					$('.barChart').show();
					$('#barChart').empty();
					setupBarChart($('#barChart') , barChartData);
					
	            }

	        },
	        items: {
	            "showLineGraph": {"name": "Show Line Graph"},
	            "showBarGraph": {"name": "Show Bar Chart"}
	        }
    	});

	},

	//setup right click context menu on general symbol and symbol book view
	setSymbolViewContext = function(){

		$.contextMenu({
	        selector: '.symbolContext', 
	        callback: function(key, options) {
	            if(key == "viewDetails"){
            		$('#viewDetailsModal').modal('show'); 
	            }else if(key == "byClient" || key == "bySymbol"){
            		$('#rejectionModal').modal('show'); 
	            }
	        },
	        items: {
	            "viewDetails": {"name": "View Details"},
	            "cancel": {"name": "Cancel"},
	            "reject": {
	            	"name": "Reject",
	            	"items" : {
	            		"single" : {"name" : "Single"},
	            		"bulk" : {"name" : "Bulk"},
	            		"byClient" : {"name" : "By Client"},
	            		"bySymbol" : {"name" : "By Symbol"}
	            	}
	            },
	            "bust": {"name": "Bust"}
	        }
    	});

	},

	//function to create Data tables
	createDataTables = function(){

		$('.tblDataTable').each(function(){
			$(this).DataTable({
		        searching: true,
		   		paging: true,
		   		bInfo : false,
		   		pageLength: 1000,
		   		lengthChange: false,
		   		order: [[ 0, "desc" ]]
    		});
    		$(this).wrap("<div class='scrolledTable'></div>");
    	});

	},

	//function to creat Line Chart, pass element and data to create chart
	setupLineChart = function(ele , data){

		//options for line chart from documentation
		var options = {
			lines : {
				lineWidth : 2
			},
			colors : ['#000' , '#808080'],
			shadowSize: 0,
			yaxis: {
				tickLength:0 , 
				ticks: []
			}, 
    		xaxis: {
    			tickLength:0 , 
    			ticks: []
    		},
			grid: {
    			borderWidth : {"left" : 2, "bottom" : 2,"top" : 0, "right" : 0},
    			backgroundColor : null
			}
		};

		$.plot(ele, data , options);

	},

	//function to creat Bar Chart, pass element and data to create chart
	setupBarChart = function(ele , data){

		//options for line chart from documentation
		var options = {
						
			series: {
			    bars: {
			        show: true,
    				align: "center",
    				barWidth: 0.3,
					lineWidth: 0
			    }
			},
			colors : ['#000' , '#808080'],
			shadowSize: 0,
			yaxis: {
				tickLength:0 , 
				ticks: []
			}, 
    		xaxis: {
    			tickLength:0 , 
    			ticks: []
    		},
			grid: {
    			borderWidth : {"left" : 2, "bottom" : 2,"top" : 0, "right" : 0},
    			backgroundColor : null
			}
		};
		
		$.plot(ele, data , options);

	},

	//function to setup all jQuery events
	setupEvents = function () {

		//event for view screen changing
		$('body').on('click' , '.showView' , function(){

			var ele = $(this),
			toShowView = ele.attr('data-view');

			if(!ele.hasClass('activeViewLink')){
				$('.activeView').fadeOut(500 , function(){
					$('.'+toShowView).fadeIn(500).addClass('activeView');
				}).removeClass('activeView');
				$('.activeViewLink').removeClass('activeViewLink');
				ele.addClass('activeViewLink');
			}

		});

	};

	//App class declaration
	App = function (options) {

		hideSplashScreen();
		createDataTables();
		setAccountViewContext();
		setSymbolViewContext();

		if (!eventsAdded) {

            setupEvents();

        }

    };


}(jQuery));