/* eslint-disable no-shadow */
var DomParser = require('dom-parser');
var parser = new DomParser();

// this whole function can be rewritten to with regex. Inviting PR's
function search_url(search_string, query, special_character, append_string) {
    query.forEach(element => {
        search_string = search_string + element + special_character;
    });
    search_string = search_string.slice(0, -(special_character.length));
    if (append_string) {
        search_string = search_string + append_string;
    }
    return search_string;
}

function cleanup(text, special_characters) {
    var title = text;
    special_characters.forEach(element => {
        while (title.includes(element.special_character)) {
            title = title.replace(element.special_character, element.replace_with);
        }

    });
    return title;
}

class Teckzu {
    constructor(query) {
        this.query = query;
    }
    search_string() { return search_url('https://teckzu.com/catalogsearch/result/?q=', this.query, '+', ''); }
    search_results(html) {
        var objects = [];
        var dom = parser.parseFromString(html);
        dom = dom.getElementsByClassName('item-inner ease05');
        for (const each of dom) {
            var root = parser.parseFromString(each.innerHTML);
            try {
                objects.push({ 'title': cleanup(root.getElementsByClassName('product-item-link')[0].innerHTML, [{ 'special_character': '\t', 'replace_with': '' }, { 'special_character': '\n', 'replace_with': '' }, { 'special_character': '   ', 'replace_with': '' }]), 'url': root.getElementsByTagName('a')[1].getAttribute('href'), 'image': root.getElementsByClassName('product-image-photo')[0].getAttribute('src'), 'price': parseFloat(cleanup(root.getElementsByClassName('price')[0].innerHTML, [{ 'special_character': 'AED', 'replace_with': '' }, { 'special_character': ',', 'replace_with': '' }])), 'seller': 'teckzu' });
            } catch { }
        }
        return objects;
    }
}

class Adidas {
    constructor(query) {
        this.query = query;
    }
    search_string() { return search_url('https://shop.adidas.ae/en/search/?q=', this.query, '+', ''); }
    search_results(html) {
        var objects = [];
        var dom = parser.parseFromString(html);
        dom = dom.getElementsByClassName('gl-product-card');
        for (const each of dom) {
            var root = parser.parseFromString(each.innerHTML);
            try {
                objects.push({ 'title': root.getElementsByTagName('span')[0].innerHTML, 'image': root.getElementsByTagName('img')[0].getAttribute('src'), 'price': parseFloat(cleanup(root.getElementsByClassName('price')[0].innerHTML, [{ 'special_character': 'AED', 'replace_with': '' }])), 'url': root.getElementsByTagName('a')[0].getAttribute('href'), 'seller': 'Adidas' });
            } catch { }
        }
        return objects;
    }
}

class Canon {
    constructor(query) {
        this.query = query;
    }
    search_string() { return search_url('https://uaestore.canon-me.com/search/', this.query, '+', '/'); }
    search_results(html) {
        var objects = [];
        var dom = parser.parseFromString(html);
        dom = dom.getElementsByClassName('layout-item');
        for (const each of dom) {
            var root = parser.parseFromString(each.innerHTML);
            try {
                objects.push({ 'title': cleanup(root.getElementsByClassName('pt_normal')[0].innerHTML, [{ 'special_character': '</span>', 'replace_with': '' }, { 'special_character': '<span class="pt_bold">', 'replace_with': '' }, { 'special_character': '<span class="pt_red">', 'replace_with': '' }, { 'special_character': '   ', 'replace_with': ' ' }, { 'special_character': '  ', 'replace_with': ' ' }]), 'price': parseFloat(root.getElementsByClassName('price-major')[0].innerHTML.replace(',', '')), 'image': `https:${root.getElementsByTagName('img')[0].getAttribute('data-zoom-image')}`, 'url': `https://uaestore.canon-me.com${root.getElementsByTagName('a')[0].getAttribute('href')}`, 'seller': 'Canon' });
            } catch { }
        }
        return objects;
    }
}

class Kibsons {
    constructor(query) {
        this.query = query;
    }
    search_string() { return search_url('https://kibsons.com/products/search/', this.query, '%20', '.html'); }
    search_results(html) {
        var objects = [];
        var dom = parser.parseFromString(html);
        dom = dom.getElementsByClassName('product');
        for (const each of dom) {
            var root = parser.parseFromString(each.innerHTML);
            try {
                objects.push({ 'id': '0', 'title': cleanup(root.getElementsByTagName('a')[1].innerHTML, [{ 'special_character': '&amp;', 'replace_with': '&' }, { 'special_character': '  ', 'replace_with': '' }, { 'special_character': '\n', 'replace_with': '' }]), 'image': root.getElementsByTagName('img')[0].getAttribute('data-src'), 'price': parseFloat(cleanup(root.getElementsByTagName('p')[2].innerHTML.split('/')[0], [{ 'special_character': ' ', 'replace_with': '' }, { 'special_character': '\n', 'replace_with': '' }])), 'url': `https://kibsons.com${root.getElementsByTagName('a')[0].getAttribute('href')}` });
            } catch { }
        }
        return objects;
    }
}

