<?php $xems = \App\Xem::orderBy('id', 'desc')->paginate(40); ?>

@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">Dashboard</div>
                
                <table class="table">
                    @foreach ($xems as $xem) 
                    <tr>
                        <td>
                        {{ $xem->created_at }}</td>
                        <td>
                        {{ $xem->ten }}</td>
                        <td>
                        {{ $xem->day }}</td>
                        <td>
                        {{ $xem->month }}</td>
                        <td>
                        {{ $xem->year }}</td>
                        <td>
                        {{ $xem->gio }}</td>
                        <td>
                        {{ $xem->phut }}</td>
                        <td>
                        {{ $xem->gender }}</td>
                        <td>
                        {{ $xem->year_xem }}</td>
                        <td>
                        {{ $xem->phone }}</td>
                    </tr>
                    @endforeach
                </table>
                <div class='text-center center'>
                    {{ $xems->render() }}
                </div>
                
            </div>
        </div>
    </div>
</div>
@endsection
