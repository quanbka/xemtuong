const http = require("http");
const host = 'localhost';
const port = 8000;

const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({
  width: 1366,
  height: 768,
  deviceScaleFactor: 1,
});
  await page.goto('http://xemboi.xemtuong.net/an_sao_tu_vi/ban_in.php?name=Nguy%E1%BB%85n+H%E1%BB%93ng+Ph%C3%BAc&day=12&month=6&year=1984&gio=7&phut=00&gender=0&isLunar=&fixhour=&year_xem=2022&submit=xem&phi_tinh=&tu_hoa='
  , {waitUntil: 'networkidle0'}
);
  // await page.screenshot({ path: 'example.jpg', fullPage: true });
  // await page.emulateMediaType('screen')
  const pdf = await page.pdf({
      path: 'output.pdf',
      format: 'A4',
      // 'scale' : 0.8,
      margin: {
          top: "50px",
          right: "50px",
          bottom: "50px",
          left: "50px",
      },
      'printBackground' : true
   });

   console.log("Captured");

  await browser.close();
})();

const requestListener = function (req, res) {
    res.writeHead(200);
    res.end("My first server!");
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
