<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Jobs\Crawl;
use App\TuVi;
use View;

class IndexController extends Controller
{

    public function redirect () {
        return redirect('/la-so-tu-vi');
    }

    public function index (Request $request) {
        \Log::info(url()->full());
        $tuvi = TuVi::firstOrCreate($request->only(config('fields')));
        if ($tuvi->active) {
            // code...
        } else {
            $url = $this->getOriginUrl(url()->full());
            Crawl::dispatch($request->only(config('fields')), $url);
        }

        $tuvi = TuVi::firstOrCreate($request->only(config('fields')));

        View::share('table', $this->parse($tuvi->table));
        View::share('text', $this->parse($tuvi->binh_giai));

        return view('tu-vi');
        return $response;
    }


    public function getOriginUrl ($url) {
        return str_replace(config('app.url') . 'la-so-tu-vi', 'http://tuvi.xemtuong.net/an_sao_tu_vi/index.php', $url);
    }

    public function sendRequest ($url) {

        $curl = curl_init();

        curl_setopt_array($curl, array(
          CURLOPT_URL => $url,
          CURLOPT_RETURNTRANSFER => true,
          CURLOPT_ENCODING => '',
          CURLOPT_MAXREDIRS => 10,
          CURLOPT_TIMEOUT => 0,
          CURLOPT_FOLLOWLOCATION => true,
          CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
          CURLOPT_CUSTOMREQUEST => 'GET',
          CURLOPT_HTTPHEADER => array(
            'Cookie: xtprotect=Cookie; PHPSESSID=1ke4fa89a0k4bi5gqkhqgcmgr6'
          ),
        ));

        $response = curl_exec($curl);

        curl_close($curl);
        return $response;
    }

    public function getTable ($response) {
        libxml_use_internal_errors(true);
        $doc = new \DOMDocument();
        $doc->loadHTML($response);
        $xpath = new \DOMXPath($doc);
        $titles = $xpath->query('//html/body/div[1]/div/div/div[4]/center[2]/div');
        return $this->removeAds($doc->saveHTML($titles->item(0)));
    }

    public function getText ($response) {
        libxml_use_internal_errors(true);
        $doc = new \DOMDocument();
        $doc->loadHTML($response);
        $xpath = new \DOMXPath($doc);
        $titles = $xpath->query('//html/body/div[1]/div/div/div[4]/div[2]');
        return $this->removeAds($doc->saveHTML($titles->item(0)));
    }

    public function removeAds ($html) {
        $html = str_replace('<script src="/ad_top.js"></script>', '', $html);
        $html = str_replace('http://chitay.xemtuong.net/an_sao_tu_vi/index.php', url()->current(), $html);
        $html = preg_replace('/<!--([0-9]+)-->/', '', $html);
        $html = preg_replace('/href="(.*?)"/', '', $html);
        $html = str_ireplace('Xemtuong.net', config('app.name'), $html);
        return $html;
    }

    public function parse ($html) {
        $html = preg_replace('/Name|Nguyễn Hồng Phúc/', request()->input('ten'), $html);
        return $html;
    }
}
