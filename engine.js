

var output_canvas = document.getElementById('output');
var output_ctx = output_canvas.getContext("2d");

var re_lb, re_ub;
var im_lb, im_ub;
var disc_re, disc_im;
var zoom_re, zoom_im;  // ratio:  pixel / actual
var depth_re, depth_im;

function get_settings() {

  re_lb = Number(document.getElementById('re-lb').value);
  re_ub = Number(document.getElementById('re-ub').value);
  im_lb = Number(document.getElementById('im-lb').value);
  im_ub = Number(document.getElementById('im-ub').value);

  disc_re = Number(document.getElementById('disc-re').value);
  output_canvas.width = disc_re;
  disc_im = Number(document.getElementById('disc-im').value);
  output_canvas.height = disc_im;

  zoom_re = disc_re / (re_ub - re_lb);
  zoom_im = disc_im / (im_ub - im_lb);

  depth_re = Math.pow(10, Math.round(Math.log(zoom_re) / Math.log(10)));
  depth_im = Math.pow(10, Math.round(Math.log(zoom_im) / Math.log(10)));

}

function get_output_canvas_point(p) {
  // given a point in C, get the output_canvas coordinate point to plot
    return {x: (p.re - re_lb) * zoom_re,
            y: (im_ub - p.im) * zoom_im};
}

function get_C_point(p) {
  // given the output_canvas coordinate point, get a point in C
  return {re: p.x / zoom_re + re_lb,
          im: im_ub - p.y / zoom_im};
}

function round(p, depth_r, depth_i) {
  return {re: (Math.round(p.re * depth_r) / depth_r),
          im: (Math.round(p.im * depth_i) / depth_i)
         };
}

function toString(p) {
  return p.re + (p.im < 0 ? "-" : "+") + Math.abs(p.im) + "i";
}

output_canvas.addEventListener('mouseout', function() {
  document.getElementById('hover-loc').innerHTML = "&nbsp;";
});

output_canvas.addEventListener('mousemove', function(e) {
  try {
    if (depth_re) {
      var rect = output_canvas.getBoundingClientRect();
      var user_x = (e.clientX - rect.left) * (output_canvas.width / output_canvas.clientWidth);
      var user_y = (e.clientY - rect.top) * (output_canvas.height / output_canvas.clientHeight);
      var p = get_C_point({x:user_x, y:user_y});
      document.getElementById('hover-loc').innerHTML = toString(round(p, depth_re, depth_im));
    }
  } catch(e) {
    // if no image is loaded, this wont work, so this is ok
  }
});

function run() {

  document.getElementById('error').innerHTML = "&nbsp;";

  try {
    // eval javascript
    eval(document.getElementById('functions').value);

    get_settings();

    // iterate over points in the output display, and plot the color associated with their output of f
    for (var i = 0; i < disc_re; i++) {
      for (var j = 0; j < disc_im; j++) {
        output_ctx.fillStyle = color(get_C_point({x:i,y:j}));
        this.output_ctx.fillRect(i, j, 1, 1);
      }
    }

  } catch(e) {
    document.getElementById('error').innerHTML = JSON.stringify(e);
  }

}
