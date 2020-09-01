// real -> real functions

function r_cosh(x) {
    return (Math.exp(x) + Math.exp(-x)) * 0.5;
  };
function r_sinh(x) {
    return (Math.exp(x) - Math.exp(-x)) * 0.5;
  };




// complex -> real functions

function logHypot(a) {
  var _a = Math.abs(a.re);
  var _b = Math.abs(a.im);
  if (a.re === 0) {
    return Math.log(_b);
  }
  if (a.im === 0) {
    return Math.log(_a);
  }
  if (_a < 3000 && _b < 3000) {
    return Math.log(a.re * a.re + a.im * a.im) * 0.5;
  }
  return Math.log(a.re / Math.cos(Math.atan2(a.im, a.re)));
}



// complex -> boolean

function isZero(a) {
  return a.re == 0 && a.im == 0;
}

function isInfinity(a) {
  return (a.re == Infinity || a.im == Infinity || isNaN(a.re) || isNaN(a.im));
}


// complex -> complex functions


function add(a,b) {
  return {re: a.re + b.re,
          im: a.im + b.im}
}
function multiply(a,b) {
  return {re: a.re * b.re - a.im * b.im,
          im: a.re * b.im + a.im * b.re}
}
function divide(a,b) {
  return {re: (a.re * b.re + a.im * b.im) / (b.re**2 + b.im**2),
          im: (a.im * b.im - a.re * b.im) / (b.re**2 + b.im**2)};
}
function negate(a) {
  return {re:-a.re, im:-a.im};
}
function subtract(a,b) {
  return {re: a.re - b.re,
          im: a.im - b.im};
}
function exponential(a,b) {

  if (isZero(b)) {
    return {re:1, im:0};
  }

  // If the exponent is real
  if (b.im === 0) {
    if (a.im === 0 && a.re >= 0) {
      return {re:Math.pow(a.re, b.re), im:0};
    } else if (b.re === 0) { // If base is fully imaginary
      switch ((b.re % 4 + 4) % 4) {
        case 0: return {re:Math.pow(a.im, b.re), im:0};
        case 1: return {re:0, im:Math.pow(a.im, b.re)};
        case 2: return {re:-Math.pow(a.im, b.re), im:0};
        case 3: return {re:0, im:-Math.pow(a.im, b.re)};
      }
    }
  }

  if (a.re === 0 && a.im === 0 && b.re > 0 && b.im >= 0) {
    return {re:0, im:0};
  }

  var arg = Math.atan2(a.im, a.re);
  var loh = logHypot(a);

  a = Math.exp(b.re * loh - b.im * arg);
  b = b.im * loh + b.re * arg;
  return {re:a * Math.cos(b),
          im:a * Math.sin(b)};
}
function modulus(a) {
  return {re:Math.sqrt(a.re**2 + a.im**2),
          im:0};
}
function conjugate(a) {
  return {re:a.re,
          im:-a.im};
}
function sin(a) {
  return {re:Math.sin(a.re) * r_cosh(a.im),
          im:Math.cos(a.re) * r_sinh(a.im)};
}
function cos(a) {
  return {re:Math.cos(a.re) * r_cosh(a.im),
          im:-Math.sin(a.re) * r_sinh(a.im)};
}
function tan(a) {
  const d = Math.cos(a.re) + r_cosh(a.im);
  return {re:Math.sin(a.re) / d,
          im:r_sinh(a.im) / d};
}
function log(a) {
  return {re: logHypot(a),
          im: Math.atan2(a.im, a.re)};
}
function cot(a) {
  const d = Math.cos(2 * a.re) - r_cosh(2 * a.im);
  return {re:-Math.sin(2 * a.re) / d,
          im:r_sinh(2 * a.im) / d};
}
function sec(a) {
  const d = 0.5 * (r_cosh(2 * a.im) + Math.cos(2 * a.re));
  return {re: Math.cos(a.re) * r_cosh(a.im) / d,
          im: Math.sin(a.re) * r_sinh(a.im) / d};
}
function csc(a) {
  const d = 0.5 * (r_cosh(2 * a.im) - Math.cos(2 * a.re));
  return {re: Math.sin(a.re) * r_cosh(a.im) / d,
          im: -Math.cos(a.re) * r_sinh(a.im) / d};
}