class FirstCry {
    constructor(query) {
        this.query = query;
    }
    search_string() { return search_url('https://www.firstcry.ae/search?q=', this.query, '%20', ''); }
    search_results(html) {
        var objects = [];
        var dom = parser.parseFromString(html);
        dom = dom.getElementsByClassName('li_inner_block');
        for (const each of dom) {
            var root = parser.parseFromString(each.innerHTML);
            try {
                if (isNaN(parseFloat(root.getElementsByTagName('a')[6].innerHTML.replace(root.getElementsByTagName('span')[4].outerHTML, '')))) { } else {
                    objects.push({ 'id': '0', 'title': cleanup(root.getElementsByTagName('a')[4].innerHTML, [{ 'special_character': '&amp;', 'replace_with': '&' }]), 'price': parseFloat(root.getElementsByTagName('a')[6].innerHTML.replace(root.getElementsByTagName('span')[4].outerHTML, '')), 'url': `https://firstcry.ae${root.getElementsByTagName('a')[0].getAttribute('href')}`, 'image': `https:${root.getElementsByTagName('img')[0].getAttribute('src')}`, 'seller': 'FirstCry' });
                }
            } catch { }
        }
        return objects;
    }
}

class LookFantastic {
    constructor(query) {
        this.query = query;
    }
    search_string() { return search_url('https://www.lookfantastic.ae/elysium.search?search=', this.query, '+', ''); }
    search_results(html) {
        var objects = [];
        var dom = parser.parseFromString(html);
        dom = dom.getElementsByClassName('productListProducts_product ');
        for (const each of dom) {
            var root = parser.parseFromString(each.innerHTML);
            try {
                objects.push({ 'id': '0', 'title': cleanup(root.getElementsByClassName('productBlock_productName')[0].innerHTML, [{ 'special_character': '\n', 'replace_with': '' }]), 'price': parseFloat(root.getElementsByClassName('productBlock_priceValue ')[0].innerHTML.replace(' AED', '')), 'image': root.getElementsByClassName('productBlock_image')[0].getAttribute('src'), 'url': 'https://www.lookfantastic.ae' + root.getElementsByClassName('productBlock_link')[0].getAttribute('href'), 'seller': 'LookFantastic' });
            } catch { }
        }
        return objects;
    }
}

class MumzWorld {
    constructor(query) {
        this.query = query;
    }
    search_string() {
        return search_url('https://www.mumzworld.com/en/#search=', this.query, '%20', '&page=0&minReviewsCount=0&minPrice=0&curmaxPrice=489.3&refinements=%5B%5D');
        // var search_string = ''
        // this.query.forEach(element => {
        //     search_string = element + "%20"
        // });
        // search_string = search_string.slice(0, -(3))
        // return `https://www.mumzworld.com/en/#search=${search_string}&page=0&minReviewsCount=0&minPrice=0&curmaxPrice=489.3&refinements=%5B%5D`
    }
    search_results(html) {
        var objects = [];
        var dom = parser.parseFromString(html);
        dom = dom.getElementsByClassName('item first btn_line');
        for (const each of dom) {
            try {
                var root = parser.parseFromString(each.innerHTML);
                objects.push({ 'id': '0', 'title': root.getElementsByTagName('a')[1].innerHTML, 'image': root.getElementsByTagName('img')[0].getAttribute('src'), 'price': parseFloat(root.getElementsByClassName('price-num')[0].innerHTML), 'url': root.getElementsByTagName('a')[0].getAttribute('href'), 'seller': 'mumzworld' });
            } catch { }
        }
        return objects;
    }
}

