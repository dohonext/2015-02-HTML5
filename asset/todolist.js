var TODO = {
	init : function(){
		this.getAllTodoList();
		$('input').on('keydown', this.addList);
		$("ul").on("click", "li  div  input[type=checkbox]", this.completeList);
		$("ul").on("click", "li  div  .destroy", this.removeList);
	},
	
	getAllTodoList : function(){
		TODOSync.get(function(json){
			for(i=json.length-1; i>=0; i--) {
				appendWithTemplateEngine("#addListElements", "#todo-list", { key:json[i].id, class:'added', text:json[i].todo});
			}
		})

		function appendWithTemplateEngine(template, elementToAppend, dataToBind) {
		    		var source   = $(template).html();
					var template = Handlebars.compile(source);
					var templateData = dataToBind;

					$(elementToAppend).append(template(templateData));	
		}
	},

	addList : function(e){
		if (e.which == 13) {
			var textValue = $("input").val();
			TODOSync.add(textValue, function(json){
		  	   	appendWithTemplateEngine("#addListElements", "#todo-list", { key:json.insertId, class:'added', text:textValue });
		  	   	animateFadeIn($("#todo-list li:last-child"));
		  	   	deleteTextAfterPutIn();
		    	e.preventDefault();

		    	function appendWithTemplateEngine(template, elementToAppend, dataToBind) {
		    		var source   = $(template).html();
					var template = Handlebars.compile(source);
					var templateData = dataToBind;

					$(elementToAppend).append(template(templateData));	
		    	}

		    	function animateFadeIn(elementToAnimate) {
					var i = 0;
					animation();

					function animation() {
						if (i === 50) {
							return;
						} else {
							elementToAnimate.css( "opacity", 0+i*0.2);
							i++;
						}
						requestAnimationFrame(animation);
					}		
				}

		    	function deleteTextAfterPutIn() {
		    		$("input").val('');  
		    	}
	    	}.bind(this));
	    }
	},

	completeList : function(e){
		var input = e.currentTarget;
		var elLi = input.closest("li");
		var completed = input.checked?"1":"0";

		TODOSync.completed({
			"key" : elLi.dataset.key,
			"completed" : completed
		},function(){
				if (completed==="1") {
				elLi.className = "completed"
			}
			else {
				elLi.className = "added"
			}
		})
	},

	removeList : function(e){
		var elLi = e.currentTarget.closest("li");

		TODOSync.remove(elLi.dataset.key, function(){		
			animateFadeOut($(elLi));

			function animateFadeOut(elementToAnimate) {
				var i = 0;
				animation();

				function animation() {
					if (i === 50) {
						elementToAnimate.remove();
						return;
					} else {
						elementToAnimate.css( "opacity", 1-i*0.2);
						i++;
					}
					requestAnimationFrame(animation);
				}		
			}
		})
	},
};

var TODOSync = {
	get : function(callback){
		var xhr = new XMLHttpRequest();
		xhr.open("GET", "http://128.199.76.9:8002/dohonext", true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
		xhr.addEventListener("load",function(e) {
			callback(JSON.parse(xhr.responseText));
		});
		xhr.send();
	},

	add : function(todo, callback){
		var xhr = new XMLHttpRequest();
		xhr.open("PUT", "http://128.199.76.9:8002/dohonext", true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
		xhr.addEventListener("load",function(e) {
			callback(JSON.parse(xhr.responseText));
		});
		xhr.send("todo="+todo);
	},

	completed : function(param, callback){
		var xhr = new XMLHttpRequest();
		xhr.open("POST", "http://128.199.76.9:8002/dohonext/"+param.key, true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
		xhr.addEventListener("load",function(e) {
			callback(JSON.parse(xhr.responseText));
		});
		xhr.send("completed="+param.completed);
	},

	remove : function(key, callback){
		var xhr = new XMLHttpRequest();
		xhr.open("DELETE", "http://128.199.76.9:8002/dohonext/"+key, true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
		xhr.addEventListener("load",function(e) {
			callback(JSON.parse(xhr.responseText));
		});
		xhr.send();
	}
}

window.addEventListener("load", function() {	
	TODO.init();	
}, false);
