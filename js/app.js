(function ($) {

	var eventsAdded = false,
		lastSelectedRow = '',
		splashScreenTimeout,
	//function to hide splash Screen
	hideSplashScreen = function(){

		splashScreenTimeout = setTimeout(function(){
			$('.splashScreenContainer').fadeOut(1000, function(){
				$('.views').fadeIn(1000);
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

		//Generate Engine Table
		loadJSON('sel_Engine', '#matchEngineTable', '');
		loadJSON('sel_Account', '#accountTable', 'accountContext');
		loadJSON('sel_Session', '#accountTable', '');
		loadJSON('sel_General_Symbol', '#generalSymbolTable', 'symbolContext');
		loadJSON('sel_Symbol_Sell', '#symbolBookTableA', 'symbolContext');
		loadJSON('sel_Symbol_Buy', '#symbolBookTableB', 'symbolContext');
		
		loadJSONforMini('sel_Order_Details', '#orderDetailTable');
		loadJSONforMini('sel_Order_Details_2', '#orderDetailTable2');

		
		function loadJSONforMini(endpoint, tableId) {
			var apiUrl = 'http://ec2-54-173-35-84.compute-1.amazonaws.com:8081/';
			$.ajax({
				type: 'GET',
				url: apiUrl + endpoint,
			}).done(function(data) {
				//generate html table from json
				$tbody = $(tableId + ' tbody');
				$tbody.empty();
				for(i = 0; i < data.results[0].data[0].length; i ++) {
					var html = '';
					html += '<td>' + data.results[0].schema[i].name + '</td>';
					html += '<td>' + data.results[0].data[0][i] + '</td>';
					$tbody.append('<tr>' + html + '</tr>');
				}
			});
		}

		function loadJSON(endpoint, tableId, trClassName) {
			var apiUrl = 'http://ec2-54-173-35-84.compute-1.amazonaws.com:8081/';
			$.ajax({
				type: 'GET',
				url: apiUrl + endpoint,
			}).done(function(data) {
				//generate html table from json
				$tbody = $(tableId + ' tbody');
				data.results[0].data.forEach(function(d) {
					var html = '';
					d.forEach(function(item) {
						html += '<td>' + item + '</td>';
					})
					$tbody.append('<tr class="' + trClassName + '">' + html + '</tr>');
				});
				//generate data table;
				generateDataTable(tableId);
			});
		}


		function generateDataTable(tableId) {
			$(tableId).each(function(){

				$(this).find('tfoot th').each( function () {
			        var title = $(this).text();
			        $(this).html( '<input type="text" placeholder="Search '+title+'" />' );
	    		});	

				var newDataTable = $(this).DataTable({
			        searching: true,
			   		paging: true,
			   		bInfo : false,
			   		pageLength: 1000,
			   		lengthChange: false,
			   		order: [[ 0, "desc" ]]
			   	}).columns().every( function () {
				        
				        var that = this;
				 
				        $( 'input', this.footer() ).on( 'keyup change', function () {
				        	if ( that.search() !== this.value ) {
				                that
				                    .search( this.value )
				                    .draw();
				            }
				        });
	    		});
				
				$(this).wrap("<div class='scrolledTable'></div>");
				
				$('.scrolledTable').on('scroll' , function(){
					if(this.scrollTop > 0){
						var translate = "translate(0,"+(this.scrollTop-1) +"px)";
					}else{
						var translate = "translate(0, 0px)";
					}
					
					$(this).find('thead,tfoot').css({
						'-ms-transform' : translate,
						'-webkit-transform' : translate,
						'-webkit-transform' : translate,
						'transform' : translate
					});
				});

			});
		}

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
				$('.selected').removeClass('selected');
			}

		});

		//datatable selection events with shift and ctrl conditions
		$('.tblDataTable tbody').on( 'click contextmenu', 'tr', function (event) {

			if ( $(this).hasClass('selected') ) {

            	$(this).removeClass('selected');
        		lastSelectedRow = '';

        	}else {
        	
        		if(event.ctrlKey) {

    				$(this).addClass('selected');
    				lastSelectedRow = $(this).index();

				}else if(event.shiftKey) {
					
					var currentIndex = $(this).index(),
					indexes = [currentIndex , lastSelectedRow];
					
				    indexes.sort(function(a, b) {
				        return a - b;
				    });
		    		
				    for (var i = indexes[0]; i <= indexes[1]; i++) {
				    	$(this).parents('tbody').find('tr').eq(i).addClass('selected');
				    }
					
					$(this).addClass('selected');

					lastSelectedRow = $(this).index();

				}else{

					$(this).parents('table').find('tr.selected').removeClass('selected');
	            	$(this).addClass('selected');
	            	lastSelectedRow = $(this).index();

				}
	        
	        }

        });

        //splash screen close on click event
        $('body').on('click' , '.splashScreenContainer' , function(){

        	clearTimeout(splashScreenTimeout);
			$('.splashScreenContainer').fadeOut(1000, function(){
				$('.views').fadeIn(1000);
			});

        });

        //modal close reset event
        $('.modal').on('hidden', function () {
        	$(this).find('[type="reset"]').trigger('click');
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