class OurShopee {
    constructor(query) {
        this.query = query;
    }
    search_string() { return search_url('https://www.ourshopee.com/search-results/?search_value=', this.query, '%20', ''); }
    search_results(html) {
        var objects = [];
        var dom = parser.parseFromString(html);
        dom = dom.getElementsByClassName('single-product');
        for (const each of dom) {
            const whitespaces = ['                              ', '                            '];
            var root = parser.parseFromString(each.innerHTML);
            objects.push({ 'id': '0', 'title': (root.getElementsByTagName('a')[2].innerHTML.replace('\n', '').replace(whitespaces[0], '').replace(' \n', '').replace(whitespaces[1], '')), 'url': root.getElementsByTagName('a')[1].getAttribute('href'), 'price': (parseFloat(root.getElementsByClassName('price')[0].innerHTML.replace('AED ', '').replace('<span>', '').replace('</span>', ''))), 'image': root.getElementsByTagName('img')[0].getAttribute('src'), 'seller': 'ourshopee' });
        }
        return objects;
    }
}

class Zara {
    constructor(query) {
        this.query = query;
    }
    search_string() { return search_url('https://www.zara.com/ae/en/search?searchTerm=', this.query, '%20', ''); }
    search_results(html) {
        var objects = [];
        var dom = parser.parseFromString(html);
        dom = dom.getElementsByClassName('product-grid-product _product product-grid-product--four-columns');
        for (const each of dom) {
            var root = parser.parseFromString(each.innerHTML);
            try {
                objects.push({ 'id': '0', 'title': root.getElementsByTagName('span')[1].innerHTML, 'price': parseFloat(root.getElementsByTagName('span')[2].innerHTML.replace(' AED', '')), 'image': root.getElementsByTagName('img')[0].getAttribute('src'), 'url': root.getElementsByTagName('a')[0].getAttribute('href'), 'seller': 'Zara' });
            }
            catch { }
        }
        return objects;
    }
}

class UBuy {
    constructor(query) {
        this.query = query;
    }
    search_string() { return search_url('https://www.ubuy.ae/en/search/?ref_p=ser_tp&q=', this.query, '+', ''); }
    search_results(html) {
        var objects = [];
        var dom = parser.parseFromString(html);
        dom = dom.getElementsByClassName('product-search');
        for (const each of dom) {
            var root = parser.parseFromString(each.innerHTML);
            var price = '';
            if (root.getElementsByTagName('del').length > 0) {
                price = root.getElementsByClassName('product-price')[0].innerHTML.replace(root.getElementsByTagName('del')[0].outerHTML, '').replace('AED ', '');
            } else { price = root.getElementsByClassName('product-price')[0].innerHTML.replace('AED ', '').replace('\n', ''); }
            objects.push({ 'id': '0', 'title': root.getElementsByTagName('span')[0].getAttribute('data-name'), 'image': root.getElementsByTagName('img')[0].getAttribute('data-src'), 'price': parseFloat(price), 'url': root.getElementsByTagName('a')[0].getAttribute('href'), 'seller': 'ubuy' });
        }
        return objects;
    }
}

class LetsTango {
    constructor(query) {
        this.query = query;
    }
    search_string() { return search_url('https://www.letstango.com/search?type=product&q=', this.query, '+', ''); }
    search_results(html) {
        var objects = [];
        var dom = parser.parseFromString(html);
        var products = dom.getElementsByClassName('product-wrapper');
        for (const product of products) {
            var root = parser.parseFromString(product.innerHTML);
            var price = '';
            if (root.getElementsByClassName('money').length > 1) {
                price = cleanup(root.getElementsByClassName('money')[1].innerHTML, [{ 'special_character': 'Dhs. ', 'replace_with': '' }, { 'special_character': ',', 'replace_with': '' }, { 'special_character': 'AED ', 'replace_with': '' }]);
            } else { price = cleanup(root.getElementsByClassName('money')[0].innerHTML, [{ 'special_character': 'Dhs. ', 'replace_with': '' }, { 'special_character': ',', 'replace_with': '' }, { 'special_character': 'AED ', 'replace_with': '' }]); }
            // console.log("Name: " + root.getElementsByClassName("lang1")[0].innerHTML + " Price: " + price + " URL: https://www.letstango.com" + (root.getElementsByTagName("a").pop()).getAttribute("href")+" Image: https:"+root.getElementsByTagName("img")[0].getAttribute("src"))
            objects.push({ 'id': '0', 'title': root.getElementsByClassName('lang1')[0].innerHTML, 'price': parseFloat(price), 'url': 'https://www.letstango.com' + (root.getElementsByTagName('a').pop()).getAttribute('href'), 'image': 'https:' + root.getElementsByTagName('img')[0].getAttribute('src'), 'seller': 'letstango' });
        }
        return objects;
    }
}

