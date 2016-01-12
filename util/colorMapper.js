module.exports = {
  makeGradientColor: function(value) {
    var happy = {r:0, g:188, b:140}; //Very happy
    var sad = {r:231, g:76, b:60}; //Very sad
    var percent = (value +5)*(255/10);

    var newColor = {};

    function makeChannel(a, b) {
        return(a + Math.round((b-a)*(percent/100)));
    }

    function makeColorPiece(num) {
        num = Math.min(num, 255);   // not more than 255
        num = Math.max(num, 0);     // not less than 0
        var str = num.toString(16);
        if (str.length < 2) {
            str = "0" + str;
        }
        return(str);
    }

    newColor.r = makeChannel(sad.r, happy.r);
    newColor.g = makeChannel(sad.g, happy.g);
    newColor.b = makeChannel(sad.b, happy.b);
    newColor.cssColor = "#" +
                        makeColorPiece(newColor.r) +
                        makeColorPiece(newColor.g) +
                        makeColorPiece(newColor.b);
    return(newColor);
  }
}
