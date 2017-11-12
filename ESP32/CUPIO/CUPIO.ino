#include <Servo.h>
#include <Wire.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include "MMA7660.h"


#define TEMP_PIN 33
#define SERVO_PIN 25

#define UP_ANGLE 70
#define DOWN_ANGLE 140
#define OUT_ANGLE 30
#define TEMP_COEFF 1.045

#define WIFI_DELAY 500


#define IP_ADDR "10.42.0.1"
#define HTTP_PORT "3000"

MMA7660 accelemeter;
Servo myservo; 

int dip_delay = 1000;

boolean dip = 0;
boolean servo_position = 0;


const char* ssid     = "NSA-data-collection-van-#42";
const char* password = "cupio2017";



const char* host = "data.sparkfun.com";

void setup() {
  Serial.begin(115200);

  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  
  
  myservo.attach(SERVO_PIN);  // attaches the servo on pin 9 to the servo object
  
  
  
  accelemeter.init();  
}

void loop(){
  static int wifiTimer = millis();

  boolean sip = 0;
  double temperature = 0;
  static boolean pulled_out = 0;

  if(dip == 1){
    pulled_out = 0;
    dipf();
  } 
  else if (dip == 0 && pulled_out == 0) {
    pulled_out = 1;
    myservo.write(OUT_ANGLE);
  }

  int now = millis();
  
  if((now - wifiTimer) > WIFI_DELAY) {
    wifiTimer = now;
    sip= getSips();
    
    temperature = getTemperature();
    
    
    Serial.print("Temperature: ");
    Serial.println(temperature);
    Serial.print("sip:");
    Serial.println(sip);
      
    delay(100);
    
  
    dip = getDipping(getData(IP_ADDR, HTTP_PORT, "/cup/commands"));
    postData(IP_ADDR, HTTP_PORT, "/cup/temp", String("{\"temp\":")+temperature + "}");
    
    if(sip)
      postData(IP_ADDR, HTTP_PORT, "/cup/sip", "");
    
  }
}


boolean getDipping(String json){
  int location = json.indexOf("dipping") + 9;
  
  if(json.substring(location,location+1) == String("t")){
    return 1;
  } else {
    return 0;
  }
}


String getData(String address, String port, String url){
  HTTPClient http;
  String response = "";
  
  if (WiFi.status()== WL_CONNECTED){   //Check WiFi connection status
    
    HTTPClient http;   
    
    http.begin("http://" + address + ":" + port + url);  //Specify destination for HTTP request
    http.addHeader("Content-Type", "application/json");             //Specify content-type header
 
    int httpResponseCode = http.GET();   //Send the actual POST request
 
    if (httpResponseCode>0){
      response = http.getString();                       //Get the response to the request
 
      //Serial.println(httpResponseCode);   //Print return code
      //Serial.println(response);           //Print request answer
 
   } else {
      Serial.print("Error on sending GET: ");
      Serial.println(httpResponseCode);
   }
   http.end();  //Free resources
  } else {
    Serial.println("Error in WiFi connection");   
  }
  return response;
}

void postData(String address, String port, String url, String data){
  HTTPClient http;
  if (WiFi.status()== WL_CONNECTED){   //Check WiFi connection status
    
    HTTPClient http;   
    
    http.begin("http://" + address + ":" + port + url);  //Specify destination for HTTP request
    http.addHeader("Content-Type", "application/json");             //Specify content-type header
 
    int httpResponseCode = http.POST(data);   //Send the actual POST request
 
    if (httpResponseCode>0){
      //String response = http.getString();                       //Get the response to the request
 
      //Serial.println(httpResponseCode);   //Print return code
      //Serial.println(response);           //Print request answer
 
   } else {
 
      Serial.print("Error on sending POST: ");
      Serial.println(httpResponseCode);
 
   }
 
   http.end();  //Free resources
 
  } else {
 
    Serial.println("Error in WiFi connection");   
 
  }
  
  
}


boolean getSips(){
  int8_t x;
  int8_t y;
  int8_t z;


  accelemeter.getXYZ(&x,&y,&z);

  static boolean tilt = 0;

  if(( y > 10 && y < 40) /*&& tilt == 0*/){
    tilt = 1;
    return 1;
  } else if(( y < 10 || y > 40 ) /*&& tilt == 1*/){
    tilt = 0;
    return 0;
  }
  return 0;
}


double getTemperature(void){
  int sensorValue = analogRead(TEMP_PIN);
  double Vout = (3.300) * sensorValue/ 4096.0;
  return (Vout-TEMP_COEFF)/0.005;  
}



void dipf() {
  static int time2 = millis();
  int now = millis();
  
  if(now - time2 > dip_delay ){
    if(servo_position == 1){
    myservo.write(UP_ANGLE);
    servo_position = 0;
   } else if(servo_position == 0){
    myservo.write(DOWN_ANGLE);
    servo_position = 1;
   }
  time2 = now;
  }
}