class GadgetBy {
    constructor(query) {
        this.query = query;
    }
    search_string() { return search_url('https://uae.gadgetby.com/catalogsearch/result/?q=', this.query, '%20', ''); }
    search_results(html) {
        var objects = [];
        var dom = parser.parseFromString(html);
        dom = dom.getElementsByClassName('item product product-item');
        for (const product of dom) {
            var root = parser.parseFromString(product.innerHTML);
            objects.push({ 'id': '0', 'title': cleanup(root.getElementsByTagName('a')[1].innerHTML, [{ 'special_character': '\n', 'replace_with': '' }]), 'url': root.getElementsByTagName('a')[0].getAttribute('href'), 'image': root.getElementsByTagName('img')[0].getAttribute('src'), 'price': parseFloat(cleanup(root.getElementsByClassName('price')[0].innerHTML, [{ 'special_character': 'AED', 'replace_with': '' }, { 'special_character': ',', 'replace_with': '' }, { 'special_character': '\n', 'replace_with': '' }])) });
        }
        return objects;
    }
}

class BrandsBay {
    constructor(query) {
        this.query = query;
    }
    search_string() { return search_url('https://brandsbay.com/ae_en/catalogsearch/result/?q=', this.query, '+', ''); }
    search_results(html) {
        var objects = [];
        var dom = parser.parseFromString(html);
        var product = dom.getElementsByTagName('ol')[0];
        products = parser.parseFromString(product.innerHTML);
        var products = products.getElementsByTagName('li');
        for (const product of products) {
            try {
                var root = parser.parseFromString(product.innerHTML);
                var price = root.getElementsByClassName('price')[0].innerHTML;
                var image = root.getElementsByTagName('img')[0];
                root = root.getElementsByClassName('product-item-link')[0];
                objects.push({ 'id': '0', 'title': cleanup(root.innerHTML, [{ 'special_character': '\n', 'replace_with': '' }, { 'special_character': '    ', 'replace_with': '' }]), 'price': parseFloat(price.replace('AED', '')), 'url': root.getAttribute('href'), 'image': image.getAttribute('src'), 'seller': 'BrandsBay' });
            } catch { }
        }
        return objects;
    }
}

class SharafDG {
    constructor(query) {
        this.query = query;
    }
    search_string() { return search_url('https://uae.sharafdg.com/?post_type=product&q=', this.query, '%20', ''); }
    search_results(html) {
        var objects = [];
        var dom = parser.parseFromString(html);
        var products = dom.getElementsByClassName('slide col-md-3 reset-padding fadeInUp');
        products.pop();
        products.splice(0, 1);
        for (const product of products) {
            try {
                var root = parser.parseFromString(product.innerHTML);
                objects.push({ 'id': '0', 'title': cleanup(root.getElementsByTagName('h4')[0].innerHTML, [{ 'special_character': '<em>', 'replace_with': '' }, { 'special_character': '</em>', 'replace_with': '' }]), 'image': 'https:' + root.getElementsByTagName('img')[0].getAttribute('src'), 'url': 'https:' + root.getElementsByTagName('a')[0].getAttribute('href'), 'price': parseFloat((root.getElementsByClassName('price')[0].innerHTML.replace(root.getElementsByClassName('currency')[0].outerHTML, '')).replace(',', '')), 'seller': 'sharafdg' });
            } catch { }
        }
        return objects;
    }
}

class Carrefour {
    constructor(query) {
        this.query = query;
    }
    search_string() { return search_url('https://www.carrefouruae.com/v4/search?currentPage=0&filter=&nextPageOffset=0&pageSize=60&sortBy=relevance&keyword=', this.query, '%2520', ''); }
    search_results(html) {
        var objects = [];
        try {
            var dom = parser.parseFromString(html);
            var json = dom.getElementById('__NEXT_DATA__');
            json = JSON.parse(json.innerHTML);
            var products = json.props.initialState.search.products;
            for (const each of products) {
                objects.push({ 'id': '0', 'title': each.name, 'url': `https://www.carrefouruae.com${each.url}`, 'image': cleanup(each.image.href, [{ 'special_character': ' ', 'replace_with': '' }]), 'price': each.discount.price > 0 ? parseFloat(each.discount.price) : parseFloat(each.originalPrice), 'seller': 'carrefour' });
            }
        } catch { }
        return objects;
    }
}

