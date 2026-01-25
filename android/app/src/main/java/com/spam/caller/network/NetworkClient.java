package com.spam.caller.network;

import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class NetworkClient {
   private static Retrofit retrofit = null;

   public static Retrofit getRetrofit() {
      if (retrofit == null) {
         retrofit = new Retrofit.Builder()
               .baseUrl("http://127.0.0.1:8000") // ADB Reverse mapped to host
               .addConverterFactory(GsonConverterFactory.create())
               .build();
      }
      return retrofit;
   }
}
