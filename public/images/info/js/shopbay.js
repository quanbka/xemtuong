var VIETNAMESE_N_ASCII_MAP = {
    "à": "a", "ả": "a", "ã": "a", "á": "a", "ạ": "a", "ă": "a", "ằ": "a", "ẳ": "a", "ẵ": "a",
    "ắ": "a", "ặ": "a", "â": "a", "ầ": "a", "ẩ": "a", "ẫ": "a", "ấ": "a", "ậ": "a", "đ": "d",
    "è": "e", "ẻ": "e", "ẽ": "e", "é": "e", "ẹ": "e", "ê": "e", "ề": "e", "ể": "e", "ễ": "e",
    "ế": "e", "ệ": "e", "ì": 'i', "ỉ": 'i', "ĩ": 'i', "í": 'i', "ị": 'i', "ò": 'o', "ỏ": 'o',
    "õ": "o", "ó": "o", "ọ": "o", "ô": "o", "ồ": "o", "ổ": "o", "ỗ": "o", "ố": "o", "ộ": "o",
    "ơ": "o", "ờ": "o", "ở": "o", "ỡ": "o", "ớ": "o", "ợ": "o", "ù": "u", "ủ": "u", "ũ": "u",
    "ú": "u", "ụ": "u", "ư": "u", "ừ": "u", "ử": "u", "ữ": "u", "ứ": "u", "ự": "u", "ỳ": "y",
    "ỷ": "y", "ỹ": "y", "ý": "y", "ỵ": "y", "À": "A", "Ả": "A", "Ã": "A", "Á": "A", "Ạ": "A",
    "Ă": "A", "Ằ": "A", "Ẳ": "A", "Ẵ": "A", "Ắ": "A", "Ặ": "A", "Â": "A", "Ầ": "A", "Ẩ": "A",
    "Ẫ": "A", "Ấ": "A", "Ậ": "A", "Đ": "D", "È": "E", "Ẻ": "E", "Ẽ": "E", "É": "E", "Ẹ": "E",
    "Ê": "E", "Ề": "E", "Ể": "E", "Ễ": "E", "Ế": "E", "Ệ": "E", "Ì": "I", "Ỉ": "I", "Ĩ": "I",
    "Í": "I", "Ị": "I", "Ò": "O", "Ỏ": "O", "Õ": "O", "Ó": "O", "Ọ": "O", "Ô": "O", "Ồ": "O",
    "Ổ": "O", "Ỗ": "O", "Ố": "O", "Ộ": "O", "Ơ": "O", "Ờ": "O", "Ở": "O", "Ỡ": "O", "Ớ": "O",
    "Ợ": "O", "Ù": "U", "Ủ": "U", "Ũ": "U", "Ú": "U", "Ụ": "U", "Ư": "U", "Ừ": "U", "Ử": "U",
    "Ữ": "U", "Ứ": "U", "Ự": "U", "Ỳ": "Y", "Ỷ": "Y", "Ỹ": "Y", "Ý": "Y", "Ỵ": "Y"
};

function formatNumber(price, desSep = ',', groupSep = '.', number = 0) {
    if (price != parseFloat(price)) {
        price = 0;
    }
    var newstr = '';
    price = parseFloat(price);
    var p = price.toFixed(number).split(".");
    var chars = p[0].split("").reverse();
    var count = 0;
    for (let x = 0; x < chars.length; x++) {
        count++;
        if (count % 3 == 1 && count != 1) {
            newstr = chars[x] + groupSep + newstr;
        } else {
            newstr = chars[x] + newstr;
        }
    }

    if (p.length > 1) {
        newstr += desSep + p[1];
    } else if (number > 0) {
        newstr += desSep;
        for (let i = 0; i < number; i++) {
            newstr += '0';
        }
    }

    return newstr;
}

function formatPrice(price, template = null) {
    if (!template) {
        return formatNumber(price, ',', '.') + ' ₫';
    } else {
        let retval = formatNumber(price, ',', '.') + ' ₫';
        let matches = template.match(/{money}{([^a-zA-z0-9]+)}{([0-9]+)}/);
        if (matches.length > 2) {
            let separate = matches[1];
            let number = parseInt(matches[2]);
            template = template.replace(/{([^a-zA-z0-9]+)}/, '');
            template = template.replace(/{([0-9]+)}/, '');
            let decimal = separate == '.' ? ',' : '.';
            retval = template.replace('{money}', formatNumber(price, separate, decimal, number));
        }

        return retval;
    }
}

function permute(array) {
    Array.prototype.swap = function (index, otherIndex) {
        var valueAtIndex = this[index];;
        this[index] = this[otherIndex];
        this[otherIndex] = valueAtIndex;
    }
    var result = [array.slice()], length = array.length;
    for (var i = 1, heap = new Array(length).fill(0); i < length;)
        if (heap[i] < i) {
            array.swap(i, i % 2 && heap[i]);
            result.push(array.slice());
            heap[i]++;
            i = 1;
        } else {
            heap[i] = 0;
            i++;
        }
    return result;
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function canUseWebP() {
    var elem = document.createElement('canvas');

    if (!!(elem.getContext && elem.getContext('2d'))) {
        // was able or not to get WebP representation
        return elem.toDataURL('image/webp').indexOf('data:image/webp') == 0;
    }

    // very old browser like IE 8, canvas not supported
    return false;
}

webpSupport = canUseWebP();

function getImageCdn($url, $width = 0, $height = 0, $fitIn = true, $webp = true) {
    $originUrl = $url;
    if ($url.substr(0, 4) == 'http') {
        $url = $url.replace('https://', '');
        $url = $url.replace('http://', '');
    } else {
        $url = document.domain + $url;
    }
    if ($webp) {
        if( webpSupport ) {
            $webp = true;
        } else {
            $webp = false;
        }
    }

    $baseCdnUrl = "https://static.shopbay.vn/unsafe/";
    $fitIn = ($fitIn && $width && $height);
    // $fitIn = false;
    if ($fitIn) {
        $baseCdnUrl += "fit-in/";
    }
    if ($width || $height) {
        $baseCdnUrl += $width + "x" + $height + "/";
    }
    if ($fitIn || $webp) {
        $baseCdnUrl += "filters";
    }
    if ($fitIn) {
        $baseCdnUrl += "-fill-fff-";
    }
    if ($webp) {
        $baseCdnUrl += "-format-webp-";
    }
    if ($fitIn || $webp) {
        $baseCdnUrl += "/";
    }
    $baseCdnUrl += $url;
    return $baseCdnUrl;
}

function toFriendlyString(originalString) {
    if (originalString == null || originalString.length == 0) {
        return originalString;
    }
    //ELSE:
    var removedDuplicatedSpacesString = originalString.replace(/\s+/g, " ");
    var removedVietnameseCharsString = "";
    for (var idx = 0; idx < removedDuplicatedSpacesString.length; idx++) {
        var ch = removedDuplicatedSpacesString[idx];
        var alternativeChar = VIETNAMESE_N_ASCII_MAP[ch];
        if (alternativeChar != null) {
            removedVietnameseCharsString += alternativeChar;
        } else {
            removedVietnameseCharsString += ch;
        }
    }
    return removedVietnameseCharsString.toLowerCase()
        .replace(/[^0-9a-zA-Z]/g, "-")
        .replace(/\-+/g, "-");
}

function isNaturalNumber(n) {
    n = n.toString(); // force the value incase it is not
    var n1 = Math.abs(n),
        n2 = parseInt(n, 10);
    return !isNaN(n1) && n2 === n1 && n1.toString() === n;
}
