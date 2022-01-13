<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use App\Tuvi;

class Crawl implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;


    protected $input;
    protected $url;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($input, $url)
    {
        $this->input = $input;
        $this->url = $url;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $tuvi = TuVi::firstOrCreate($this->input);
        if ($tuvi->active) {
            // code...
        } else {
            $tuvi->response = $this->sendRequest($this->url);
            $tuvi->table = $this->getTable($tuvi->response);
            $tuvi->binh_giai = $this->getText($tuvi->response);

            if (strpos($tuvi->binh_giai, 'Giới Thiệu')) {
                $tuvi->active = true;
            }
            $tuvi->table_md5 = md5($tuvi->table);
            $tuvi->binh_giai_md5 = md5($tuvi->binh_giai);
            $tuvi->save();

        }

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
}
