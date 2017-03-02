$(window).on('load', function(){ //wait for HTML to load


	$.getJSON(
			'https://api.instagram.com/v1/users/269781028/media/recent?callback=?',
			{
				access_token:'',
				count: '33'
			},

			function(json){
				//set data to use later
				//set the initial image
				var index = 0;

				if (json.data[index].type === "image") {

					$ ("#image-container img").attr('src', json.data[index].images.standard_resolution.url);
					$ ("#image-container video").hide().attr('src', "");
				}
					else if (json.data[index].type === "video"){
						$ ("#image-container video").attr('src', json.data[index].videos.standard_resolution.url);
						$ ("#image-container img").hide();
				}

			    var mapCanvas = $('#map').get(0);

			    var location = json.data[index].location;

			    var mapOptions = {
			          center: new google.maps.LatLng(location.latitude, location.longitude),
			          zoom: 11,
			          mapTypeId: google.maps.MapTypeId.ROADMAP
			        };

				var geocoder = new google.maps.Geocoder;

			    var map = new google.maps.Map(mapCanvas, mapOptions, geocoder);

			    var timer;

			    var setLocationText = function (location){

					geocoder.geocode({'latLng': location}, function(results, status) {
					    if ( status === google.maps.GeocoderStatus.OK ) {
					    	// Specific Address Name
					    	if(results[2]){
					      		$ ("#comment-capture").text((_.get(json.data[index], "caption.text") || " ") + " @ " + results[2].formatted_address);
					    	// Non-specific Address Name
					    	} else {
					      		$ ("#comment-capture").text((_.get(json.data[index], "caption.text") || " ") + " @ " + results[1].formatted_address);
					    	}
				    	// Must wait and try again if we have made too many requests
				      	}
				      	 else if ( status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT ) {
				      		timer = setTimeout(function(){
				      			setLocationText(location);
				      		}, 1000);
				      	}
				      	 else {
				      		throw new Error(status);
				      	}
				    });
				};

				setLocationText (new google.maps.LatLng(location.latitude, location.longitude));


			    _.each(json.data, function(instagramPost, i){

			    	location = instagramPost.location;

					var marker = new google.maps.Marker({
				    	position: new google.maps.LatLng(location.latitude, location.longitude),
				    	map: map,
				    	imageIndex: i
					});

					marker.addListener('click', function() {
						if (timer) clearTimeout(timer);

					    map.panTo(marker.getPosition());

					    if (json.data[this.imageIndex].type === "image") {
							$ ("#image-container img").show().attr('src', json.data[this.imageIndex].images.standard_resolution.url);
							$ ("#image-container video").hide().attr('src', "");

						}
							else if (json.data[this.imageIndex].type === "video"){
								$ ("#image-container video").show().attr('src', json.data[this.imageIndex].videos.standard_resolution.url);
								$ ("#image-container img").hide();
						};

						index = this.imageIndex;

						setLocationText (new google.maps.LatLng(json.data[this.imageIndex].location.latitude, json.data[this.imageIndex].location.longitude));


					    $ ("#comment-capture").text(_.get(json.data[this.imageIndex], "caption.text") || " ");

					    if (this.imageIndex === 0) {
						$ ("#right-arrow").addClass('faded')
						}

						if (this.imageIndex < json.data.length - 1) {
							$ ("#left-arrow").removeClass('faded')
						}

						if (this.imageIndex > 0) {
						$ ("#right-arrow").removeClass('faded')
						}

						if (this.imageIndex === json.data.length - 1) {
							$ ("#left-arrow").addClass('faded')
						 }
					});

			    });

				$ ("#right-arrow").addClass('faded');

				$ ("#right-arrow").on("click", function(){ //set up event handler
					if (timer) clearTimeout(timer);
					goright ();
				});

				$ ("#left-arrow").on("click", function (){
					if (timer) clearTimeout(timer);
					goleft ();
				});


				$ (window).on("keydown", function(event){ //set up event handler
					if (timer) clearTimeout(timer);
					if(event.which == 37) { // left
					    goleft ();
					 } else if(event.which == 39) { // right
					    goright ();
					 }
				});

				function goright () {
					if (index >= 0) {
						index--;

						if (json.data[index].type === "image") {
							$ ("#image-container img").show().attr('src', json.data[index].images.standard_resolution.url);
							$ ("#image-container video").hide().attr('src', "");
						}
							else if (json.data[index].type === "video"){
								$ ("#image-container video").show().attr('src', json.data[index].videos.standard_resolution.url);
								$ ("#image-container img").hide();
						}

						location = json.data[index].location;

						setLocationText (new google.maps.LatLng(json.data[index].location.latitude, json.data[index].location.longitude));

						map.panTo(new google.maps.LatLng(location.latitude, location.longitude));
					}

					if (index === 0) {
						$ ("#right-arrow").addClass('faded');
					}

					if (index <= json.data.length - 2) {
						$ ("#left-arrow").removeClass('faded');
					}
				}

				function goleft () {
					if (index < json.data.length - 1) {
						index++;

						if (json.data[index].type === "image") {
							$ ("#image-container img").show().attr('src', json.data[index].images.standard_resolution.url);
							$ ("#image-container video").hide().attr('src', "");
						}
							else if (json.data[index].type === "video"){
								$ ("#image-container video").show().attr('src', json.data[index].videos.standard_resolution.url);
								$ ("#image-container img").hide();
						}

						location = json.data[index].location;

						setLocationText (new google.maps.LatLng(json.data[index].location.latitude, json.data[index].location.longitude));

						map.panTo(new google.maps.LatLng(location.latitude, location.longitude));
					}

					if (index >= 1) {
						console.log(index, json.data.length);
						$ ("#right-arrow").removeClass('faded');
					}

					if (index === json.data.length - 1) {
						$ ("#left-arrow").addClass('faded');
					}
				}
			}
		);
});
