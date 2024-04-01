// Function to toggle between different sections based on navigation
function toggleSection(sectionId) {
    document.querySelectorAll('section').forEach(function(section) {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

// Navigation functionality
document.querySelectorAll('nav a').forEach(function(navLink) {
    navLink.addEventListener('click', function(event) {
        event.preventDefault();
        var sectionId = navLink.getAttribute('href').substring(1);
        toggleSection(sectionId);
    });
});



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

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('color-wheel').addEventListener('click', function(e) {
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
        var xColor = rgbToHex(color.r, color.g, color.b);
        //document.getElementById('color').innerText = xColor;
        //document.getElementById('color').style.backgroundColor = xColor;
    });
});

function componentToHex(c) {
    var hex = c.toString(16)
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex (r, g, b) {
    hexcolor = "#" + componentToHex(r) + componentToHex(g) + componentToHex(b)
}

//drawing

const canvas = document.getElementById('drawing-board-user');
const toolbar = document.getElementById('toolbar');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let isPainting = false;
let lineWidth = 5;
let startX;
let startY;

const updateCanvasOffset = () => {
    const rect = canvas.getBoundingClientRect();
    canvasOffsetX = rect.left;
    canvasOffsetY = rect.top;
}

updateCanvasOffset();
window.addEventListener("resize", updateCanvasOffset);

toolbar.addEventListener('click', e => {
    if (e.target.id === 'clear') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    if(e.target.id === 'color-wheel') {
        ctx.strokeStyle = hexcolor;
    }
});

toolbar.addEventListener('change', e => {
    

    if(e.target.id === 'slider') {
        lineWidth = e.target.value;
    }
});

const draw = (e) => {
    if(!isPainting) {
        return;
    }

    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';

    ctx.lineTo(e.clientX - canvasOffsetX, e.clientY - canvasOffsetY);
    ctx.stroke();
}

canvas.addEventListener('mousedown', (e) => {
    isPainting = true;
    startX = e.clientX;
    startY = e.clientY;
});

canvas.addEventListener('mouseup', (e) => {
    isPainting = false;
    ctx.stroke();
    ctx.beginPath();
});

canvas.addEventListener('mousemove', draw);

//slider

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










