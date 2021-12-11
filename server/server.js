const { Worker, isMainThread, parentPort, workerData, SHARE_ENV } = require('worker_threads');
const { firefox, chromium } = require('playwright');
var Crawler = require('crawler');
const express = require('express');
const app = express();
const port = 3000;
const Wrapper = require('./assets/api');

async function main(args) {
    if (isMainThread) {
        app.get('/', (req, res) => {
            try {
                let source = [];
                const params = JSON.parse(req.query.url);
                var Results = new Wrapper(params.query);
                let urls = Results.search_url();
                const threads = new Set();
                for (const each of urls) {
                    // eslint-disable-next-line no-undef
                    threads.add(new Worker(__filename, { workerData: { url: each.url, seller: each.seller, browser: args }, env: SHARE_ENV }));
                }
                for (let worker of threads) {
                    worker.on('error', (err) => { throw err; });
                    worker.on('exit', () => {
                        threads.delete(worker);
                        if (threads.size === 0) {
                            var result = Results.result(source);
                            res.send(JSON.stringify({ 'results': result.list, 'average': result.average }));
                        }
                    });
                    worker.on('message', (msg) => {
                        source.push(msg);
                    });
                }
            } catch (e) { }
        });
        app.listen(port, () => {
            console.log(`Shopscrap server listening on http://localhost:${port}`);
        });
    } else {
        const default_timeout = 2000;
        const map = {
            'ourshopee': { 'code': '.single-product', 'timeout': 5000 },
            'brandsbay': { 'code': '.item product product-item', 'timeout': 2000 },
        };

        // these sites will be opened in a browser window. Others will use the crawler module which is faster
        const browserified = ['amazon', 'carrefour', 'teckzu', 'sharafdg', 'mumzworld', 'brandsbay', 'ourshopee', 'kibsons', 'ubuy', 'zara', 'adidas'];
        async function search(driver) {
            try {
                await driver.goto(workerData.url);
                var ismapped = '';
                for (var key in map) {
                    if (map.hasOwnProperty(key) && key === workerData.seller) {
                        ismapped = { 'code': map[key].code, 'timeout': map[key].timeout ? map[key].timeout : default_timeout };
                    } else {
                        ismapped = false;
                    }
                }
                if (!ismapped) {
                    const readyState = await driver.evaluate(() => { return document.readyState; });
                    if (readyState === 'complete') {
                        if (workerData.seller === 'carrefour') {
                            await driver.waitForTimeout(2000);
                            if (await driver.url() !== workerData.url) {
                                driver.goto(workerData.url);
                                await driver.waitForTimeout(2000);
                            }
                        }
                        const source = await driver.innerHTML('//html');
                        parentPort.postMessage({ 'seller': workerData.seller, 'source': source });
                    }
                } else {
                    try {
                        await driver.waitForSelector(ismapped.code, { timeout: ismapped.timeout });
                        const source = await driver.innerHTML('//html');
                        parentPort.postMessage({ 'seller': workerData.seller, 'source': source });
                    } catch {
                        console.log(`No response from ${workerData.seller}`);
                    }
                }
            }
            catch (e) {
                console.log(`There is a problem with ${workerData.seller}
                
                The error is logged below

                ${e}
                `);
            } finally { }
        }
        if (browserified.includes(workerData.seller)) {
            try {
                const browser = workerData.browser === 'firefox' ? await firefox.launch({ timeout: 20000 }) : await chromium.launch({ timeout: 20000 });
                const context = await browser.newContext({
                    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36',
                });
                const driver = await context.newPage();
                await search(driver);
                await browser.close();
            } catch (e) { }
        } else {
            new Crawler({
                maxConnections: 10,
                callback: function (error, res, done) {
                    if (error) {
                        console.log(error);
                    } else {
                        var $ = res.$;
                        parentPort.postMessage({ 'seller': workerData.seller, 'source': $.html() });
                    }
                    done();
                },
            }).queue(workerData.url);
        }
    }
}

main(process.argv[2]);
