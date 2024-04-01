



$(document).ready(function(){
	startScript("drawing-board-recording")
});

function startScript(canvasId)
{ 
	playbackInterruptCommand = "";
	
	$(document).ready( function()
	{
		$("#pauseBtn").hide();
		//$("#playBtn").hide();
		
		drawing = new RecordableDrawing(canvasId);

		// Custom color wheel functionality
	const colors = [
		{r: 0xe4, g: 0x3f, b: 0x00},
		{r: 0xfa, g: 0xe4, b: 0x10},
		{r: 0x55, g: 0xcc, b: 0x3b},
		{r: 0x09, g: 0xad, b: 0xff},
		{r: 0x6b, g: 0x0e, b: 0xfd},
		{r: 0xe7, g: 0x0d, b: 0x86},
		{r: 0xe4, g: 0x3f, b: 0x00}
	];

	function componentToHex(c) {
		var hex = c.toString(16)
		return hex.length == 1 ? "0" + hex : hex;
	}

	function rgbToHex (r, g, b) {
		return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b)
		
	}
	
var xColor;
	const colorWheel = document.getElementById("color-wheel")
		$(document).ready(function() {
			colorWheel.addEventListener("click", function(e) {
				console.log("Color Wheel clicked")
				var rect1 = e.target.getBoundingClientRect();
				//Compute cartesian coordinates as if the circle radius was 1
				var x = 2 * (e.clientX - rect1.left) / (rect1.right - rect1.left) - 1;
				var y = 1 - 2 * (e.clientY - rect1.top) / (rect1.bottom - rect1.top);
				//Compute the angle in degrees with 0 at the top and turning clockwise as expected by css conic gradient
				var a = ((Math.PI / 2 - Math.atan2(y, x)) / Math.PI * 180);
				if (a < 0) a += 360;
				//Map the angle between 0 and number of colors in the gradient minus one
				a = a / 360 * (colors.length - 1);  //minus one because the last item is at 360° which is the same as 0°
				//Compute the colors to interpolate
				var a0 = Math.floor(a) % colors.length;
				var a1 = (a0 + 1) % colors.length;
				var c0 = colors[a0];
				var c1 = colors[a1];
				//Compute the weights and interpolate colors
				var a1w = a - Math.floor(a);
				var a0w = 1 - a1w;
				var color = {
					r: c0.r * a0w + c1.r * a1w,
					g: c0.g * a0w + c1.g * a1w,
					b: c0.b * a0w + c1.b * a1w
				};
				//Compute the radius
				var r = Math.sqrt(x * x + y * y);
				if (r > 1) r = 1;
				//Compute the white weight, interpolate, and round to integer
				var cw = r < 0.8 ? (r / 0.8) : 1;
				var ww = 1 - cw;
				color.r = Math.round(color.r * cw + 255 * ww);
				color.g = Math.round(color.g * cw + 255 * ww);
				color.b = Math.round(color.b * cw + 255 * ww);
				//Compute the hex color code and apply it
				xColor = rgbToHex(color.r, color.g, color.b);

				console.log(xColor);

				document.getElementById('recordBtn').style.backgroundColor = xColor;
				//document.getElementById('color').style.backgroundColor = xColor;
				
				drawing.setColor(xColor);
			});
		});

		
		
		

//add the slider

		document.addEventListener("DOMContentLoaded", function() {
			var slider = document.getElementById("slider"); // Assuming you have a slider element with the ID "slider"
			var thumbHeight = 10 + (slider.value / slider.max) * 20; // Calculate default thumb height
			
			// Set default thumb size
			slider.style.setProperty("--thumb-height", thumbHeight + "px");
			slider.style.setProperty("--thumb-width", thumbHeight + "px");
		});
		
		// Event listener for slider input
		slider.addEventListener("input", function() {
			var thumbHeight = 10 + (this.value / this.max) * 20;
		
			this.style.setProperty("--thumb-height", thumbHeight + "px");
			this.style.setProperty("--thumb-width", thumbHeight + "px");
		});




		//change the brush size when the slider is changed
		slider.addEventListener('change', e => {
    

			if(e.target.id === 'slider') {
				lineWidth = e.target.value;
				drawing.setStrokeSize(lineWidth)
			}
		});


	




		//Ram's drawing functions.
		
		$("#recordBtn").click(function(){
			var btnTxt = $("#recordBtn").prop("value");
			if (btnTxt == 'Stop')
				stopRecording();
			else
				startRecording();
		});

		$("#pauseRecordBtn").click(function(){
			drawing.pauseRecording();
		}
		
		);
		

		$("#resumeRecordBtn").click(function(){
			drawing.resumeRecording();
		})


		$("#playBtn").click(playRecordings);

		function playRecordings()
		{
			if (drawing.recordings.length == 0)
			{
				alert("No recording to play");
				return;
			}
			var btnTxt = $("#playBtn").prop("value");
			if (btnTxt == 'Stop')
				stopPlayback();
			else
				startPlayback();			
		}
		
		$("#pauseBtn").click(function(){
			var btnTxt = $("#pauseBtn").prop("value");
			if (btnTxt == 'Pause')
			{
				pausePlayback();
			} else if (btnTxt == 'Resume')
			{
				resumePlayback();
			}
		});
		$("#clearBtn").click(function(){
			drawing.clearCanvas();			
		});
	
		$("#serializeBtn").click(function() {
			var serResult = serializeDrawing(drawing);
			if (serResult != null)
			{
				$("#serDataTxt").val(serResult);
				showSerializerDiv();
			} else
			{
				alert("Error serializing data");
			}
		});


		//Define the functions that the event handlers call. 


		function showSerializerDiv(showSubmit)
		{
			$("#drawingDiv").hide();
			$("#serializerDiv").show();	
			if (showSubmit)
				$("#okBtn").show();
			else
				$("#okBtn").hide();
		}

		function hideSerializerDiv()
		{
			$("#drawingDiv").show();
			$("#serializerDiv").hide();	
		}

		$("#deserializeBtn").click(function(){
			showSerializerDiv(true);
		});

		$("#cancelBtn").click(function(){
			hideSerializerDiv();
		});


		//deserialize on page load





		$(document).ready(function(){

			//pick a random file. 

			

				var numbers = [];

				for (var i = 1; i <= 14; i++) {
					numbers.push(i);
				}

				// Randomly select a number from the array
				var randomIndex = Math.floor(Math.random() * numbers.length);
				var randomNumber = numbers[randomIndex];

				// Display the randomly selected number
				console.log("Scribble file number:", randomNumber);

				

            var filePath = "recordingjson/"+randomNumber+".json";

            $.ajax({
                url: filePath,
                dataType: "text",
                success: function(data) {
                    // Set the value of #serDataTxt to the fetched JSON string
                    $("#serDataTxt").val(data);
            
                    // Call the deserializeDrawing function with the fetched JSON string
                    var result = deserializeDrawing(data);
                    if (result == null) {
                        result = "Error : Unknown error in deserializing the data";
                        $("#serDataTxt").val(result.toString());
                        showSerializerDiv(false);
                        return;
                    } else {
                        // Data is successfully deserialized
                        drawing.recordings = result;
                        // Set drawing property of each recording
                        for (var i = 0; i < result.length; i++)
                            result[i].drawing = drawing;
                        hideSerializerDiv();
                        playRecordings();
                    }
                },
                error: function(xhr, status, error) {
                    // Handle error if the file cannot be fetched
                    console.error("Error fetching JSON file:", error);
                }
            });
        });
	});
	
	function stopRecording()
	{
		$("#recordBtn").prop("value","Record");
		$("#playBtn").show();
		$("#pauseBtn").hide();
		$("#clearBtn").show();
		
		drawing.stopRecording();
	}
	
	function startRecording()
	{
		$("#recordBtn").prop("value","Stop");
		$("#playBtn").hide();
		$("#pauseBtn").hide();
		$("#clearBtn").hide();
		
		drawing.startRecording();
	}
	
	function stopPlayback()
	{
		playbackInterruptCommand = "stop";		
	}
	
	function startPlayback()
	{
		drawing.playRecording(function() {
			//on playback start
			$("#playBtn").prop("value","Stop");
			$("#recordBtn").hide();
			$("#pauseBtn").show();
			$("#clearBtn").hide();
			playbackInterruptCommand = "";
		}, function(){
			//on playback end
			$("#playBtn").prop("value","Play");
			$("#playBtn").show();
			$("#recordBtn").show();
			$("#pauseBtn").hide();
			$("#clearBtn").show();
		}, function() {
			//on pause
			$("#pauseBtn").prop("value","Resume");
			$("#recordBtn").hide();
			$("#playBtn").hide();
			$("#clearBtn").hide();
		}, function() {
			//status callback
			return playbackInterruptCommand;
		});
	}
	
	function pausePlayback()
	{
		playbackInterruptCommand = "pause";
	}
	
	function resumePlayback()
	{
		playbackInterruptCommand = "";
		drawing.resumePlayback(function(){
			$("#pauseBtn").prop("value","Pause");
			$("#pauseBtn").show();
			$("#recordBtn").hide();
			$("#playBtn").show();
			$("#clearBtn").hide();
		});
	}
}

