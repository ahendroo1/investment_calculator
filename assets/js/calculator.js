
	function validDecimal(obj){

		if(isNaN(parseFloat(obj.value)))
			obj.value='';
		else
			obj.value=parseFloat(obj.value).toFixed(2).replace('.00','');
	}
	function isNumberKey(evt){
		var charCode = (evt.which) ? evt.which : event.keyCode;
		if (charCode != 13 && charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57))
			return false;
		return true;
	}
	function nFormat(theNumber) {
		if(theNumber<1000)
			return parseFloat(theNumber).toFixed(1);
		sizeoF = ['', 'K', 'M', 'B', 'T', 'Qd', 'Qt', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];
		if (theNumber == 0)
			return 'n/a';
		o = parseFloat(Math.floor(Math.log(theNumber) / Math.log(1000)));
		return (theNumber / Math.pow(1000, o)).toFixed(1).replace(".0","") +' '+ sizeoF[o];
	}
	function numbers_only(elm){
		elm.value = elm.value.replace(/[^0-9]/g, "");
		return false;
	}
	function convertCurr(id_name,dec) {
		if(typeof(dec)=='undefined')
			dec = -1;
		jQuery('#' + id_name).blur(function () {
			jQuery(this).formatCurrency({
				colorize: true,
				negativeFormat: '-%s%n',
				roundToDecimalPlace: 0
			});
		})
			.keyup(function (e) {
			var e = window.event || e;
			var keyUnicode = e.charCode || e.keyCode;
			if (e !== undefined) {
				switch (keyUnicode) {
				case 16:
					break; // Shift
				case 17:
					break; // Ctrl
				case 18:
					break; // Alt
				case 27:
					this.value = '';
					break; // Esc:
				case 35:
					break; // End
				case 36:
					break; // Home
				case 37:
					break; // cursor left
				case 38:
					break; // cursor up
				case 39:
					break; // cursor right
				case 40:
					break; // cursor down
				case 78:
					break; // N (Opera 9.63+ maps the "." from the number key section to the "N" key too!)
				case 110:
					break; // . number block
				case 190:
					break; // .
				default:
					jQuery(this).formatCurrency({
						colorize: true,
						negativeFormat: '-%s%n',
						roundToDecimalPlace: dec,
						eventOnDecimalsEntered: true
					});
				}
			}
		});
	}
	
	function reset(){
		jQuery("#period").val("");
		jQuery("#amount").val("");
		jQuery("#amount").focus();
		jQuery("#expect").val("");
		jQuery("#future").text("");
        jQuery(".futured").hide();
	}

	Number.prototype.formatMoney = function(c, d, t){
	var n = this, 
		c = isNaN(c = Math.abs(c)) ? 2 : c, 
		d = d == undefined ? "." : d, 
		t = t == undefined ? "," : t, 
		s = n < 0 ? "-" : "", 
		i = parseFloat(n = Math.abs(+n || 0).toFixed(c)) + "", 
		j = (j = i.length) > 3 ? j % 3 : 0;
	return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
	};
	tgl = new Date();
	year = tgl.getFullYear();
	month = tgl.getMonth();
	function calculate(){
		convertCurr('future');
		amount = jQuery("#amount").val()=="" ? 10000 : parseFloat(jQuery("#amount").val().split(",").join(""));
		period = jQuery("#period").val()=="" ? 3 : parseFloat(jQuery("#period").val().split(",").join(""));
		expect = jQuery("#expect").val()=="" ? 5 : parseFloat(jQuery("#expect").val().split(",").join(""));

		var bill = Math.round( amount*Math.pow(1+(expect/100),period*12));
	
		var	number_string = bill.toString(),
			back 	= number_string.length % 3,
			usd 	= number_string.substr(0, back),
			mid 	= number_string.substr(back).match(/\d{3}/g);
				
		if (mid) {
			separator = back ? '.' : '';
			usd += separator + mid.join('.');
		}

		jQuery("#future").text(usd + ' USD');
        jQuery(".futured").show();

		jQuery("table.future tbody").html("<tr><th colspan='2'>Year/Month</th><th>Jan</th><th>Feb</th><th>Mar</th><th>Apr</th><th>Mei</th><th>Jun</th><th>Jul</th><th>Aug</th><th>Sep</th><th>Oct</th><th>Nov</th><th>Dec</th><th>Net<br>Profit</th></tr>");
		j = 0;
		k = 0;
		roi = "";
		title = "";
		finish = "";
		first = "finish";
		for (i = 0; i < period+2; i++) { 
			data = ""
			+"<tr>"
			+"<th rowspan='2' class='year'>"+(year+i)+"</th>"
			+"<th> USD</th>";
			firstV = 0;
			for (n = 0; n < 12; n++) {
				if(i==0 && n<month)
					data += "<td class='gray'></td>";
				else{
					future = amount*Math.pow(1+(expect/100),j);
					j++;
					if(!firstV)
						firstV = future;
					tValue = future.formatMoney(0, '.', ',').replace('.00','');
					if(future>=amount*2 && roi==""){
						proi = future - amount*2;
						roi = "roi";
						title = "title='Break Event Point + "+proi.formatMoney(0, '.', ',').replace('.00','')+"'";
					}else if(roi=="roi"){
						roi = "done";
						title = "title='"+tValue+"'";
					}else
						title = "title='"+tValue+"'";
					dec = "";
					if(n==11)
						dec = "last"+(year+i);
					fValue = nFormat(future);
					if(i==period && n>month || i>period){
						data += "<td val='"+future+"' class='future lightgray "+roi+" "+dec+"' "+title+" id='data"+j+"'>"+fValue+"</td>";
					}else{
						if(i==period && n==month)
							finish = "finish";
						data += "<td val='"+future+"' class='future "+roi+" "+finish+" "+first+" "+dec+"' "+title+" id='data"+j+"'>"+fValue+"</td>";
						if(first=="finish")
							first = "";
					}
				}
			}
			data += "<th class='future ytd"+(year+i)+"' rowspan='2'>"+(future-amount).formatMoney(0, '.', ',').replace('.00','')+"</th>";
			data += "</tr><tr>"
				+"<th class='hlot'>Lot</th>";
			for (n = 0; n < 12; n++) {
				if(i==0 && n<month)
					data += "<td class='lotx gray'></td>";
				else{
					if(i==period && n>month || i>period){
						k++;
						data += "<td class='lot lightgray' id='data"+k+"'></td>";
					}else{
						k++;
						data += "<td class='lot' id='lot"+k+"'></td>";
					}
				}
			}
			data += "</tr>";
			jQuery("table.future tbody:last").append(data);
		}
		jQuery('table.future').css("border","2px solid #000");
		jQuery('table.future tr > th:nth-child(1)').css("border-right","2px solid #333");
		jQuery('table.future tr > th:nth-child(2)').css("border-right","2px solid #333");
		jQuery('table.future tr:first-child > th:nth-child(2)').css("border-right","1px solid #ccc");
		jQuery('table.future tr > th.year').css("border-right","1px solid #ccc");
		jQuery('table.future tr:first-child th').css("border-bottom","2px solid #333");
		jQuery('table.future tr th:last-child').css({"border-left":"2px solid #333","border-bottom":"1px solid #333"})
		jQuery('table.future tr:first-child th:last-child').css("border-bottom","2px solid #333")
		i = 0;
		jQuery("td.lot").each(function(){
			i++;
			x = (parseFloat(jQuery("table.future > tbody > tr > td#data"+i).attr('val'))/50000).toFixed(1).split(".0").join("");
			y = (parseFloat(jQuery("table.future > tbody > tr > td#data"+i).attr('val'))/20000).toFixed(1).split(".0").join("");
			lot = nFormat(x)+" - "+nFormat(y);
			jQuery(this).text(lot);
		})
		n = 0;
		// jQuery("table.future tr").not(':first').find("th:first-child").not(".hlot").each(function(){
			// year = parseInt(jQuery(this).text());
			// lastValue = parseFloat(jQuery(".last"+year).attr('val'));
			// if(!n){
				// beforeValue = amount;
			// }else{
				// beforeValue = parseFloat(jQuery(".last"+(year-1)).attr('val'));;
			// }
			// ytd = (lastValue - beforeValue) / beforeValue * 100;
			// jQuery(".ytd"+year).text(ytd.toFixed(2)+"%");
			// n++;
		// })
		// ("#future").keyup();
		// (".future").show();
	}

	
	function calculate2nd(){
		convertCurr('future2');
		amount = $("#amount2").val()=="" ? 10000 : parseFloat(jQuery("#amount2").val().split(",").join(""));
		period = $("#period2").val()=="" ? 3 : parseFloat(jQuery("#period2").val().split(",").join(""));
		expect = $("#expect2").val()=="" ? 5 : parseFloat(jQuery("#expect2").val().split(",").join(""));
		$("#future").val(amount*Math.pow(1+(expect/100),period*12));
		// console.log()
		$("table.future tbody").html("<tr><th colspan='2'>Year/Month</th><th>Jan</th><th>Feb</th><th>Mar</th><th>Apr</th><th>Mei</th><th>Jun</th><th>Jul</th><th>Aug</th><th>Sep</th><th>Oct</th><th>Nov</th><th>Dec</th><th>Net<br>Profit</th></tr>");
		j = 0;
		k = 0;
		roi = "";
		title = "";
		finish = "";
		first = "finish";
		for (i = 0; i < period+2; i++) { 
			data = ""
			+"<tr>"
			+"<th rowspan='2' class='year'>"+(year+i)+"</th>"
			+"<th>USD</th>";
			firstV = 0;
			for (n = 0; n < 12; n++) {
				if(i==0 && n<month)
					data += "<td class='gray'></td>";
				else{
					future = amount*Math.pow(1+(expect/100),j);
					j++;
					if(!firstV)
						firstV = future;
					tValue = future.formatMoney(0, '.', ',').replace('.00','');
					if(future>=amount*2 && roi==""){
						proi = future - amount*2;
						roi = "roi";
						title = "title='Break Event Point + "+proi.formatMoney(0, '.', ',').replace('.00','')+"'";
					}else if(roi=="roi"){
						roi = "done";
						title = "title='"+tValue+"'";
					}else
						title = "title='"+tValue+"'";
					dec = "";
					if(n==11)
						dec = "last"+(year+i);
					fValue = nFormat(future);
					if(i==period && n>month || i>period){
						data += "<td val='"+future+"' class='future lightgray "+roi+" "+dec+"' "+title+" id='data"+j+"'>"+fValue+"</td>";
					}else{
						if(i==period && n==month)
							finish = "finish";
						data += "<td val='"+future+"' class='future "+roi+" "+finish+" "+first+" "+dec+"' "+title+" id='data"+j+"'>"+fValue+"</td>";
						if(first=="finish")
							first = "";
					}
				}
			}
			data += "<th class='future ytd"+(year+i)+"' rowspan='2'>"+(future-amount).formatMoney(0, '.', ',').replace('.00','')+"</th>";
			data += "</tr><tr>"
				+"<th class='hlot'>Lot</th>";
			for (n = 0; n < 12; n++) {
				if(i==0 && n<month)
					data += "<td class='lotx gray'></td>";
				else{
					if(i==period && n>month || i>period){
						k++;
						data += "<td class='lot lightgray' id='data"+k+"'></td>";
					}else{
						k++;
						data += "<td class='lot' id='lot"+k+"'></td>";
					}
				}
			}
			data += "</tr>";
			jQuery("table.future tbody:last").append(data);
		}
		jQuery('table.future').css("border","2px solid #000");
		jQuery('table.future tr > th:nth-child(1)').css("border-right","2px solid #000");
		jQuery('table.future tr > th:nth-child(2)').css("border-right","2px solid #000");
		jQuery('table.future tr:first-child > th:nth-child(2)').css("border-right","1px solid #ccc");
		jQuery('table.future tr > th.year').css("border-right","1px solid #ccc");
		jQuery('table.future tr:first-child th').css("border-bottom","2px solid #000");
		jQuery('table.future tr th:last-child').css({"border-left":"2px solid #000","border-bottom":"1px solid #333"})
		jQuery('table.future tr:first-child th:last-child').css("border-bottom","2px solid #000")
		i = 0;
		jQuery("td.lot").each(function(){
			i++;
			x = (parseFloat(jQuery("table.future > tbody > tr > td#data"+i).attr('val'))/50000).toFixed(1).split(".0").join("");
			y = (parseFloat(jQuery("table.future > tbody > tr > td#data"+i).attr('val'))/20000).toFixed(1).split(".0").join("");
			lot = nFormat(x)+" - "+nFormat(y);
			jQuery(this).text(lot);
		})
		n = 0;
		// jQuery("table.future tr").not(':first').find("th:first-child").not(".hlot").each(function(){
			// year = parseInt(jQuery(this).text());
			// lastValue = parseFloat(jQuery(".last"+year).attr('val'));
			// if(!n){
				// beforeValue = amount;
			// }else{
				// beforeValue = parseFloat(jQuery(".last"+(year-1)).attr('val'));;
			// }
			// ytd = (lastValue - beforeValue) / beforeValue * 100;
			// jQuery(".ytd"+year).text(ytd.toFixed(2)+"%");
			// n++;
		// })
		jQuery("#future").keyup();
		jQuery(".future").show();
	}
	jQuery(function() {
		
		var url = "http://localhost/112/index.php" ;
		console.log(window.location.href)
		console.log(url)

		if(window.location.href === url){
			console.log(1)
			// $(".calculatorInvesment").show()
		}

		
		convertCurr('amount');
		convertCurr('amount2');
		convertCurr('future',0);
		
		// jQuery("#showDialog").leanModal();	
		
		jQuery("input[type=text]").blur(function(){
			if(isNaN(parseFloat(jQuery(this).val().split(",").join(""))))
				jQuery(this).val("");
		});
		jQuery("#amount2").blur(function(){
			if(isNaN(parseFloat(jQuery(this).val().split(",").join(""))))
				jQuery(this).val("");
		});	
		jQuery("#reset").click(function(){
			reset();
		});
		jQuery("#form").submit(function(){
			jQuery("#showDialog").click();
			calculate();
		});
		jQuery("#form2").submit(function(){
			jQuery("table.future tbody").empty();
			calculate2nd();
		});	
	});