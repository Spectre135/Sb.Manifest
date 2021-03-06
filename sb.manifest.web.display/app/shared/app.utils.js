//Posivim ekran ko delam
function grayOut(vis) {
    var options = options || {};
    var zindex = options.zindex || 50;
    var opacity = options.opacity || 60;
    var opaque = opacity / 100;
    var bgcolor = options.bgcolor || '#FFFFFF';

    var dark = document.getElementById('darkenScreenObject');


    if (!dark) {
        var tbody = document.getElementsByTagName("body")[0];
        var tnode = document.createElement('div'); // Create the layer.

        tnode.style.position = 'absolute'; // Position absolutely
        tnode.style.top = '0px'; // In the top
        tnode.style.left = '0px'; // Left corner of the page
        tnode.style.overflow = 'hidden'; // Try to avoid making scroll bars
        tnode.style.display = 'none'; // Start out Hidden
        tnode.id = 'darkenScreenObject'; // Name it so we can find it later

        tbody.appendChild(tnode); // Add it to the web page
        dark = document.getElementById('darkenScreenObject'); // Get the object.
        dark.innerHTML = '<div class="loader"><svg class="circular" viewBox="25 25 50 50" ><circle class="path" cx="50" cy="50" r="15" fill="none" stroke-width="1" stroke-miterlimit="10" /></svg ></div>';

    }
    if (vis) {
        //document.body.style.cursor="wait";
        // Calculate the page width and height
        if (document.body && (document.body.scrollWidth || document.body.scrollHeight)) {
            var screenHeight = screen.height;
            var pageWidth = document.body.scrollWidth + 'px';
            var pageHeight = document.body.scrollHeight + 'px';
            //if (document.body.scrollHeight > screen.height) {
            //    var pageHeight = screen.height + 'px';
            //}

            //console.log(screenHeight);
            //console.log(pageHeight);


        } else if (document.body.offsetWidth) {
            var pageWidth = document.body.offsetWidth + 'px';
            var pageHeight = document.body.offsetHeight + 'px';
        } else {
            var pageWidth = '100%';
            var pageHeight = '100%';
        }
        //set the shader to cover the entire page and make it visible.
        dark.style.opacity = opaque;
        dark.style.MozOpacity = opaque;
        dark.style.filter = 'alpha(opacity=' + opacity + ')';
        dark.style.zIndex = zindex;
        dark.style.backgroundColor = bgcolor;
        dark.style.width = pageWidth;
        dark.style.height = pageHeight;
        dark.style.display = 'block';
    } else {
        //document.body.style.cursor= "auto";
        dark.style.display = 'none';
    }
};

function b64DecodeUnicode(str) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(atob(str).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
};

function GetUser() {
    try {
        var token = sessionStorage.getItem('Authorization');
        if (token) {

            var data = token.split('.')[1];
            var base64 = data.replace(/-/g, '+').replace(/_/g, '/');
            var decode = b64DecodeUnicode(base64);
            var user = JSON.parse(decode);
            return user;
        };
    } catch (error) { }
};

function buildLocaleProvider(formatString) {
    return {
        formatDate: function (date) {
            if (date) return moment(date).format(formatString);
            else return null;
        },
        parseDate: function (dateString) {
            if (dateString) {
                var m = moment(dateString, formatString, true);
                return m.isValid() ? m.toDate() : new Date(NaN);
            } else return null;
        }
    };
};

function Refresh(key) {
    try {
        var version = window.localStorage.getItem('versionHrDoc');
        console.log(version);
        if (version != key) {
            window.location.reload(true);
            window.localStorage.setItem('versionHrDoc', key);
            console.log('refreshed');
        } else {
            window.localStorage.setItem('versionHrDoc', key);
        }
    } catch (error) { }
};

function pad(str, max) {
    str = str.toString();
    return str.length < max ? pad('0' + str, max) : str;
};

function noDuplicates(arr) {
    var newArr = [];
    if (arr) {
        angular.forEach(arr, function (value, key) {
            var exists = false;
            angular.forEach(newArr, function (val2, key) {
                if (angular.equals(value, val2)) {
                    exists = true
                };
            });
            if (exists == false && value != '') {
                newArr.push(value);
            }
        });
    }
    return newArr;
};

function noDuplicatesId(arr) {
    try {
        var newArr = [];
        if (arr) {
            angular.forEach(arr, function (value, key) {
                var exists = false;
                angular.forEach(newArr, function (val2, key) {
                    if (value.Id == val2.Id) {
                        exists = true
                    };
                });
                if (exists == false && value != '') {
                    newArr.push(value);
                }
            });
        }
        return newArr;
    } catch (err) {
        return arr;
    }
};