class Noon {
    constructor(query) {
        this.query = query;
    }
    search_string() { return search_url('https://www.noon.com/uae-en/search?q=', this.query, '%20', ''); }
    search_results(html) {
        var objects = [];
        try {
            var dom = parser.parseFromString(html);
            var json = dom.getElementById('__NEXT_DATA__');
            json = JSON.parse(json.innerHTML);
            var products = json.props.pageProps.catalog.hits;
            for (const product of products) {
                var price = 0;
                var title = '';
                if (product.sale_price) {
                    price = product.sale_price;
                } else { price = product.price; }
                if (product.brand) {
                    title = product.brand + ' ' + product.name;
                } else {
                    title = product.name;
                }
                objects.push({ 'id': '0', 'title': title, 'image': 'https://k.nooncdn.com/t_desktop-thumbnail-v2/' + product.image_key + '.jpg', 'url': 'https://noon.com/uae-en/product/' + product.sku + '/p', 'price': parseFloat(price), 'seller': 'noon' });
            }
        } catch { }
        return objects;
    }
}

class Amazon {
    constructor(query) {
        this.query = query;
    }
    average(html) {
        var prices = [];
        var average = 0;
        var dom = parser.parseFromString(html);
        dom = dom.getElementsByClassName('sg-col-4-of-12 s-result-item s-asin sg-col-4-of-16 sg-col sg-col-4-of-20');
        for (const each of dom.splice(0, 4)) {
            try {
                var root = parser.parseFromString(each.innerHTML);
                prices.push(parseFloat(cleanup(root.getElementsByClassName('a-offscreen')[0].innerHTML, [{ 'special_character': 'AED&nbsp;', 'replace_with': '' }, { 'special_character': ',', 'replace_with': '' }])));

            } catch { }
        }
        for (const each of prices) {
            average = average + each;
        }
        return average / prices.length;
    }
    search_string() { return search_url('https://www.amazon.ae/s?k=', this.query, '+', ''); }
    search_results(html) {
        var objects = [];
        var dom = parser.parseFromString(html);
        dom = dom.getElementsByClassName('s-result-item s-asin');
        for (const each of dom) {
            var root = parser.parseFromString(each.innerHTML);
            var url = '';
            if ((root.getElementsByClassName('a-link-normal')[0].getAttribute('href')).includes('/dp/')) {
                url = root.getElementsByClassName('a-link-normal')[0].getAttribute('href');
            } else {
                url = root.getElementsByClassName('a-link-normal')[1].getAttribute('href');
            }
            try {
                objects.push({ 'id': '0', 'title': cleanup(root.getElementsByClassName('a-size-base-plus a-color-base a-text-normal')[0].innerHTML, [{ 'special_character': '&amp;', 'replace_with': '&' }]), 'image': root.getElementsByTagName('img')[0].getAttribute('src'), 'price': parseFloat((root.getElementsByClassName('a-offscreen')[0].innerHTML.replace('AED&nbsp;', '')).replace(',', '')), 'url': 'https://www.amazon.ae' + url, 'seller': 'amazon' });
            } catch (e) { console.log(e); }
        }
        return objects;
    }
}

class Wrapper {
    constructor(query) {
        this.query = query.split(' ');
        this.map = {
            'amazon': new Amazon(this.query),
            'noon': new Noon(this.query),
            'carrefour': new Carrefour(this.query),
            'sharafdg': new SharafDG(this.query), // site needs more time to load content in crawler. Find a way to implement
            // 'gadgetby': new GadgetBy(this.query), // CRAWLER ERROR
            'teckzu': new Teckzu(this.query),
            'firstcry': new FirstCry(this.query),
            'letstango': new LetsTango(this.query),
            'lookfantastic': new LookFantastic(this.query),
            'adidas': new Adidas(this.query),
            // "canon": new Canon(this.query), Site forbids automation. Browser / user agent change required.
            // "zara": new Zara(this.query), // They load hits after ReadyState. Browser is the only way.
            // "ubuy": new UBuy(this.query), // Same issue as SharafDG
            // "kibsons": new Kibsons(this.query), // Unknown stupid bug. Try to fix
            // "ourshopee": new OurShopee(this.query), // Serious performance issues.
            // "brandsbay": new BrandsBay(this.query) // Brandsbay requires JS so doesn't work in crawler. Flagged due to performance issues.
            // "mumzworld": new MumzWorld(this.query), // Mumzworld has serious performance issues.
        };
    }
    search_url() {
        var list = [];
        for (var key in this.map) {
            if (this.map.hasOwnProperty(key)) {
                var value = this.map[key];
                list.push({ 'seller': key, 'url': value.search_string() });
            }
        }
        return list;
    }
    result(source) {
        var list = [];
        var average = 0;
        for (const each of source) {
            if (each.source) {
                if (each.seller === 'amazon') {
                    average = this.map[each.seller].average(each.source);
                }
                var temp = this.map[each.seller].search_results(each.source);
                list.push({ 'seller': each.seller, 'results': temp });
            }
        }
        return { 'list': list, 'average': average };
    }
}

module.exports = Wrapper;
