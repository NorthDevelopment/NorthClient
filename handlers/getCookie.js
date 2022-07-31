module.exports = getCookie

function getCookie(req, cname) {
    let cookies = req.headers.cookie;
    if (!cookies) return null;
    let name = cname + "=";
    let ca = cookies.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return decodeURIComponent(c.substring(name.length, c.length));
      }
    }
    return "";
  }