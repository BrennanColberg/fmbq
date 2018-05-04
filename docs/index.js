var sitting = false;
var sittingColor = "40FF43";
var standingColor = "FF4D6B";
function toggleColor() {
    document.backgroundColor = sitting ? sittingColor : standingColor;
    sitting = !sitting;
}