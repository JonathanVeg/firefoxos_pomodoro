window.onload = function() {
	var language = getItem("pomodoro_language", "en");
	
	var timer_pomodoro = parseInt(getItem("pomodoro_timer_pomodoro", (25).toString())) * 60;
	var timer_break = parseInt(getItem("pomodoro_timer_break", (5).toString())) * 60;
	var timer_longbreak = parseInt(getItem("pomodoro_timer_longbreak", (20).toString())) * 60;

	$("#pomodoro_timer").val(getItem("pomodoro_timer_pomodoro", (25).toString()));
	$("#break_timer").val(getItem("pomodoro_timer_break", (5).toString()));
	$("#longbreak_timer").val(getItem("pomodoro_timer_longbreak", (20).toString()));

	var current_pomodoro = 1;
	var current_break = 1;
	var current_longbreak = 1;
	
	var current_timer = timer_pomodoro;
	var current_step = 'p'; // p pomodoro, b break, l longbreak

	var going = false;

	var show_fullscreen = true;

	var has_storage = (typeof(Storage) !== "undefined");

	setInterval(updateTime, 1000);

	function getCurrentStepName(){
		if (getLanguage == "en"){
			if (current_step == "p")
				return "Pomodoro";
			else if (current_step == "b")
				return "Break";
			else if (current_step == "l")
				return "Long break";
		}else{
			if (current_step == "p")
				return "Pomodoro";
			else if (current_step == "b")
				return "Pausa";
			else if (current_step == "l")
				return "Pausa longa";
		}

	}

	function updateTime() {
		if (going){
			label = "";

			if (getLanguage == "en"){
				if (current_step == "p")
					label = "Pomodoro (" + current_pomodoro + "):";
				else if (current_step == "b")
					label = "Break:";
				else if (current_step == "l")
					label = "Long break:";
			}else{
				if (current_step == "p")
					label = "Pomodoro (" + current_pomodoro + "):";
				else if (current_step == "b")
					label = "Pausa:";
				else if (current_step == "l")
					label = "Pausa longa:";			
			}

			if (current_timer % 60 < 10)
				timer = (Math.floor(current_timer / 60)).toString() + ":0" + (current_timer % 60).toString();
			else
				timer = (Math.floor(current_timer / 60)).toString() + ":" + (current_timer % 60).toString();

			document.title = timer + " - " +  getCurrentStepName()

			$("#show_timer").html(label + " " + timer);

			$("#cur_time").html(timer);

			current_timer -= 1;

			if (current_timer == 0){
				nextStep();
			}

			if (getLanguage() == "en"){
				if (current_step == "p"){
					$(".message").html("Now is time for work. Don't give up and keep your focus.")
				}else if (current_step == "b"){
					$(".message").html("Break. Try to relax and not work for now.");
				}else{
					$(".message").html("Now is time to relax. Try do anything for relax your mind. <br> Tip: stretch a little.");
				}
			}else{
				if (current_step == "p"){
					$(".message").html("Agora é hora de trabalhar. Não desista e tente manter o foco.")
				}else if (current_step == "b"){
					$(".message").html("Pausa. Tente relaxar e não trabalhe por enquanto.");
				}else{
					$(".message").html("Agora é hora de relaxar. Tente fazer qualquer coisa para relaxar a mente. <br> Dica: alongue-se um pouco.");
				}
			}
			if (show_fullscreen){
				$("#cur_time").css("background-color", getColorForPercentage(current_timer / timer_pomodoro));
				$("#fullscreen").show();
			}else{
				$("#fullscreen").hide();
			}

		}
	}

	$("#fullscreen").live('click', function(e) {
		$("#fullscreen").hide();
		show_fullscreen = false;
	});
	
	$("#show_timer").live('click', function(e) {
		$("#fullscreen").show();
		show_fullscreen = true;
	});

	function nextStep () {
		if (current_step == 'p'){
			if (current_pomodoro % 4 == 0){
				current_step = "l";
				current_timer = timer_longbreak;
			}else{
				current_step = "b";
				current_timer = timer_break;
			}

			current_pomodoro ++;
		}else{
			if (current_step == "l")
				current_longbreak ++;
			else
				current_break ++;

			current_step = "p";
			current_timer = timer_pomodoro;
		}

		if (getLanguage() == "en"){
			if (current_step == "p"){
				$(".message").html("Now is time for work. Keep your focus.");
			}else if (current_step == "b"){
				$(".message").html("Break. Try to relax and not work for now.");
			}else{
				$(".message").html("Now is time to relax. Try do anything for relax your mind. <br> Tip: stretch a little.");
			}
		}else{
			if (current_step == "p"){
				$(".message").html("Agora é hora de trabalhar. Mantenha o foco!");
			}else if (current_step == "b"){
				$(".message").html("Pausa. Tente relaxar e não trabalhe por enquanto.");
			}else{
				$(".message").html("Agora é hora de relaxar. Tente fazer qualquer coisa para relaxar a mente. <br> Dica: alongue-se um pouco.");
			}
		}
	}

	$("#break").live('click', function(e) {
		going = !going;

		if (getLanguage() == "en"){
			if (going)
				$("#break").html("Pause");
			else
				$("#break").html("Play");
		}else{
			if (going)
				$("#break").html("Pausar");
			else
				$("#break").html("Começar");
		}
	});

	$("#stop").live('click', function(e) {
		current_pomodoro = 1;
		current_break = 1;
		current_longbreak = 1;

		current_timer = timer_pomodoro;
		current_step = 'p';

		if (current_timer % 60 < 10)
			timer = (Math.floor(current_timer / 60)).toString() + ":0" + (current_timer % 60).toString();
		else
			timer = (Math.floor(current_timer / 60)).toString() + ":" + (current_timer % 60).toString();

		if (getLanguage() == "en")
			$("#break").html("Play");
		else
			$("#break").html("Começar");
		
		$("#show_timer").html("Pomodoro: " + timer);

		going = false;
	});

	$("#goto_pomodoro").live('click', function(e) {
		$("#panel_pomodoro").show();
		$("#panel_settings").hide();
		$("#panel_infos").hide();

		$("#goto_settings").removeClass('selected');
		$("#goto_infos").removeClass('selected');
		$("#goto_pomodoro").addClass('selected');

		setLanguage("");
	});

	$("#goto_settings").live('click', function(e) {
		$("#panel_settings").show();
		$("#panel_pomodoro").hide();
		$("#panel_infos").hide();

		$("#goto_settings").addClass('selected');
		$("#goto_pomodoro").removeClass('selected');
		$("#goto_infos").removeClass('selected');

		setLanguage("");
	});

	$("#goto_infos").live('click', function(e) {
		$("#panel_settings").hide();
		$("#panel_pomodoro").hide();
		$("#panel_infos").show();

		$("#goto_settings").removeClass('selected');
		$("#goto_pomodoro").removeClass('selected');
		$("#goto_infos").addClass('selected');

		if (getLanguage() == "en"){
			$("#infos_pt").hide();
			$("#infos_en").show();
		}else{
			$("#infos_pt").show();
			$("#infos_en").hide();
		}

		setLanguage("");
	});


	$("#language_brazil").live('click', function(e) {
		$("#language_eua").removeClass('selected');
		$("#language_brazil").addClass('selected');

		setLanguage("pt");
	});

	$("#language_eua").live('click', function(e) {
		$("#language_brazil").removeClass('selected');
		$("#language_eua").addClass('selected');

		setLanguage("en");
	});

	function setLanguage (lang) {

		if (lang != "")
			language = lang;

		localStorage.setItem("pomodoro_language", language);

		if (language == "pt"){
			$("#language_eua").removeClass('selected');
			$("#language_brazil").addClass('selected');

			$("#label_time").html("Tempo (minutos):");
			$("#label_break").html("Pausa:");
			$("#label_longbreak").html("Pausa longa:");
			$("#save").html("Salvar");
			$("#label_language").html("Idioma:");

			if (!going)
				$("#break").html("Começar");
			else
				$("#break").html("Pausar");
			$("#stop").html("Parar");
		}else{
			$("#language_brazil").removeClass('selected');
			$("#language_eua").addClass('selected');

			$("#label_time").html("Time (minutes):");
			$("#label_break").html("Break:");
			$("#label_longbreak").html("Longbreak:");
			$("#save").html("Save");
			$("#label_language").html("Language:");

			if (!going)
				$("#break").html("Play");
			else
				$("#break").html("Pause");
			$("#stop").html("Stop");
		}
	}

	function getItem(name, default_value){
		if (localStorage.getItem(name))
			return localStorage.getItem(name);
		else
			localStorage.setItem(name, default_value);

		return default_value;
	}

	function getLanguage(){
		return getItem("pomodoro_language", "en");
	}

	$("#save").live('click', function(e) {
		localStorage.setItem("pomodoro_timer_pomodoro", $("#pomodoro_timer").val());
		localStorage.setItem("pomodoro_timer_break", $("#break_timer").val());
		localStorage.setItem("pomodoro_timer_longbreak", $("#longbreak_timer").val());

		if (getLanguage() == "en")
			alert("Settings saved. It'll make effect the next time you open the app");
		else
			alert("Configurações salvas. Fará efeito na próxima vez que o app for aberto.");
	});

	$("#fullscreen").hide();
	$("#panel_settings").hide();
	$("#panel_infos").hide();
	setLanguage("");

	var percentColors = [
	{ pct: 0.0, color: { r: 0x00, g: 0xff, b: 0 } },
	{ pct: 0.5, color: { r: 0xff, g: 0xff, b: 0 } },
	{ pct: 1.0, color: { r: 0xff, g: 0x00, b: 0 } } ];

	var getColorForPercentage = function(pct) {
		for (var i = 1; i < percentColors.length - 1; i++) {
			if (pct < percentColors[i].pct) {
				break;
			}
		}
		var lower = percentColors[i - 1];
		var upper = percentColors[i];
		var range = upper.pct - lower.pct;
		var rangePct = (pct - lower.pct) / range;
		var pctLower = 1 - rangePct;
		var pctUpper = rangePct;
		var color = {
			r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
			g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
			b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
		};
		return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
	}  
}