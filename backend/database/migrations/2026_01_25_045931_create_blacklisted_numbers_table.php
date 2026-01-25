<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('blacklisted_numbers', function (Blueprint $table) {
            $table->id();
            $table->string('phone_number')->unique()->index();
            $table->string('reason')->nullable();
            $table->string('source')->default('manual'); // manual, system, report
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blacklisted_numbers');
    }
};
